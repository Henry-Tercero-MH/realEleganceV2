import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Button, ButtonLink, Drawer, EmptyState, Price, Rule } from '@/components/ui';
import { CartLineRow } from './CartLineRow';
import { useCart } from '@/context/CartContext';
import { paths } from '@/routes/paths';
import { formatCurrency } from '@/lib/format';
import s from './CartDrawer.module.css';
/** Pie fijo del panel: totales y las dos salidas posibles. */
function DrawerSummary({ subtotal, discount, dueNow, requiresAppointment, onCheckout, onViewCart, }) {
    return (_jsxs("div", { className: s.summary, children: [_jsxs("dl", { className: s.totals, children: [_jsxs("div", { children: [_jsx("dt", { children: "Subtotal" }), _jsx("dd", { children: formatCurrency(subtotal) })] }), discount > 0 ? (_jsxs("div", { className: s.discount, children: [_jsx("dt", { children: "Descuento" }), _jsxs("dd", { children: ["\u2212", formatCurrency(discount)] })] })) : null, _jsx(Rule, { variant: "stitch", className: s.rule }), _jsxs("div", { className: s.dueNow, children: [_jsx("dt", { children: "A pagar ahora" }), _jsx("dd", { children: _jsx(Price, { amount: dueNow, size: "md" }) })] })] }), requiresAppointment ? (_jsx("p", { className: s.note, children: "Los trajes a medida se confirman con el 50 % de anticipo y una cita para tomarte las medidas. El saldo se paga en la entrega." })) : null, _jsxs("div", { className: s.actions, children: [_jsx(Button, { variant: "primary", fullWidth: true, onClick: onCheckout, children: "Ir al pago" }), _jsx(ButtonLink, { to: paths.cart, variant: "ghost", fullWidth: true, onClick: onViewCart, children: "Ver el carrito completo" })] })] }));
}
/**
 * Panel lateral del carrito.
 *
 * Vive montado en `AppLayout` y se abre desde la cabecera o al añadir un
 * artículo: la persona ve lo que acaba de meter sin perder la página en la que
 * estaba.
 */
export function CartDrawer() {
    const { cart, totals, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();
    const isEmpty = cart.lines.length === 0;
    function goToCheckout() {
        closeDrawer();
        navigate(paths.checkout);
    }
    return (_jsx(Drawer, { open: isDrawerOpen, onClose: closeDrawer, title: "Tu carrito", footer: isEmpty ? null : (_jsx(DrawerSummary, { subtotal: totals.subtotal, discount: totals.discount, dueNow: totals.dueNow, requiresAppointment: totals.requiresAppointment, onCheckout: goToCheckout, onViewCart: closeDrawer })), children: isEmpty ? (_jsx(EmptyState, { icon: "hanger", size: "sm", title: "El carrito est\u00E1 vac\u00EDo", description: "Todav\u00EDa no has elegido nada. Empieza por el cat\u00E1logo y personaliza tu primer traje.", action: _jsx(ButtonLink, { to: paths.catalog, variant: "primary", onClick: closeDrawer, children: "Ver el cat\u00E1logo" }) })) : (_jsx("div", { className: s.lines, children: cart.lines.map((line) => (_jsx(CartLineRow, { line: line, onQuantityChange: updateQuantity, onRemove: removeItem }, line.lineId))) })) }));
}
//# sourceMappingURL=CartDrawer.js.map