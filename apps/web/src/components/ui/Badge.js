import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ORDER_STATUS_LABELS, PRODUCTION_STAGE_LABELS } from '@real-elegance/shared';
import { cx } from '@/lib/cx';
import s from './Badge.module.css';
export function Badge({ tone = 'neutral', appearance = 'soft', size = 'md', withDot = false, className, children, ...rest }) {
    return (_jsxs("span", { className: cx(s.badge, s[tone], s[appearance], s[size], className), ...rest, children: [withDot ? _jsx("span", { className: s.dot, "aria-hidden": "true" }) : null, children] }));
}
/**
 * Mapa estado de pedido → tono. Vive aquí (y no en cada página) para que un
 * pedido «Entregado» se vea igual en la tienda, en «Mis pedidos» y en el taller.
 */
const ORDER_STATUS_TONES = {
    pending_deposit: 'warning',
    confirmed: 'info',
    in_production: 'gold',
    fitting: 'gold',
    ready: 'success',
    delivered: 'success',
    cancelled: 'danger',
};
export function OrderStatusBadge({ status, size = 'md', className }) {
    return (_jsx(Badge, { tone: ORDER_STATUS_TONES[status], size: size, withDot: true, className: className, children: ORDER_STATUS_LABELS[status] }));
}
export function StageBadge({ stage, size = 'sm', className }) {
    return (_jsx(Badge, { tone: "gold", appearance: "outline", size: size, className: className, children: PRODUCTION_STAGE_LABELS[stage] }));
}
//# sourceMappingURL=Badge.js.map