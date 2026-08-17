import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ButtonLink, Card, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import { useAdminStats, useTailorWorkload } from '@/features/admin/hooks';
import { paths } from '@/routes/paths';
import { formatCurrencyCompact } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './admin.module.css';
const WORKLOAD_COLUMNS = [
    {
        id: 'name',
        header: 'Sastre',
        cell: (row) => (_jsxs("div", { children: [_jsx("span", { className: s.cellName, children: row.tailorName }), _jsx("span", { className: s.cellSub, children: row.specialty ?? '—' })] })),
    },
    {
        id: 'active',
        header: 'Órdenes activas',
        align: 'right',
        cell: (row) => row.activeWorkOrders,
    },
    {
        id: 'overdue',
        header: 'Fuera de plazo',
        align: 'right',
        hideOnMobile: true,
        cell: (row) => (row.overdueWorkOrders > 0 ? _jsx("strong", { children: row.overdueWorkOrders }) : '—'),
    },
    {
        id: 'available',
        header: 'Estado',
        align: 'right',
        cell: (row) => (row.isAvailable ? 'Disponible' : 'Ocupado'),
    },
];
export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useAdminStats();
    const { data: workload, isLoading: loadingWorkload } = useTailorWorkload();
    const cards = stats
        ? [
            { key: 'open', label: 'Pedidos abiertos', icon: 'package', value: String(stats.openOrders) },
            {
                key: 'production',
                label: 'En confección',
                icon: 'scissors',
                value: String(stats.ordersInProduction),
            },
            {
                key: 'appointments',
                label: 'Citas hoy',
                icon: 'calendar',
                value: String(stats.appointmentsToday),
            },
            {
                key: 'revenue',
                label: 'Facturado este mes',
                icon: 'creditCard',
                value: formatCurrencyCompact(stats.revenueThisMonth),
            },
            {
                key: 'balance',
                label: 'Saldo por cobrar',
                icon: 'clock',
                value: formatCurrencyCompact(stats.pendingBalance),
            },
            {
                key: 'stock',
                label: 'Telas con poco stock',
                icon: 'spool',
                value: String(stats.lowStockFabrics),
                alert: stats.lowStockFabrics > 0,
            },
        ]
        : [];
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Panel", title: "C\u00F3mo va el taller", description: "Lo que hay que mirar cada ma\u00F1ana antes de abrir.", action: _jsx(ButtonLink, { to: paths.adminProduction, variant: "primary", leftIcon: _jsx(Icon, { name: "scissors", size: 16 }), children: "Ir al tablero" }) }), _jsx("div", { className: s.stats, children: isLoading
                    ? Array.from({ length: 6 }, (_, index) => (_jsx(Skeleton, { height: "120px", radius: "var(--radius-md)" }, index)))
                    : cards.map((card) => (_jsxs("div", { className: cx(s.stat, card.alert && s.statAlert), children: [_jsxs("p", { className: s.statHead, children: [_jsx(Icon, { name: card.icon, size: 15 }), card.label] }), _jsx("p", { className: s.statValue, children: card.value })] }, card.key))) }), _jsxs(Card, { variant: "raised", children: [_jsx(Card.Header, { title: "Carga por sastre", subtitle: "Equivale a la vista vw_tailor_workload" }), _jsx(Card.Body, { children: loadingWorkload ? (_jsx(Skeleton, { height: "180px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: WORKLOAD_COLUMNS, rows: workload ?? [], rowKey: (row) => row.staffId, caption: "Carga de trabajo por sastre" })) })] }), _jsxs("p", { className: s.designNote, children: [_jsx(Icon, { name: "info", size: 15 }), "Fase de dise\u00F1o: los datos son de demostraci\u00F3n y las acciones de escritura (crear, subir im\u00E1genes, editar) llegar\u00E1n con el backend. La navegaci\u00F3n y los estados de cada pantalla ya son los definitivos."] })] }));
}
//# sourceMappingURL=AdminDashboardPage.js.map