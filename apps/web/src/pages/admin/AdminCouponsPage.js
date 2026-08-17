import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import { useAdminCoupons } from '@/features/admin/hooks';
import { formatCurrency, formatDate } from '@/lib/format';
import s from './admin.module.css';
const COLUMNS = [
    { id: 'code', header: 'Código', cell: (row) => _jsx("span", { className: s.mono, children: row.code }) },
    {
        id: 'value',
        header: 'Descuento',
        cell: (row) => (row.type === 'percent' ? `${row.value}%` : formatCurrency(row.value)),
    },
    {
        id: 'min',
        header: 'Subtotal mínimo',
        align: 'right',
        hideOnMobile: true,
        cell: (row) => formatCurrency(row.minSubtotal),
    },
    {
        id: 'usage',
        header: 'Usos',
        align: 'right',
        cell: (row) => `${row.timesUsed}${row.usageLimit ? ` / ${row.usageLimit}` : ''}`,
    },
    { id: 'validUntil', header: 'Vence', align: 'right', cell: (row) => formatDate(row.validUntil) },
    {
        id: 'status',
        header: 'Estado',
        align: 'right',
        cell: (row) => {
            const expired = new Date(row.validUntil) < new Date();
            const tone = !row.isActive ? 'neutral' : expired ? 'danger' : 'success';
            const label = !row.isActive ? 'Inactivo' : expired ? 'Vencido' : 'Vigente';
            return (_jsx(Badge, { tone: tone, size: "sm", children: label }));
        },
    },
];
export default function AdminCouponsPage() {
    const { data: coupons, isLoading } = useAdminCoupons();
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Comercio", title: "Cupones", description: "C\u00F3digos de descuento con vigencia y l\u00EDmite de usos.", action: _jsx(Button, { variant: "primary", leftIcon: _jsx(Icon, { name: "plus", size: 16 }), disabled: true, children: "Nuevo cup\u00F3n" }) }), isLoading ? (_jsx(Skeleton, { height: "260px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: COLUMNS, rows: coupons ?? [], rowKey: (row) => row.id, caption: "Cupones" })), _jsxs("p", { className: s.designNote, children: [_jsx(Icon, { name: "info", size: 15 }), "La validaci\u00F3n real corre en ", _jsx("code", { children: "fn_validate_coupon" }), ": vigencia, subtotal m\u00EDnimo y l\u00EDmite de usos, tal como se ve en el carrito p\u00FAblico."] })] }));
}
//# sourceMappingURL=AdminCouponsPage.js.map