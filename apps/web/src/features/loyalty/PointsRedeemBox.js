import { jsxs as _jsxs, Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Checkbox, Icon } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import { maxRedeemablePoints, pointsToCurrency } from '@/features/cart/pricing';
import { useLoyaltySettings, useMyLoyalty } from './hooks';
import { formatCurrency, formatPoints } from '@/lib/format';
import s from './PointsRedeemBox.module.css';
/**
 * Canje de puntos en el carrito.
 *
 * Es todo-o-nada a propósito (un checkbox, no un contador): «usa mis puntos
 * disponibles» es la decisión real que toma la mayoría; quien quiera dejar
 * puntos de sobra para otra compra puede no marcarlo. Si no hay sesión, no
 * hay saldo que canjear y el componente no pinta nada.
 */
export function PointsRedeemBox() {
    const { cart, totals, redeemPoints } = useCart();
    const { data: settings } = useLoyaltySettings();
    const { data: account } = useMyLoyalty();
    if (!settings || !account || !settings.isActive || account.pointsBalance <= 0)
        return null;
    const amountAvailableForPoints = Math.max(0, totals.subtotal - totals.couponDiscount);
    const cap = maxRedeemablePoints(amountAvailableForPoints, account.pointsBalance, settings);
    if (cap <= 0)
        return null;
    const isUsingPoints = cart.redeemedPoints > 0;
    return (_jsxs("div", { className: s.box, children: [_jsx(Checkbox, { label: _jsxs(_Fragment, { children: ["Usar ", formatPoints(cap), " disponibles", _jsxs("span", { className: s.saving, children: ["\u2212", formatCurrency(pointsToCurrency(cap, settings))] })] }), checked: isUsingPoints, onChange: (event) => redeemPoints(event.target.checked ? cap : 0) }), _jsxs("p", { className: s.hint, children: [_jsx(Icon, { name: "sparkle", size: 13 }), "Tienes ", formatPoints(account.pointsBalance), " en total \u00B7 1 punto =", ' ', formatCurrency(settings.redemptionValueQuetzalPerPoint)] })] }));
}
//# sourceMappingURL=PointsRedeemBox.js.map