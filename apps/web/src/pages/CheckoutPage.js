import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonLink, Card, Checkbox, EmptyState, Icon, Input, Price, Rule, SectionHeading, Select, Textarea, } from '@/components/ui';
import { checkoutSchema, PAYMENT_METHOD_OPTIONS } from '@/features/checkout/schema';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api, ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatPoints } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CheckoutPage.module.css';
export default function CheckoutPage() {
    const { cart, totals, clear } = useCart();
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { paymentMethod: 'card' },
        // Se valida al salir del campo: no regañamos mientras se escribe.
        mode: 'onBlur',
    });
    // Si hay sesión, rellenamos lo que ya sabemos de la persona.
    useEffect(() => {
        if (!user)
            return;
        if (user.firstName)
            setValue('firstName', user.firstName);
        if (user.lastName)
            setValue('lastName', user.lastName);
        setValue('email', user.email);
    }, [user, setValue]);
    async function onSubmit(values) {
        try {
            // Equivale a `POST /api/v1/checkout` → `sp_checkout`. Los puntos van con
            // `taxableBase` (para ganar) y `redeemedPoints` (para canjear): el
            // servidor los recalcula con su propia tasa, nunca confía en la del cliente.
            const result = await api.cart.checkout({
                items: cart.lines.map((line) => ({
                    itemType: line.itemType,
                    suitModelId: line.suitModelId,
                    fabricId: line.fabricId,
                    productId: line.productId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    selectedOptions: line.selectedOptions,
                })),
                subtotal: totals.subtotal,
                discountAmount: totals.couponDiscount,
                taxableBase: totals.taxableBase,
                tax: totals.tax,
                total: totals.total,
                dueNow: totals.dueNow,
                requiresAppointment: totals.requiresAppointment,
                customerId: user?.customerId ?? null,
                pointsToRedeem: cart.redeemedPoints,
                couponCode: cart.coupon?.code ?? null,
                contact: values,
            });
            clear();
            toast.success('Pedido confirmado', `Tu número de pedido es ${result.orderNumber}.`);
            navigate(paths.checkoutSuccess(result.orderNumber), {
                state: {
                    dueNow: result.dueNow,
                    requiresAppointment: result.requiresAppointment,
                    pointsEarned: result.pointsEarned,
                },
                replace: true,
            });
        }
        catch (error) {
            toast.error('No pudimos confirmar el pedido', error instanceof ApiError ? error.message : 'Inténtalo de nuevo en unos segundos.');
        }
    }
    if (cart.lines.length === 0) {
        return (_jsx("div", { className: cx('re-container', l.sectionFirst), children: _jsx(EmptyState, { icon: "cart", title: "No hay nada que pagar", description: "Tu carrito est\u00E1 vac\u00EDo. Elige un traje o un accesorio para continuar.", action: _jsx(ButtonLink, { to: paths.catalog, variant: "primary", children: "Ver el cat\u00E1logo" }) }) }));
    }
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Paso 5 de 8 \u00B7 Pago", title: "Confirma tu pedido", description: "Solo cobramos el anticipo de los trajes a medida; el saldo se paga en la entrega." }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: cx(l.withSummary, l.afterHeading, s.body), noValidate: true, children: [_jsxs("div", { className: s.fields, children: [_jsxs("fieldset", { className: s.fieldset, children: [_jsx("legend", { className: s.legend, children: "Tus datos" }), _jsxs("div", { className: s.grid2, children: [_jsx(Input, { label: "Nombre", required: true, autoComplete: "given-name", error: errors.firstName?.message, ...register('firstName') }), _jsx(Input, { label: "Apellidos", required: true, autoComplete: "family-name", error: errors.lastName?.message, ...register('lastName') }), _jsx(Input, { label: "Correo electr\u00F3nico", type: "email", required: true, autoComplete: "email", hint: "Aqu\u00ED te enviaremos el n\u00FAmero de pedido y los avisos de prueba.", error: errors.email?.message, ...register('email') }), _jsx(Input, { label: "Tel\u00E9fono", type: "tel", required: true, autoComplete: "tel", placeholder: "+502 5555 1234", error: errors.phone?.message, ...register('phone') })] })] }), _jsxs("fieldset", { className: s.fieldset, children: [_jsx("legend", { className: s.legend, children: "Direcci\u00F3n de entrega" }), _jsxs("div", { className: s.grid2, children: [_jsx(Input, { label: "Direcci\u00F3n", required: true, autoComplete: "address-line1", fieldClassName: s.span2, error: errors.addressLine1?.message, ...register('addressLine1') }), _jsx(Input, { label: "Ciudad", required: true, autoComplete: "address-level2", error: errors.city?.message, ...register('city') }), _jsx(Input, { label: "Departamento", autoComplete: "address-level1", error: errors.state?.message, ...register('state') }), _jsx(Input, { label: "C\u00F3digo postal", autoComplete: "postal-code", error: errors.postalCode?.message, ...register('postalCode') })] })] }), _jsxs("fieldset", { className: s.fieldset, children: [_jsx("legend", { className: s.legend, children: "Forma de pago" }), _jsx(Select, { label: "M\u00E9todo", required: true, options: PAYMENT_METHOD_OPTIONS, error: errors.paymentMethod?.message, ...register('paymentMethod') }), _jsx(Textarea, { label: "Nota para el taller", placeholder: "Por ejemplo: lo necesito antes del 20 de septiembre.", hint: "Opcional. Lo leer\u00E1 quien corte tu traje.", error: errors.note?.message, ...register('note') }), _jsx(Checkbox, { label: "Acepto las condiciones de encargo y la pol\u00EDtica de ajustes.", error: errors.acceptsTerms?.message, ...register('acceptsTerms') })] })] }), _jsx("aside", { className: l.summaryColumn, children: _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Tu pedido", subtitle: `${totals.itemCount} artículos` }), _jsxs(Card.Body, { children: [_jsx("ul", { role: "list", className: s.recap, children: cart.lines.map((line) => (_jsxs("li", { children: [_jsxs("span", { className: s.recapQty, children: [line.quantity, "\u00D7"] }), _jsx("span", { className: s.recapName, children: line.displayName }), _jsx("span", { className: s.recapPrice, children: formatCurrency(line.unitPrice * line.quantity) })] }, line.lineId))) }), _jsx(Rule, { variant: "stitch", className: s.rule }), _jsxs("dl", { className: s.totals, children: [_jsxs("div", { children: [_jsx("dt", { children: "Subtotal" }), _jsx("dd", { children: formatCurrency(totals.subtotal) })] }), totals.couponDiscount > 0 ? (_jsxs("div", { className: s.discount, children: [_jsx("dt", { children: "Descuento del cup\u00F3n" }), _jsxs("dd", { children: ["\u2212", formatCurrency(totals.couponDiscount)] })] })) : null, totals.pointsDiscount > 0 ? (_jsxs("div", { className: s.discount, children: [_jsx("dt", { children: "Descuento por puntos" }), _jsxs("dd", { children: ["\u2212", formatCurrency(totals.pointsDiscount)] })] })) : null, _jsxs("div", { children: [_jsx("dt", { children: "IVA" }), _jsx("dd", { children: formatCurrency(totals.tax) })] }), _jsxs("div", { className: s.grandTotal, children: [_jsx("dt", { children: "Total" }), _jsx("dd", { children: formatCurrency(totals.total) })] })] }), _jsxs("div", { className: s.dueNow, children: [_jsx("span", { children: "A pagar ahora" }), _jsx(Price, { amount: totals.dueNow, size: "lg" })] }), totals.balanceLater > 0 ? (_jsxs("p", { className: s.balance, children: ["Quedan ", formatCurrency(totals.balanceLater), " para la entrega."] })) : null, totals.estimatedPointsEarned > 0 ? (_jsxs("p", { className: s.balance, children: ["Este pedido te dejar\u00E1 ", formatPoints(totals.estimatedPointsEarned), "."] })) : null] }), _jsxs(Card.Footer, { className: s.footer, children: [_jsx(Button, { type: "submit", variant: "primary", size: "lg", fullWidth: true, isLoading: isSubmitting, children: "Confirmar y pagar" }), totals.requiresAppointment ? (_jsxs("p", { className: s.note, children: [_jsx(Icon, { name: "calendar", size: 14 }), "Al confirmar te llevaremos a agendar la cita de medidas."] })) : null] })] }) })] })] }));
}
//# sourceMappingURL=CheckoutPage.js.map