import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ButtonLink, EmptyState, Icon, SectionHeading, Skeleton, Tabs } from '@/components/ui';
import { FabricCard } from '@/features/catalog/ProductCards';
import { useFabricCategories, useFabrics } from '@/features/catalog/hooks';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
export default function FabricsPage() {
    const [categoryId, setCategoryId] = useState('todas');
    const { data: categories } = useFabricCategories();
    const { data: fabrics, isLoading, isError } = useFabrics({
        categoryId: categoryId === 'todas' ? null : Number(categoryId),
    });
    const tabs = [
        { id: 'todas', label: 'Todas' },
        ...(categories ?? []).map((category) => ({ id: String(category.id), label: category.name })),
    ];
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Muestrario", title: "Telas de la casa", description: "Lanas fr\u00EDas para el tr\u00F3pico, linos irlandeses y tweeds tejidos en telar. Todas se pueden ver y tocar en el taller antes de decidir.", action: _jsx(ButtonLink, { to: paths.bookAppointment, variant: "secondary", leftIcon: _jsx(Icon, { name: "calendar", size: 16 }), children: "Ver el muestrario en persona" }) }), _jsx("div", { className: l.afterHeading, children: _jsx(Tabs, { tabs: tabs, value: categoryId, onChange: setCategoryId, variant: "pill", "aria-label": "Categor\u00EDas de tela" }) }), isError ? (_jsx(EmptyState, { tone: "error", className: l.afterHeading, title: "No pudimos cargar el muestrario", description: "Vuelve a intentarlo en un momento." })) : null, _jsx("div", { className: cx(l.gridFabrics, l.afterHeading), children: isLoading
                    ? Array.from({ length: 6 }, (_, index) => (_jsx(Skeleton, { height: "106px", radius: "var(--radius-md)" }, index)))
                    : fabrics?.map((fabric) => _jsx(FabricCard, { fabric: fabric }, fabric.id)) }), !isLoading && fabrics?.length === 0 ? (_jsx(EmptyState, { icon: "spool", title: "No hay telas en esta categor\u00EDa", description: "Prueba con otra o escr\u00EDbenos: solemos conseguir piezas por encargo." })) : null] }));
}
//# sourceMappingURL=FabricsPage.js.map