import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import { useAdminProducts } from '@/features/admin/hooks';
import { formatCurrency } from '@/lib/format';
import s from './admin.module.css';
const COLUMNS = [
    {
        id: 'product',
        header: 'Producto',
        cell: (row) => (_jsxs("div", { className: s.cellMain, children: [_jsx("span", { className: `${s.cellThumb} ${s.cellThumbSquare}`, children: row.primaryImage ? _jsx("img", { src: row.primaryImage.url, alt: "", loading: "lazy" }) : null }), _jsxs("div", { children: [_jsx("span", { className: s.cellName, children: row.name }), _jsx("span", { className: s.cellSub, children: row.categoryName })] })] })),
    },
    { id: 'sku', header: 'SKU', cell: (row) => _jsx("span", { className: s.mono, children: row.sku }) },
    { id: 'price', header: 'Precio', align: 'right', cell: (row) => formatCurrency(row.price) },
    {
        id: 'stock',
        header: 'Existencias',
        align: 'right',
        cell: (row) => (_jsx(Badge, { tone: row.stock === 0 ? 'danger' : row.stock <= 10 ? 'warning' : 'neutral', size: "sm", children: row.stock })),
    },
];
export default function AdminProductsPage() {
    const { data: products, isLoading } = useAdminProducts();
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Cat\u00E1logo", title: "Accesorios", description: "Corbatas, pa\u00F1uelos, camisas y complementos listos para llevar.", action: _jsx(Button, { variant: "primary", leftIcon: _jsx(Icon, { name: "plus", size: 16 }), disabled: true, children: "Nuevo accesorio" }) }), isLoading ? (_jsx(Skeleton, { height: "320px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: COLUMNS, rows: products ?? [], rowKey: (row) => row.id, caption: "Accesorios listos para llevar" }))] }));
}
//# sourceMappingURL=AdminProductsPage.js.map