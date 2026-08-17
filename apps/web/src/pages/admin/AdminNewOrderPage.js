import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, EmptyState, Icon, IconButton, Input, OptionCard, Price, QuantityStepper, Rule, SectionHeading, Select, Skeleton, Textarea, } from '@/components/ui';
import { useAdminCustomer, useAdminCustomers, useAdminFabrics, useAdminProducts, useAdminSuits, useCreateCustomer, useCreateOrder, } from '@/features/admin/hooks';
import { MeasurementModal } from '@/features/admin/MeasurementModal';
import { useOptionGroups } from '@/features/catalog/hooks';
import { describeOptions, priceMadeToMeasure, DEPOSIT_RATE, METERS_PER_SUIT, TAX_RATE } from '@/features/cart/pricing';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency } from '@/lib/format';
import { isValidEmail, isValidName, isValidPhoneGT } from '@/lib/validation';
import { randomId } from '@/lib/id';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './admin.module.css';
const PAYMENT_METHODS = [
    { id: 1, name: 'Efectivo' },
    { id: 2, name: 'Tarjeta de crédito' },
    { id: 3, name: 'Transferencia bancaria' },
];
function round(value) {
    return Math.round(value * 100) / 100;
}
export default function AdminNewOrderPage() {
    const [searchParams] = useSearchParams();
    const preselected = Number(searchParams.get('customerId')) || null;
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    const staffName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Personal del taller';
    // ── Cliente ──────────────────────────────────────────────────────────────
    const [customerId, setCustomerId] = useState(preselected);
    const [creatingCustomer, setCreatingCustomer] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const { data: customers } = useAdminCustomers();
    const { data: selectedCustomer } = useAdminCustomer(customerId ?? undefined);
    const createCustomer = useCreateCustomer();
    // ── Catálogo ─────────────────────────────────────────────────────────────
    const { data: suits, isLoading: loadingSuits } = useAdminSuits();
    const { data: fabrics, isLoading: loadingFabrics } = useAdminFabrics();
    const { data: products, isLoading: loadingProducts } = useAdminProducts();
    const { data: optionGroups, isLoading: loadingOptions } = useOptionGroups();
    // ── Artículo en construcción ─────────────────────────────────────────────
    const [itemType, setItemType] = useState('made_to_measure');
    const [suitModelId, setSuitModelId] = useState(null);
    const [fabricId, setFabricId] = useState(null);
    const [selections, setSelections] = useState({});
    const [measurementSetId, setMeasurementSetId] = useState(null);
    const [mtmQuantity, setMtmQuantity] = useState(1);
    const [measureModalOpen, setMeasureModalOpen] = useState(false);
    const [productId, setProductId] = useState(null);
    const [rtwQuantity, setRtwQuantity] = useState(1);
    const [items, setItems] = useState([]);
    // ── Pago ─────────────────────────────────────────────────────────────────
    const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
    const [depositAmount, setDepositAmount] = useState('');
    const [note, setNote] = useState('');
    const createOrder = useCreateOrder();
    const suit = suits?.find((item) => item.id === suitModelId) ?? null;
    const fabric = fabrics?.find((item) => item.id === fabricId) ?? null;
    const product = products?.find((item) => item.id === productId) ?? null;
    const defaults = useMemo(() => {
        if (!optionGroups)
            return {};
        return Object.fromEntries(optionGroups.filter((group) => group.isRequired && group.values[0]).map((group) => [group.id, group.values[0].id]));
    }, [optionGroups]);
    const effectiveSelections = { ...defaults, ...selections };
    const selectedOptionIds = Object.values(effectiveSelections);
    const mtmUnitPrice = suit && fabric && optionGroups ? priceMadeToMeasure(suit, fabric, selectedOptionIds, optionGroups) : null;
    function addMadeToMeasureItem() {
        if (!suit || !fabric || mtmUnitPrice === null || !optionGroups)
            return;
        setItems((current) => [
            ...current,
            {
                key: randomId('item'),
                itemType: 'made_to_measure',
                suitModelId: suit.id,
                fabricId: fabric.id,
                productId: null,
                measurementSetId,
                quantity: mtmQuantity,
                unitPrice: mtmUnitPrice,
                displayName: suit.name,
                displaySubtitle: `${fabric.name} · ${suit.styleName}`,
                customizations: describeOptions(selectedOptionIds, optionGroups).map((option) => ({
                    optionValueId: option.id,
                    groupName: option.groupName,
                    optionName: option.name,
                    priceDelta: option.priceDelta,
                })),
            },
        ]);
        setSuitModelId(null);
        setFabricId(null);
        setSelections({});
        setMeasurementSetId(null);
        setMtmQuantity(1);
    }
    function addReadyToWearItem() {
        if (!product)
            return;
        setItems((current) => [
            ...current,
            {
                key: randomId('item'),
                itemType: 'ready_to_wear',
                suitModelId: null,
                fabricId: null,
                productId: product.id,
                measurementSetId: null,
                quantity: rtwQuantity,
                unitPrice: product.price,
                displayName: product.name,
                displaySubtitle: product.categoryName,
                customizations: [],
            },
        ]);
        setProductId(null);
        setRtwQuantity(1);
    }
    function removeItem(key) {
        setItems((current) => current.filter((item) => item.key !== key));
    }
    const subtotal = round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
    const tax = round(subtotal * TAX_RATE);
    const total = round(subtotal + tax);
    const mtmSubtotal = round(items
        .filter((item) => item.itemType === 'made_to_measure')
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
    const rtwSubtotal = round(subtotal - mtmSubtotal);
    const suggestedDeposit = round((mtmSubtotal * DEPOSIT_RATE + rtwSubtotal) * (1 + TAX_RATE));
    const depositValue = Number(depositAmount) || 0;
    const balanceDue = round(total - depositValue);
    async function handleSubmit(event) {
        event.preventDefault();
        if (items.length === 0) {
            toast.error('Falta el artículo', 'Agrega al menos un artículo al pedido.');
            return;
        }
        const trimmedDeposit = depositAmount.trim();
        const parsedDeposit = trimmedDeposit === '' ? 0 : Number(trimmedDeposit);
        if (!Number.isFinite(parsedDeposit) || parsedDeposit < 0) {
            toast.error('Anticipo inválido', 'Escribe un monto válido, mayor o igual a Q 0.00.');
            return;
        }
        if (parsedDeposit > total) {
            toast.error('Anticipo inválido', 'El anticipo no puede ser mayor que el total del pedido.');
            return;
        }
        let finalCustomerId = customerId;
        try {
            if (creatingCustomer) {
                if (!isValidName(newFirstName) || !isValidName(newLastName)) {
                    toast.error('Revisa el nombre', 'Nombre y apellidos deben tener entre 2 y 60 letras.');
                    return;
                }
                if (!isValidEmail(newEmail)) {
                    toast.error('Revisa el correo', 'Ingresa un correo válido, ej. nombre@dominio.com.');
                    return;
                }
                if (newPhone.trim() && !isValidPhoneGT(newPhone)) {
                    toast.error('Revisa el teléfono', 'Ingresa un teléfono válido de 8 dígitos (ej. 5555-1234).');
                    return;
                }
                const created = await createCustomer.mutateAsync({
                    firstName: newFirstName,
                    lastName: newLastName,
                    email: newEmail,
                    phone: newPhone,
                });
                finalCustomerId = created.id;
            }
            if (!finalCustomerId) {
                toast.error('Falta el cliente', 'Elige un cliente o registra uno nuevo.');
                return;
            }
            const paymentMethod = PAYMENT_METHODS.find((method) => method.id === paymentMethodId);
            const order = await createOrder.mutateAsync({
                customerId: finalCustomerId,
                items: items.map((item) => ({
                    itemType: item.itemType,
                    suitModelId: item.suitModelId,
                    fabricId: item.fabricId,
                    productId: item.productId,
                    measurementSetId: item.measurementSetId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    customizations: item.customizations,
                })),
                paymentMethodId: paymentMethod.id,
                paymentMethodName: paymentMethod.name,
                depositAmount: parsedDeposit,
                note: note || undefined,
                createdByName: staffName || 'Personal del taller',
            });
            toast.success('Pedido creado', `Número de pedido ${order.orderNumber}.`);
            navigate(paths.adminOrder(order.orderNumber));
        }
        catch (error) {
            toast.error('No se pudo crear el pedido', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    const measurementOptions = (selectedCustomer?.measurementSets ?? []).map((set) => ({
        value: set.id,
        label: `Tomadas el ${new Date(set.takenAt).toLocaleDateString('es-GT')}${set.takenByName ? ` — ${set.takenByName}` : ''}`,
    }));
    const isSubmitting = createOrder.isPending || createCustomer.isPending;
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: _jsx(Link, { to: paths.adminOrders, children: "\u2190 Pedidos" }), title: "Nuevo pedido", description: "Para clientes que llegan al mostrador: sin carrito, sin checkout web." }), _jsxs("form", { onSubmit: handleSubmit, className: cx(l.withSummary, l.afterHeading), children: [_jsxs("div", { className: l.stack, children: [_jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Cliente" }), _jsx(Card.Body, { children: !creatingCustomer ? (_jsxs(_Fragment, { children: [_jsx(Select, { label: "Cliente", placeholder: "Elige un cliente", value: customerId ?? '', onChange: (event) => setCustomerId(event.target.value ? Number(event.target.value) : null), options: (customers ?? []).map((customer) => ({
                                                        value: customer.id,
                                                        label: `${customer.firstName} ${customer.lastName} — ${customer.email}`,
                                                    })) }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", leftIcon: _jsx(Icon, { name: "plus", size: 14 }), onClick: () => {
                                                        setCreatingCustomer(true);
                                                        setCustomerId(null);
                                                    }, children: "Registrar cliente nuevo" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: s.formGrid2, children: [_jsx(Input, { label: "Nombre", required: true, value: newFirstName, onChange: (e) => setNewFirstName(e.target.value) }), _jsx(Input, { label: "Apellidos", required: true, value: newLastName, onChange: (e) => setNewLastName(e.target.value) }), _jsx(Input, { label: "Correo electr\u00F3nico", type: "email", required: true, fieldClassName: s.span2, value: newEmail, onChange: (e) => setNewEmail(e.target.value) }), _jsx(Input, { label: "Tel\u00E9fono", type: "tel", placeholder: "+502 5555 1234", fieldClassName: s.span2, value: newPhone, onChange: (e) => setNewPhone(e.target.value) })] }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setCreatingCustomer(false), children: "Elegir un cliente existente" })] })) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Art\u00EDculos", subtitle: "Agrega uno o varios a la vez." }), _jsxs(Card.Body, { children: [_jsxs("div", { className: l.row, children: [_jsx(OptionCard, { layout: "tile", name: "tipo-articulo", value: "made_to_measure", checked: itemType === 'made_to_measure', onChange: () => setItemType('made_to_measure'), title: "Traje a medida" }), _jsx(OptionCard, { layout: "tile", name: "tipo-articulo", value: "ready_to_wear", checked: itemType === 'ready_to_wear', onChange: () => setItemType('ready_to_wear'), title: "Listo para llevar" })] }), itemType === 'made_to_measure' ? (loadingSuits || loadingFabrics || loadingOptions ? (_jsx(Skeleton, { height: "220px", radius: "var(--radius-md)" })) : (_jsxs("div", { className: s.builderBody, children: [_jsx(Select, { label: "Modelo", placeholder: "Elige un traje", value: suitModelId ?? '', onChange: (event) => setSuitModelId(event.target.value ? Number(event.target.value) : null), options: (suits ?? [])
                                                            .filter((item) => item.isActive)
                                                            .map((item) => ({ value: item.id, label: `${item.name} — ${formatCurrency(item.basePrice)}` })) }), _jsx(Select, { label: "Tela", placeholder: "Elige una tela", value: fabricId ?? '', onChange: (event) => setFabricId(event.target.value ? Number(event.target.value) : null), options: (fabrics ?? [])
                                                            .filter((item) => item.isActive)
                                                            .map((item) => ({
                                                            value: item.id,
                                                            label: `${item.name} — ${item.stockMeters} m disponibles`,
                                                            disabled: item.stockMeters < METERS_PER_SUIT,
                                                        })) }), (optionGroups ?? []).map((group) => (_jsx(Select, { label: group.name, placeholder: group.isRequired ? undefined : 'Sin elegir', value: effectiveSelections[group.id] ?? '', onChange: (event) => setSelections((current) => ({ ...current, [group.id]: Number(event.target.value) })), options: group.values.map((value) => ({
                                                            value: value.id,
                                                            label: value.priceDelta !== 0
                                                                ? `${value.name} (${value.priceDelta > 0 ? '+' : '−'}${formatCurrency(Math.abs(value.priceDelta))})`
                                                                : value.name,
                                                        })) }, group.id))), _jsxs("div", { className: l.rowBetween, children: [_jsx(Select, { label: "Ficha de medidas", fieldClassName: l.grow, placeholder: creatingCustomer || !customerId
                                                                    ? 'Elige un cliente para ver sus fichas'
                                                                    : 'Se tomará después, en su cita', value: measurementSetId ?? '', disabled: creatingCustomer || !customerId || measurementOptions.length === 0, onChange: (event) => setMeasurementSetId(event.target.value ? Number(event.target.value) : null), options: measurementOptions }), !creatingCustomer && customerId ? (_jsx(Button, { type: "button", variant: "ghost", size: "sm", leftIcon: _jsx(Icon, { name: "ruler", size: 14 }), onClick: () => setMeasureModalOpen(true), children: "Tomar medidas" })) : null] }), _jsxs("div", { className: l.rowBetween, children: [_jsx(QuantityStepper, { label: "Cantidad", value: mtmQuantity, onChange: setMtmQuantity, min: 1, max: 5, size: "sm" }), mtmUnitPrice !== null ? _jsx(Price, { amount: mtmUnitPrice, size: "md" }) : null] }), _jsx(Button, { type: "button", variant: "secondary", leftIcon: _jsx(Icon, { name: "plus", size: 14 }), disabled: !suit || !fabric, onClick: addMadeToMeasureItem, children: "Agregar art\u00EDculo a medida" })] }))) : loadingProducts ? (_jsx(Skeleton, { height: "140px", radius: "var(--radius-md)" })) : (_jsxs("div", { className: s.builderBody, children: [_jsx(Select, { label: "Producto", placeholder: "Elige un accesorio", value: productId ?? '', onChange: (event) => setProductId(event.target.value ? Number(event.target.value) : null), options: (products ?? [])
                                                            .filter((item) => item.isActive && item.stock > 0)
                                                            .map((item) => ({ value: item.id, label: `${item.name} — ${formatCurrency(item.price)}` })) }), _jsxs("div", { className: l.rowBetween, children: [_jsx(QuantityStepper, { label: "Cantidad", value: rtwQuantity, onChange: setRtwQuantity, min: 1, max: product?.stock ?? 99, size: "sm" }), product ? _jsx(Price, { amount: product.price, size: "md" }) : null] }), _jsx(Button, { type: "button", variant: "secondary", leftIcon: _jsx(Icon, { name: "plus", size: 14 }), disabled: !product, onClick: addReadyToWearItem, children: "Agregar accesorio" })] })), _jsx(Rule, { variant: "stitch", className: s.ruleGap }), items.length === 0 ? (_jsx(EmptyState, { size: "sm", icon: "package", title: "Todav\u00EDa no hay art\u00EDculos en este pedido" })) : (_jsx("div", { className: s.lineItems, children: items.map((item) => (_jsxs("div", { className: s.lineItem, children: [_jsxs("div", { children: [_jsxs("span", { className: s.lineItemName, children: [item.quantity, " \u00D7 ", item.displayName] }), item.displaySubtitle ? _jsx("span", { className: s.lineItemSub, children: item.displaySubtitle }) : null] }), _jsx(Price, { amount: round(item.unitPrice * item.quantity), size: "sm" }), _jsx(IconButton, { label: "Quitar art\u00EDculo", icon: _jsx(Icon, { name: "trash", size: 16 }), onClick: () => removeItem(item.key) })] }, item.key))) }))] })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Pago" }), _jsxs(Card.Body, { children: [_jsxs("div", { className: s.formGrid2, children: [_jsx(Select, { label: "M\u00E9todo de pago", value: paymentMethodId, onChange: (event) => setPaymentMethodId(Number(event.target.value)), options: PAYMENT_METHODS.map((method) => ({ value: method.id, label: method.name })) }), _jsx(Input, { label: "Monto pagado ahora", type: "number", min: "0", step: "0.01", hint: total > 0
                                                            ? `Sugerido (50 % de anticipo en lo a medida): ${formatCurrency(suggestedDeposit)}`
                                                            : undefined, value: depositAmount, onChange: (event) => setDepositAmount(event.target.value) })] }), total > 0 ? (_jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setDepositAmount(String(suggestedDeposit)), children: "Usar el anticipo sugerido" })) : null, _jsx(Textarea, { label: "Nota para el taller", placeholder: "Por ejemplo: lo necesita antes del 20 de septiembre.", hint: "Opcional.", value: note, onChange: (event) => setNote(event.target.value) })] })] })] }), _jsx("aside", { className: l.summaryColumn, children: _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Resumen", subtitle: `${items.length} artículo(s)` }), _jsxs(Card.Body, { children: [items.length === 0 ? (_jsx("p", { className: s.cellSub, children: "Agrega art\u00EDculos para ver el total." })) : (_jsx("ul", { role: "list", className: s.lineItems, children: items.map((item) => (_jsxs("li", { className: s.cellSub, children: [item.quantity, "\u00D7 ", item.displayName, " \u2014 ", formatCurrency(round(item.unitPrice * item.quantity))] }, item.key))) })), _jsx(Rule, { variant: "stitch", className: s.ruleGapSm }), _jsxs("dl", { className: s.totals, children: [_jsxs("div", { children: [_jsx("dt", { children: "Subtotal" }), _jsx("dd", { children: formatCurrency(subtotal) })] }), _jsxs("div", { children: [_jsx("dt", { children: "IVA" }), _jsx("dd", { children: formatCurrency(tax) })] }), _jsxs("div", { className: s.grandTotal, children: [_jsx("dt", { children: "Total" }), _jsx("dd", { children: formatCurrency(total) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Pagado ahora" }), _jsx("dd", { children: formatCurrency(depositValue) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Saldo pendiente" }), _jsx("dd", { children: formatCurrency(Math.max(0, balanceDue)) })] })] })] }), _jsx(Card.Footer, { children: _jsx(Button, { type: "submit", variant: "primary", fullWidth: true, isLoading: isSubmitting, children: "Confirmar pedido" }) })] }) })] }), customerId ? (_jsx(MeasurementModal, { open: measureModalOpen, onClose: () => setMeasureModalOpen(false), customerId: customerId, onSaved: (set) => setMeasurementSetId(set.id) })) : null] }));
}
//# sourceMappingURL=AdminNewOrderPage.js.map