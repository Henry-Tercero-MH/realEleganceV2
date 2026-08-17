import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ButtonLink, Icon, OrderStatusBadge, SectionHeading, Skeleton, Table } from '@/components/ui';
import { useAdminOrders } from '@/features/admin/hooks';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate } from '@/lib/format';
import s from './admin.module.css';
const COLUMNS = [
    {
        id: 'orderNumber',
        header: 'Pedido',
        cell: (row) => (_jsx(Link, { to: paths.adminOrder(row.orderNumber), className: s.mono, children: row.orderNumber })),
    },
    { id: 'created', header: 'Fecha', hideOnMobile: true, cell: (row) => formatDate(row.createdAt) },
    {
        id: 'promised',
        header: 'Entrega prevista',
        hideOnMobile: true,
        cell: (row) => formatDate(row.promisedDate),
    },
    { id: 'total', header: 'Total', align: 'right', cell: (row) => formatCurrency(row.total) },
    {
        id: 'balance',
        header: 'Saldo',
        align: 'right',
        cell: (row) => (row.balanceDue > 0 ? formatCurrency(row.balanceDue) : '—'),
    },
    {
        id: 'status',
        header: 'Estado',
        align: 'right',
        cell: (row) => _jsx(OrderStatusBadge, { status: row.statusCode, size: "sm" }),
    },
];
export default function AdminOrdersPage() {
    const { data: orders, isLoading } = useAdminOrders();
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Operaci\u00F3n", title: "Pedidos", description: "Todos los encargos, con su estado y su saldo.", action: _jsx(ButtonLink, { to: paths.adminNewOrder, variant: "primary", leftIcon: _jsx(Icon, { name: "plus", size: 16 }), children: "Nuevo pedido" }) }), isLoading ? (_jsx(Skeleton, { height: "320px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: COLUMNS, rows: orders ?? [], rowKey: (row) => row.id, caption: "Pedidos" }))] }));
}
//# sourceMappingURL=AdminOrdersPage.js.map