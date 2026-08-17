import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import { useAdminSuits } from '@/features/admin/hooks';
import { formatCurrency } from '@/lib/format';
import s from './admin.module.css';
const COLUMNS = [
    {
        id: 'model',
        header: 'Modelo',
        cell: (row) => (_jsxs("div", { className: s.cellMain, children: [_jsx("span", { className: s.cellThumb, children: row.primaryImage ? _jsx("img", { src: row.primaryImage.url, alt: "", loading: "lazy" }) : null }), _jsxs("div", { children: [_jsx("span", { className: s.cellName, children: row.name }), _jsx("span", { className: s.cellSub, children: row.styleName })] })] })),
    },
    { id: 'code', header: 'Código', cell: (row) => _jsx("span", { className: s.mono, children: row.code }) },
    {
        id: 'images',
        header: 'Galería',
        align: 'right',
        hideOnMobile: true,
        cell: (row) => `${row.images.length} foto${row.images.length === 1 ? '' : 's'}`,
    },
    {
        id: 'price',
        header: 'Precio base',
        align: 'right',
        cell: (row) => formatCurrency(row.basePrice),
    },
    {
        id: 'status',
        header: 'Estado',
        align: 'right',
        cell: (row) => (_jsx(Badge, { tone: row.isActive ? 'success' : 'neutral', size: "sm", children: row.isActive ? 'Activo' : 'Inactivo' })),
    },
];
export default function AdminSuitsPage() {
    const { data: suits, isLoading } = useAdminSuits();
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Cat\u00E1logo", title: "Trajes", description: "Modelos, galer\u00EDa de fotos y precio base.", action: _jsx(Button, { variant: "primary", leftIcon: _jsx(Icon, { name: "plus", size: 16 }), disabled: true, children: "Nuevo modelo" }) }), isLoading ? (_jsx(Skeleton, { height: "320px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: COLUMNS, rows: suits ?? [], rowKey: (row) => row.id, caption: "Trajes del cat\u00E1logo" })), _jsxs("p", { className: s.designNote, children: [_jsx(Icon, { name: "info", size: 15 }), "En esta fase la tabla es de solo lectura. Crear/editar modelos y subir im\u00E1genes (", _jsx("code", { children: "POST /admin/suits" }), ", ", _jsx("code", { children: "POST /admin/suits/:id/images" }), ") llegan con el backend y el bucket de MinIO."] })] }));
}
//# sourceMappingURL=AdminSuitsPage.js.map