import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, EmptyState, Icon, SectionHeading, Skeleton } from '@/components/ui';
import { useLoyaltySettings, useMyLoyalty, useMyLoyaltyMovements } from '@/features/loyalty/hooks';
import { formatCurrency, formatDateTime, formatPoints } from '@/lib/format';
import s from './account.module.css';
import m from './MyLoyaltyPage.module.css';
const MOVEMENT_LABELS = {
    earned: 'Puntos ganados',
    redeemed: 'Puntos canjeados',
    adjustment: 'Ajuste del taller',
};
export default function MyLoyaltyPage() {
    const { data: account, isLoading: loadingAccount } = useMyLoyalty();
    const { data: movements, isLoading: loadingMovements } = useMyLoyaltyMovements();
    const { data: settings } = useLoyaltySettings();
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Fidelizaci\u00F3n", title: "Mis puntos", description: "Ganas puntos con cada compra y los puedes canjear como descuento en tu pr\u00F3ximo pedido, desde el carrito." }), _jsxs("div", { className: s.stats, children: [_jsxs("div", { className: s.stat, children: [_jsx("p", { className: s.statLabel, children: "Saldo disponible" }), _jsx("p", { className: s.statValue, children: loadingAccount ? '—' : formatPoints(account?.pointsBalance ?? 0) }), _jsx("p", { className: s.statHint, children: "Listos para canjear" })] }), _jsxs("div", { className: s.stat, children: [_jsx("p", { className: s.statLabel, children: "Acumulados en total" }), _jsx("p", { className: s.statValue, children: loadingAccount ? '—' : formatPoints(account?.pointsLifetime ?? 0) }), _jsx("p", { className: s.statHint, children: "Desde tu primera compra" })] }), _jsxs("div", { className: s.stat, children: [_jsx("p", { className: s.statLabel, children: "Valor de tu saldo" }), _jsx("p", { className: s.statValue, children: settings && account
                                    ? formatCurrency(account.pointsBalance * settings.redemptionValueQuetzalPerPoint)
                                    : '—' }), _jsx("p", { className: s.statHint, children: settings ? `1 punto = ${formatCurrency(settings.redemptionValueQuetzalPerPoint)}` : '' })] })] }), _jsxs("div", { className: m.explainer, children: [_jsx(Icon, { name: "sparkle", size: 16 }), _jsxs("p", { children: [settings
                                ? `Ganas 1 punto por cada ${formatCurrency(settings.earnRateQuetzalPerPoint)} de tu pedido (después de descuentos).`
                                : 'Ganas puntos con cada pedido.', ' ', "Los usas como descuento la pr\u00F3xima vez que compres, marcando la casilla en el carrito."] })] }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Historial" }), _jsx(Card.Body, { children: loadingMovements ? (_jsx(Skeleton, { height: "160px", radius: "var(--radius-md)" })) : movements && movements.length > 0 ? (_jsx("ul", { role: "list", className: m.movements, children: movements.map((movement) => {
                                const isPositive = movement.points >= 0;
                                return (_jsxs("li", { className: m.movement, children: [_jsx("span", { className: isPositive ? m.iconEarn : m.iconRedeem, children: _jsx(Icon, { name: isPositive ? 'sparkle' : 'tag', size: 15 }) }), _jsxs("div", { className: m.movementBody, children: [_jsx("p", { className: m.movementTitle, children: movement.orderNumber
                                                        ? `${MOVEMENT_LABELS[movement.type]} · Pedido ${movement.orderNumber}`
                                                        : (movement.note ?? MOVEMENT_LABELS[movement.type]) }), _jsx("p", { className: m.movementDate, children: formatDateTime(movement.createdAt) })] }), _jsxs("span", { className: isPositive ? m.pointsPositive : m.pointsNegative, children: [isPositive ? '+' : '', formatPoints(movement.points)] })] }, movement.id));
                            }) })) : (_jsx(EmptyState, { size: "sm", icon: "sparkle", title: "Todav\u00EDa no tienes movimientos", description: "En cuanto completes tu primera compra, aqu\u00ED ver\u00E1s los puntos que ganaste." })) })] })] }));
}
//# sourceMappingURL=MyLoyaltyPage.js.map