import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import { useAdminFabrics } from '@/features/admin/hooks';
import { formatCurrency } from '@/lib/format';
import s from './admin.module.css';
const COLUMNS = [
    {
        id: 'fabric',
        header: 'Tela',
        cell: (row) => (_jsxs("div", { className: s.cellMain, children: [_jsx("span", { className: s.swatchDot, style: { backgroundColor: row.colorHex ?? undefined }, "aria-hidden": "true" }), _jsxs("div", { children: [_jsx("span", { className: s.cellName, children: row.name }), _jsx("span", { className: s.cellSub, children: row.categoryName })] })] })),
    },
    { id: 'code', header: 'Código', cell: (row) => _jsx("span", { className: s.mono, children: row.code }) },
    { id: 'composition', header: 'Composición', hideOnMobile: true, cell: (row) => row.composition },
    {
        id: 'price',
        header: 'Precio / metro',
        align: 'right',
        cell: (row) => formatCurrency(row.pricePerMeter),
    },
    {
        id: 'stock',
        header: 'Existencias',
        align: 'right',
        cell: (row) => (_jsxs(Badge, { tone: row.stockMeters < 15 ? 'warning' : 'neutral', size: "sm", children: [row.stockMeters, " m"] })),
    },
];
export default function AdminFabricsPage() {
    const { data: fabrics, isLoading } = useAdminFabrics();
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Cat\u00E1logo", title: "Telas", description: "Muestrario, precio por metro y existencias.", action: _jsx(Button, { variant: "primary", leftIcon: _jsx(Icon, { name: "plus", size: 16 }), disabled: true, children: "Nueva tela" }) }), isLoading ? (_jsx(Skeleton, { height: "320px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: COLUMNS, rows: fabrics ?? [], rowKey: (row) => row.id, caption: "Telas del muestrario" })), _jsxs("p", { className: s.designNote, children: [_jsx(Icon, { name: "info", size: 15 }), "El descuento de metros al confirmar un pedido lo har\u00E1 el trigger", ' ', _jsx("code", { children: "trg_fabric_stock" }), "; aqu\u00ED solo se lee el nivel actual."] })] }));
}
//# sourceMappingURL=AdminFabricsPage.js.map