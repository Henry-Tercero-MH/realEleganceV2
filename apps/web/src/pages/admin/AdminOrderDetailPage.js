import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, ButtonLink, Card, EmptyState, Icon, Input, Modal, OrderStatusBadge, Price, SectionHeading, Select, Skeleton, Textarea, } from '@/components/ui';
import { CLOSED_ORDER_STATUSES, ORDER_STATUSES, ORDER_STATUS_LABELS } from '@real-elegance/shared';
import { useAdminAppointments, useAdminOrder, useRecordPayment, useUpdateOrderStatus } from '@/features/admin/hooks';
import { useResendConfirmation } from '@/features/orders/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime, formatPoints } from '@/lib/format';
import { downloadReceipt } from '@/lib/receipt';
import s from './admin.module.css';
/** Mismos ids que usa el pedido de mostrador: un pago no distingue de dónde vino. */
const PAYMENT_METHODS = [
    { id: 1, name: 'Efectivo' },
    { id: 2, name: 'Tarjeta de crédito' },
    { id: 3, name: 'Transferencia bancaria' },
];
export default function AdminOrderDetailPage() {
    const { orderNumber } = useParams();
    const { data: order, isLoading, isError } = useAdminOrder(orderNumber);
    const { data: appointments } = useAdminAppointments();
    const { user } = useAuth();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const resendConfirmation = useResendConfirmation();
    const toast = useToast();
    const staffName = user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Personal del taller'
        : 'Personal del taller';
    async function handleResend() {
        if (!order)
            return;
        try {
            const { sentTo } = await resendConfirmation.mutateAsync(order.orderNumber);
            toast.success('Confirmación reenviada', `La enviamos a ${sentTo}.`);
        }
        catch (error) {
            toast.error('No se pudo reenviar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    if (isLoading) {
        return _jsx(Skeleton, { height: "480px", radius: "var(--radius-md)" });
    }
    if (isError || !order) {
        return (_jsx(EmptyState, { tone: "error", title: "No encontramos ese pedido", action: _jsx(ButtonLink, { to: paths.adminOrders, variant: "primary", children: "Volver a pedidos" }) }));
    }
    const isClosed = CLOSED_ORDER_STATUSES.includes(order.statusCode);
    const nextAppointment = (appointments ?? [])
        .filter((item) => item.orderId === order.id && item.status === 'scheduled')
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: _jsx(Link, { to: paths.adminOrders, children: "\u2190 Pedidos" }), title: order.orderNumber, description: _jsx(Link, { to: paths.adminCustomer(order.customerId), className: s.mono, children: order.customerName }), action: _jsx(OrderStatusBadge, { status: order.statusCode }) }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Body, { children: _jsxs("dl", { className: s.facts, children: [_jsxs("div", { children: [_jsx("dt", { children: "Total" }), _jsx("dd", { children: formatCurrency(order.total) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Pagado" }), _jsx("dd", { children: formatCurrency(order.depositPaid) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Saldo pendiente" }), _jsx("dd", { children: formatCurrency(order.balanceDue) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Entrega prevista" }), _jsx("dd", { children: formatDate(order.promisedDate) })] }), order.deliveryAddress ? (_jsxs("div", { children: [_jsx("dt", { children: "Direcci\u00F3n de entrega" }), _jsxs("dd", { children: [order.deliveryAddress.line1, ", ", order.deliveryAddress.city] })] })) : null, nextAppointment ? (_jsxs("div", { children: [_jsx("dt", { children: "Pr\u00F3xima cita" }), _jsxs("dd", { children: [nextAppointment.appointmentTypeName, " \u00B7 ", formatDate(nextAppointment.scheduledAt)] })] })) : null, order.pointsEarned > 0 ? (_jsxs("div", { children: [_jsx("dt", { children: "Puntos ganados" }), _jsx("dd", { children: formatPoints(order.pointsEarned) })] })) : null] }) }), _jsxs(Card.Footer, { className: s.footerBetween, children: [_jsxs("div", { className: s.buttonGroup, children: [_jsx(ButtonLink, { to: paths.trackingFor(order.orderNumber), variant: "ghost", rightIcon: _jsx(Icon, { name: "arrowRight", size: 16 }), children: "Ver como lo ve el cliente" }), _jsx(Button, { variant: "ghost", leftIcon: _jsx(Icon, { name: "download", size: 16 }), onClick: () => downloadReceipt(order), children: "Descargar comprobante" }), _jsx(Button, { variant: "ghost", isLoading: resendConfirmation.isPending, onClick: handleResend, children: "Reenviar confirmaci\u00F3n" })] }), _jsx(Button, { variant: "primary", leftIcon: _jsx(Icon, { name: "creditCard", size: 16 }), onClick: () => setPaymentModalOpen(true), disabled: isClosed || order.balanceDue <= 0, children: "Registrar pago" })] })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Art\u00EDculos" }), _jsx(Card.Body, { children: order.items.map((item) => (_jsxs("article", { className: s.itemRow, children: [_jsx("div", { className: s.itemThumb, children: item.imageUrl ? _jsx("img", { src: item.imageUrl, alt: "", loading: "lazy" }) : null }), _jsxs("div", { children: [_jsx("h3", { className: s.itemName, children: item.suitModelName ?? item.productName ?? 'Artículo' }), _jsxs("p", { className: s.itemSub, children: [item.fabricName ? `Tela: ${item.fabricName} · ` : '', item.quantity, " \u00D7 ", formatCurrency(item.unitPrice)] }), item.customizations.length > 0 ? (_jsx("div", { className: s.itemOptions, children: item.customizations.map((customization) => (_jsxs(Badge, { tone: "neutral", size: "sm", children: [customization.groupName, ": ", customization.optionName] }, customization.id))) })) : null] }), _jsx(Price, { amount: item.lineTotal, size: "sm" })] }, item.id))) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Pagos" }), _jsx(Card.Body, { children: order.payments.length === 0 ? (_jsx("p", { className: s.cellSub, children: "Todav\u00EDa no se ha registrado ning\u00FAn pago." })) : (_jsx("div", { className: s.lineItems, children: order.payments.map((payment) => (_jsxs("div", { className: s.detailRow, children: [_jsxs("div", { className: s.detailRowMain, children: [_jsx("span", { className: s.itemName, style: { fontSize: 'var(--text-base)' }, children: payment.paymentType === 'anticipo' ? 'Anticipo' : 'Saldo' }), _jsxs("span", { className: s.detailRowMeta, children: [_jsx("span", { children: payment.paymentMethodName }), _jsx("span", { children: formatDateTime(payment.paidAt) }), payment.reference ? _jsxs("span", { children: ["Ref. ", payment.reference] }) : null] })] }), _jsx("span", { className: s.detailRowValue, children: formatCurrency(payment.amount) })] }, payment.id))) })) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Estado y bit\u00E1cora", subtitle: "Cada cambio de estado de este pedido, en orden." }), _jsxs(Card.Body, { children: [_jsx("div", { className: s.lineItems, children: [...order.history].reverse().map((entry) => (_jsx("div", { className: s.detailRow, children: _jsxs("div", { className: s.detailRowMain, children: [_jsx(OrderStatusBadge, { status: entry.statusCode, size: "sm" }), _jsxs("span", { className: s.detailRowMeta, children: [_jsx("span", { children: entry.changedByName ?? 'Sistema' }), _jsx("span", { children: formatDateTime(entry.changedAt) })] }), entry.note ? _jsx("p", { className: s.noteText, children: entry.note }) : null] }) }, entry.id))) }), _jsx(StatusForm, { order: order, staffName: staffName, isClosed: isClosed })] })] }), _jsx(PaymentModal, { open: paymentModalOpen, onClose: () => setPaymentModalOpen(false), order: order })] }));
}
function StatusForm({ order, staffName, isClosed, }) {
    const [statusCode, setStatusCode] = useState('');
    const [note, setNote] = useState('');
    const updateStatus = useUpdateOrderStatus();
    const toast = useToast();
    if (isClosed) {
        return (_jsx("p", { className: s.cellSub, style: { marginTop: 'var(--space-4)' }, children: "Este pedido est\u00E1 cerrado y ya no cambia de estado." }));
    }
    const options = ORDER_STATUSES.filter((code) => code !== 'pending_deposit' && code !== order.statusCode).map((code) => ({ value: code, label: ORDER_STATUS_LABELS[code] }));
    async function handleSubmit(event) {
        event.preventDefault();
        if (!statusCode)
            return;
        try {
            await updateStatus.mutateAsync({
                orderNumber: order.orderNumber,
                statusCode,
                note: note || undefined,
                changedByName: staffName,
            });
            toast.success('Estado actualizado', ORDER_STATUS_LABELS[statusCode]);
            setStatusCode('');
            setNote('');
        }
        catch (error) {
            toast.error('No se pudo cambiar el estado', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: s.noteForm, children: [_jsx(Select, { label: "Cambiar a", placeholder: "Elige un estado", value: statusCode, onChange: (event) => setStatusCode(event.target.value), options: options }), _jsx(Textarea, { label: "Nota", placeholder: "Por ejemplo: cliente confirm\u00F3 recoger el viernes.", hint: "Opcional.", value: note, onChange: (event) => setNote(event.target.value) }), _jsx(Button, { type: "submit", variant: "secondary", size: "sm", isLoading: updateStatus.isPending, disabled: !statusCode, children: "Actualizar estado" })] }));
}
function PaymentModal({ open, onClose, order }) {
    const recordPayment = useRecordPayment();
    const toast = useToast();
    const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    // Se sugiere el saldo completo al abrir: cubre el caso más común (cobrar todo) y se puede editar.
    useEffect(() => {
        if (open)
            setAmount(order.balanceDue > 0 ? String(order.balanceDue) : '');
    }, [open, order.balanceDue]);
    function reset() {
        setPaymentMethodId(PAYMENT_METHODS[0].id);
        setReference('');
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const value = Number(amount);
        if (!Number.isFinite(value) || value <= 0) {
            toast.error('Falta el monto', 'Escribe un monto mayor que cero.');
            return;
        }
        const method = PAYMENT_METHODS.find((item) => item.id === paymentMethodId);
        try {
            await recordPayment.mutateAsync({
                orderNumber: order.orderNumber,
                amount: value,
                paymentMethodId: method.id,
                paymentMethodName: method.name,
                reference: reference || undefined,
            });
            toast.success('Pago registrado', formatCurrency(value));
            reset();
            onClose();
        }
        catch (error) {
            toast.error('No se pudo registrar el pago', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsx(Modal, { open: open, onClose: onClose, title: "Registrar pago", description: `Saldo pendiente: ${formatCurrency(order.balanceDue)}.`, footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", form: "payment-form", variant: "primary", isLoading: recordPayment.isPending, children: "Registrar pago" })] }), children: _jsxs("form", { id: "payment-form", onSubmit: handleSubmit, className: s.formGrid2, children: [_jsx(Select, { label: "M\u00E9todo", fieldClassName: s.span2, value: paymentMethodId, onChange: (event) => setPaymentMethodId(Number(event.target.value)), options: PAYMENT_METHODS.map((method) => ({ value: method.id, label: method.name })) }), _jsx(Input, { label: "Monto", type: "number", step: "0.01", min: "0", max: order.balanceDue, required: true, endAdornment: "GTQ", value: amount, onChange: (event) => setAmount(event.target.value) }), _jsx(Input, { label: "Referencia", placeholder: "Opcional", value: reference, onChange: (event) => setReference(event.target.value) })] }) }));
}
//# sourceMappingURL=AdminOrderDetailPage.js.map