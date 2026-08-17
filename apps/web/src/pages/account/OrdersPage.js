import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ButtonLink, EmptyState, OrderStatusBadge, SectionHeading, Skeleton, Tabs, } from '@/components/ui';
import { useMyOrders } from '@/features/orders/hooks';
import { CLOSED_ORDER_STATUSES } from '@real-elegance/shared';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate } from '@/lib/format';
import s from './account.module.css';
export default function OrdersPage() {
    const [filter, setFilter] = useState('abiertos');
    const { data: orders, isLoading, isError } = useMyOrders();
    const open = orders?.filter((order) => !CLOSED_ORDER_STATUSES.includes(order.statusCode)) ?? [];
    const closed = orders?.filter((order) => CLOSED_ORDER_STATUSES.includes(order.statusCode)) ?? [];
    const visible = filter === 'abiertos' ? open : filter === 'entregados' ? closed : (orders ?? []);
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Historial", title: "Mis pedidos", description: "Cada encargo, con su estado y su saldo." }), _jsx(Tabs, { variant: "pill", "aria-label": "Filtrar pedidos", value: filter, onChange: (id) => setFilter(id), tabs: [
                    { id: 'abiertos', label: 'En curso', count: open.length },
                    { id: 'entregados', label: 'Entregados', count: closed.length },
                    { id: 'todos', label: 'Todos', count: orders?.length ?? 0 },
                ] }), isLoading ? _jsx(Skeleton, { height: "120px", radius: "var(--radius-md)" }) : null, isError ? (_jsx(EmptyState, { tone: "error", title: "No pudimos cargar tus pedidos" })) : null, !isLoading && visible.length === 0 ? (_jsx(EmptyState, { icon: "package", title: "No hay pedidos a\u00FAn. Dise\u00F1a tu primer traje.", description: "En cuanto encargues uno aparecer\u00E1 aqu\u00ED, con su avance en el taller.", action: _jsx(ButtonLink, { to: paths.catalog, variant: "primary", children: "Ver el cat\u00E1logo" }) })) : null, _jsx("ul", { role: "list", className: s.list, children: visible.map((order) => (_jsx("li", { children: _jsxs(Link, { to: paths.order(order.orderNumber), className: s.orderCard, children: [_jsxs("div", { children: [_jsx("span", { className: s.orderNumber, children: order.orderNumber }), _jsxs("p", { className: s.orderMeta, children: [_jsxs("span", { children: ["Encargado el ", formatDate(order.createdAt)] }), _jsxs("span", { children: [order.itemCount, " ", order.itemCount === 1 ? 'artículo' : 'artículos'] }), order.promisedDate ? _jsxs("span", { children: ["Entrega: ", formatDate(order.promisedDate)] }) : null] })] }), _jsxs("div", { className: s.orderRight, children: [_jsx(OrderStatusBadge, { status: order.statusCode, size: "sm" }), _jsx("strong", { children: formatCurrency(order.total) }), order.balanceDue > 0 ? (_jsxs("small", { children: ["Saldo: ", formatCurrency(order.balanceDue)] })) : null] })] }) }, order.id))) })] }));
}
//# sourceMappingURL=OrdersPage.js.map