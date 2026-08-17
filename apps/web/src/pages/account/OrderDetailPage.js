import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, ButtonLink, Card, EmptyState, Icon, OrderStatusBadge, Price, SectionHeading, Skeleton, } from '@/components/ui';
import { useOrder, useResendConfirmation } from '@/features/orders/hooks';
import { useMyAppointments } from '@/features/appointments/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatDateTime, formatPoints } from '@/lib/format';
import { downloadReceipt } from '@/lib/receipt';
import s from './account.module.css';
export default function OrderDetailPage() {
    const { orderNumber } = useParams();
    const { data: order, isLoading, isError } = useOrder(orderNumber);
    const { data: appointments } = useMyAppointments();
    const resendConfirmation = useResendConfirmation();
    const toast = useToast();
    if (isLoading)
        return _jsx(Skeleton, { height: "420px", radius: "var(--radius-md)" });
    if (isError || !order) {
        return (_jsx(EmptyState, { tone: "error", title: "No encontramos ese pedido", description: "Puede que el n\u00FAmero no sea correcto o que el pedido pertenezca a otra cuenta.", action: _jsx(ButtonLink, { to: paths.orders, variant: "primary", children: "Volver a mis pedidos" }) }));
    }
    const nextAppointment = (appointments ?? [])
        .filter((item) => item.orderId === order.id && item.status === 'scheduled')
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0];
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
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: _jsx(Link, { to: paths.orders, children: "\u2190 Mis pedidos" }), title: order.orderNumber, action: _jsx(OrderStatusBadge, { status: order.statusCode }) }), _jsxs(Card, { variant: "raised", children: [_jsxs(Card.Body, { children: [_jsxs("dl", { className: s.facts, children: [_jsxs("div", { children: [_jsx("dt", { children: "Total" }), _jsx("dd", { children: formatCurrency(order.total) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Anticipo pagado" }), _jsx("dd", { children: formatCurrency(order.depositPaid) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Saldo pendiente" }), _jsx("dd", { children: formatCurrency(order.balanceDue) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Entrega prevista" }), _jsx("dd", { children: formatDate(order.promisedDate) })] }), order.deliveryAddress ? (_jsxs("div", { children: [_jsx("dt", { children: "Direcci\u00F3n de entrega" }), _jsxs("dd", { children: [order.deliveryAddress.line1, ", ", order.deliveryAddress.city] })] })) : null, nextAppointment ? (_jsxs("div", { children: [_jsx("dt", { children: "Pr\u00F3xima cita" }), _jsxs("dd", { children: [nextAppointment.appointmentTypeName, " \u00B7 ", formatDate(nextAppointment.scheduledAt)] })] })) : null, order.pointsEarned > 0 ? (_jsxs("div", { children: [_jsx("dt", { children: "Puntos ganados" }), _jsx("dd", { children: formatPoints(order.pointsEarned) })] })) : null] }), order.pointsRedeemed > 0 ? (_jsxs("p", { className: s.itemSub, style: { marginTop: 'var(--space-4)' }, children: ["Pagaste ", formatCurrency(order.pointsDiscount), " de este pedido con", ' ', formatPoints(order.pointsRedeemed), "."] })) : null] }), _jsxs(Card.Footer, { className: s.orderActions, children: [_jsx(ButtonLink, { to: paths.trackingFor(order.orderNumber), variant: "secondary", rightIcon: _jsx(Icon, { name: "arrowRight", size: 16 }), children: "Ver el avance en el taller" }), _jsx(Button, { variant: "ghost", leftIcon: _jsx(Icon, { name: "download", size: 16 }), onClick: () => downloadReceipt(order), children: "Descargar comprobante" }), _jsx(Button, { variant: "ghost", isLoading: resendConfirmation.isPending, onClick: handleResend, children: "Reenviar confirmaci\u00F3n" })] })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Art\u00EDculos" }), _jsx(Card.Body, { children: order.items.map((item) => (_jsxs("article", { className: s.itemRow, children: [_jsx("div", { className: s.itemThumb, children: item.imageUrl ? _jsx("img", { src: item.imageUrl, alt: "", loading: "lazy" }) : null }), _jsxs("div", { children: [_jsx("h3", { className: s.itemName, children: item.suitModelName ?? item.productName ?? 'Artículo' }), _jsxs("p", { className: s.itemSub, children: [item.fabricName ? `Tela: ${item.fabricName} · ` : '', item.quantity, " \u00D7 ", formatCurrency(item.unitPrice)] }), item.customizations.length > 0 ? (_jsx("div", { className: s.itemOptions, children: item.customizations.map((customization) => (_jsxs(Badge, { tone: "neutral", size: "sm", children: [customization.groupName, ": ", customization.optionName] }, customization.id))) })) : null] }), _jsx(Price, { amount: item.lineTotal, size: "sm" })] }, item.id))) })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Pagos" }), _jsx(Card.Body, { children: order.payments.length === 0 ? (_jsx("p", { children: "Todav\u00EDa no se ha registrado ning\u00FAn pago." })) : (_jsx("ul", { role: "list", className: s.list, children: order.payments.map((payment) => (_jsxs("li", { className: s.orderCard, children: [_jsxs("div", { children: [_jsx("span", { className: s.orderNumber, children: payment.paymentType === 'anticipo' ? 'Anticipo' : 'Saldo' }), _jsxs("p", { className: s.orderMeta, children: [_jsx("span", { children: payment.paymentMethodName }), _jsx("span", { children: formatDateTime(payment.paidAt) }), payment.reference ? _jsxs("span", { children: ["Ref. ", payment.reference] }) : null] })] }), _jsx("strong", { children: formatCurrency(payment.amount) })] }, payment.id))) })) })] })] }));
}
//# sourceMappingURL=OrderDetailPage.js.map