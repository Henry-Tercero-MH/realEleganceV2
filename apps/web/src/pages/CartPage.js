import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonLink, Card, EmptyState, Icon, Input, Price, Rule, SectionHeading, } from '@/components/ui';
import { CartLineRow } from '@/features/cart/CartLineRow';
import { DEPOSIT_RATE } from '@/features/cart/pricing';
import { PointsRedeemBox } from '@/features/loyalty/PointsRedeemBox';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatPercent, formatPoints } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CartPage.module.css';
export default function CartPage() {
    const { cart, totals, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
    const toast = useToast();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState();
    const [isValidating, setValidating] = useState(false);
    async function handleCoupon(event) {
        event.preventDefault();
        if (!couponCode.trim())
            return;
        setValidating(true);
        setCouponError(undefined);
        try {
            // El cupón lo valida siempre el servidor (`fn_validate_coupon`): el
            // cliente solo pinta el resultado.
            const result = await api.cart.validateCoupon(couponCode, totals.subtotal);
            if (!result.valid) {
                setCouponError(result.reason ?? 'No pudimos aplicar el cupón.');
                return;
            }
            applyCoupon({
                code: couponCode.trim().toUpperCase(),
                type: 'percent',
                value: 0,
                discount: result.discount,
            });
            setCouponCode('');
            toast.success('Cupón aplicado', `Ahorras ${formatCurrency(result.discount)}.`);
        }
        finally {
            setValidating(false);
        }
    }
    if (cart.lines.length === 0) {
        return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Carrito", title: "Tu carrito" }), _jsx("div", { className: l.afterHeading, children: _jsx(EmptyState, { icon: "cart", title: "No hay pedidos a\u00FAn. Dise\u00F1a tu primer traje.", description: "Elige un modelo del cat\u00E1logo, escoge la tela y los acabados, y lo ver\u00E1s aqu\u00ED antes de confirmar.", action: _jsx(ButtonLink, { to: paths.catalog, variant: "primary", size: "lg", children: "Ver el cat\u00E1logo" }) }) })] }));
    }
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Paso 3 de 8 \u00B7 Carrito", title: "Revisa tu pedido", description: "Comprueba los detalles antes de pasar al pago. Todav\u00EDa puedes cambiar cantidades o quitar algo." }), _jsxs("div", { className: cx(l.withSummary, l.afterHeading, s.body), children: [_jsxs("section", { "aria-label": "Art\u00EDculos del carrito", children: [cart.lines.map((line) => (_jsx(CartLineRow, { line: line, variant: "full", onQuantityChange: updateQuantity, onRemove: removeItem }, line.lineId))), _jsx(ButtonLink, { to: paths.catalog, variant: "ghost", className: s.keepShopping, leftIcon: _jsx(Icon, { name: "arrowLeft", size: 16 }), children: "Seguir mirando" })] }), _jsx("aside", { className: l.summaryColumn, children: _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Resumen" }), _jsxs(Card.Body, { children: [cart.coupon ? (_jsxs("div", { className: s.couponApplied, children: [_jsxs("span", { children: [_jsx(Icon, { name: "tag", size: 15 }), " ", cart.coupon.code] }), _jsx("button", { type: "button", onClick: removeCoupon, className: s.couponRemove, children: "Quitar" })] })) : (_jsxs("form", { onSubmit: handleCoupon, className: s.couponForm, children: [_jsx(Input, { label: "\u00BFTienes un cup\u00F3n?", placeholder: "PRIMERTRAJE", value: couponCode, onChange: (event) => setCouponCode(event.target.value), error: couponError, fieldClassName: s.couponInput, autoComplete: "off" }), _jsx(Button, { type: "submit", isLoading: isValidating, className: s.couponButton, children: "Aplicar" })] })), _jsx(PointsRedeemBox, {}), _jsx(Rule, { variant: "stitch", className: s.rule }), _jsxs("dl", { className: s.totals, children: [_jsxs("div", { children: [_jsx("dt", { children: "Subtotal" }), _jsx("dd", { children: formatCurrency(totals.subtotal) })] }), totals.couponDiscount > 0 ? (_jsxs("div", { className: s.discount, children: [_jsx("dt", { children: "Descuento del cup\u00F3n" }), _jsxs("dd", { children: ["\u2212", formatCurrency(totals.couponDiscount)] })] })) : null, totals.pointsDiscount > 0 ? (_jsxs("div", { className: s.discount, children: [_jsx("dt", { children: "Descuento por puntos" }), _jsxs("dd", { children: ["\u2212", formatCurrency(totals.pointsDiscount)] })] })) : null, _jsxs("div", { children: [_jsx("dt", { children: "IVA (12 %)" }), _jsx("dd", { children: formatCurrency(totals.tax) })] }), _jsxs("div", { className: s.grandTotal, children: [_jsx("dt", { children: "Total del pedido" }), _jsx("dd", { children: _jsx(Price, { amount: totals.total, size: "md" }) })] })] }), totals.estimatedPointsEarned > 0 ? (_jsxs("p", { className: s.earnNote, children: [_jsx(Icon, { name: "sparkle", size: 14 }), "Este pedido te dejar\u00E1 ", formatPoints(totals.estimatedPointsEarned), "."] })) : null, totals.requiresAppointment ? (_jsxs("div", { className: s.split, children: [_jsx("p", { className: s.splitTitle, children: "C\u00F3mo se paga" }), _jsxs("dl", { className: s.totals, children: [_jsxs("div", { children: [_jsxs("dt", { children: ["Ahora (", formatPercent(DEPOSIT_RATE), " del traje + accesorios)"] }), _jsx("dd", { children: formatCurrency(totals.dueNow) })] }), _jsxs("div", { children: [_jsx("dt", { children: "En la entrega" }), _jsx("dd", { children: formatCurrency(totals.balanceLater) })] })] })] })) : null] }), _jsxs(Card.Footer, { className: s.footer, children: [_jsx(Button, { variant: "primary", fullWidth: true, size: "lg", onClick: () => navigate(paths.checkout), children: "Ir al pago" }), _jsxs("p", { className: s.secure, children: [_jsx(Icon, { name: "checkCircle", size: 14 }), "Precios y existencias se revalidan al confirmar."] })] })] }) })] })] }));
}
//# sourceMappingURL=CartPage.js.map