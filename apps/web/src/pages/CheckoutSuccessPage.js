import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useParams } from 'react-router-dom';
import { Button, ButtonLink, Card, Icon, Stepper } from '@/components/ui';
import { useOrder, useResendConfirmation } from '@/features/orders/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatPoints } from '@/lib/format';
import { downloadReceipt } from '@/lib/receipt';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CheckoutSuccessPage.module.css';
const NEXT_STEPS = [
    { id: 'pago', label: 'Anticipo recibido', description: 'Ya tenemos tu pedido' },
    { id: 'cita', label: 'Toma de medidas', description: 'Agenda tu cita en el taller' },
    { id: 'taller', label: 'Confección', description: 'Corte, costura y pruebas' },
    { id: 'entrega', label: 'Entrega', description: 'Pagas el saldo y te lo llevas' },
];
export default function CheckoutSuccessPage() {
    const { orderNumber = '' } = useParams();
    const state = (useLocation().state ?? {});
    const { data: order } = useOrder(orderNumber);
    const resendConfirmation = useResendConfirmation();
    const toast = useToast();
    async function handleResend() {
        try {
            const { sentTo } = await resendConfirmation.mutateAsync(orderNumber);
            toast.success('Confirmación reenviada', `La enviamos a ${sentTo}.`);
        }
        catch (error) {
            toast.error('No se pudo reenviar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsxs("div", { className: cx('re-container', 're-container--narrow', l.section), children: [_jsxs("div", { className: s.hero, children: [_jsx("span", { className: s.mark, children: _jsx(Icon, { name: "check", size: 30 }) }), _jsx("h1", { className: s.title, children: "Tu pedido est\u00E1 confirmado" }), _jsx("p", { className: s.text, children: "Gracias por confiarnos tu traje. Te hemos enviado un correo con el resumen y este n\u00FAmero, que tambi\u00E9n sirve para consultar el avance sin iniciar sesi\u00F3n." }), _jsxs("p", { className: s.orderNumber, children: [_jsx("span", { children: "N\u00FAmero de pedido" }), _jsx("strong", { children: orderNumber })] }), typeof state.dueNow === 'number' ? (_jsxs("p", { className: s.paid, children: ["Cobrado hoy: ", formatCurrency(state.dueNow)] })) : null, typeof state.pointsEarned === 'number' && state.pointsEarned > 0 ? (_jsxs("p", { className: s.points, children: [_jsx(Icon, { name: "sparkle", size: 15 }), "Ganaste ", formatPoints(state.pointsEarned), " de fidelizaci\u00F3n."] })) : null] }), _jsxs(Card, { variant: "raised", className: s.next, children: [_jsx(Card.Header, { title: "Qu\u00E9 pasa ahora" }), _jsx(Card.Body, { children: _jsx(Stepper, { steps: NEXT_STEPS, current: 1, orientation: "vertical", "aria-label": "Siguientes pasos de tu pedido" }) })] }), _jsxs("div", { className: s.actions, children: [state.requiresAppointment !== false ? (_jsx(ButtonLink, { to: paths.bookAppointment, variant: "primary", size: "lg", leftIcon: _jsx(Icon, { name: "calendar", size: 17 }), children: "Agendar la toma de medidas" })) : null, _jsx(ButtonLink, { to: paths.trackingFor(orderNumber), variant: "secondary", size: "lg", children: "Ver el seguimiento" }), order ? (_jsx(Button, { variant: "ghost", size: "lg", leftIcon: _jsx(Icon, { name: "download", size: 16 }), onClick: () => downloadReceipt(order), children: "Descargar comprobante" })) : null, _jsx(Button, { variant: "ghost", size: "lg", isLoading: resendConfirmation.isPending, onClick: handleResend, children: "Reenviar confirmaci\u00F3n" })] })] }));
}
//# sourceMappingURL=CheckoutSuccessPage.js.map