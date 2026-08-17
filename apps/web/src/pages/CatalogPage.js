import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, ButtonLink, EmptyState, Icon, Input, SectionHeading, Select, SkeletonCard, } from '@/components/ui';
import { SuitCard } from '@/features/catalog/ProductCards';
import { useSuitStyles, useSuits } from '@/features/catalog/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './CatalogPage.module.css';
const SORT_OPTIONS = [
    { value: 'featured', label: 'Destacados' },
    { value: 'price-asc', label: 'Precio: de menor a mayor' },
    { value: 'price-desc', label: 'Precio: de mayor a menor' },
    { value: 'name', label: 'Nombre (A–Z)' },
];
export default function CatalogPage() {
    /*
     * Los filtros viven en la URL, no en `useState`: así la búsqueda se puede
     * compartir por enlace y el botón «atrás» del navegador funciona como espera
     * cualquiera.
     */
    const [params, setParams] = useSearchParams();
    const styleId = params.get('estilo') ? Number(params.get('estilo')) : null;
    const sort = params.get('orden') ?? 'featured';
    const page = Number(params.get('pagina') ?? 1);
    // El texto sí es local: escribir no debería reescribir la URL en cada tecla.
    const [search, setSearch] = useState(params.get('q') ?? '');
    const debouncedSearch = useDebounce(search, 350);
    const { data: styles } = useSuitStyles();
    const { data, isLoading, isError, isPlaceholderData } = useSuits({
        search: debouncedSearch || undefined,
        styleId,
        sort,
        page,
        pageSize: 9,
    });
    function updateParam(key, value) {
        const next = new URLSearchParams(params);
        if (value === null || value === '')
            next.delete(key);
        else
            next.set(key, value);
        // Cualquier cambio de filtro vuelve a la primera página.
        if (key !== 'pagina')
            next.delete('pagina');
        setParams(next, { replace: true });
    }
    const hasFilters = Boolean(styleId || search || sort !== 'featured');
    return (_jsxs("div", { className: cx('re-container', l.sectionFirst), children: [_jsx(SectionHeading, { as: "h1", size: "lg", eyebrow: "Cat\u00E1logo", title: "Elige tu corte", description: "Cada modelo es un punto de partida: la tela, la solapa, el forro y los botones los eliges t\u00FA en el siguiente paso." }), _jsxs("form", { className: cx(s.filters, l.afterHeading), role: "search", onSubmit: (e) => e.preventDefault(), children: [_jsx(Input, { label: "Buscar", placeholder: "Nombre o c\u00F3digo del modelo\u2026", value: search, onChange: (event) => {
                            setSearch(event.target.value);
                            updateParam('q', event.target.value);
                        }, startAdornment: _jsx(Icon, { name: "search", size: 17 }), fieldClassName: s.search, type: "search" }), _jsx(Select, { label: "Estilo", placeholder: "Todos los estilos", value: styleId ?? '', onChange: (event) => updateParam('estilo', event.target.value), options: (styles ?? []).map((style) => ({ value: style.id, label: style.name })) }), _jsx(Select, { label: "Ordenar por", value: sort, onChange: (event) => updateParam('orden', event.target.value), options: SORT_OPTIONS }), hasFilters ? (_jsx(Button, { variant: "ghost", className: s.clear, onClick: () => {
                            setSearch('');
                            setParams(new URLSearchParams(), { replace: true });
                        }, children: "Limpiar" })) : null] }), _jsx("p", { className: s.count, "aria-live": "polite", children: isLoading
                    ? 'Buscando modelos…'
                    : `${data?.total ?? 0} ${data?.total === 1 ? 'modelo' : 'modelos'}` }), isError ? (_jsx(EmptyState, { tone: "error", title: "No pudimos cargar el cat\u00E1logo", description: "Ha fallado la conexi\u00F3n. Int\u00E9ntalo de nuevo en unos segundos." })) : null, _jsx("div", { className: cx(l.gridSuits, isPlaceholderData && s.stale), children: isLoading
                    ? Array.from({ length: 6 }, (_, index) => _jsx(SkeletonCard, {}, index))
                    : data?.items.map((suit) => _jsx(SuitCard, { suit: suit }, suit.id)) }), !isLoading && data?.items.length === 0 ? (_jsx(EmptyState, { icon: "search", title: "Ning\u00FAn modelo coincide", description: "Prueba con otro estilo o borra los filtros. Si buscas algo que no est\u00E1 en el cat\u00E1logo, podemos cortarlo igualmente: escr\u00EDbenos.", action: _jsx(ButtonLink, { to: paths.bookAppointment, variant: "secondary", children: "Agendar una consulta" }) })) : null, data && data.totalPages > 1 ? (_jsxs("nav", { className: s.pagination, "aria-label": "Paginaci\u00F3n del cat\u00E1logo", children: [_jsx(Button, { variant: "ghost", disabled: page <= 1, onClick: () => updateParam('pagina', String(page - 1)), leftIcon: _jsx(Icon, { name: "chevronLeft", size: 16 }), children: "Anterior" }), _jsxs("span", { className: s.pageInfo, children: ["P\u00E1gina ", data.page, " de ", data.totalPages] }), _jsx(Button, { variant: "ghost", disabled: page >= data.totalPages, onClick: () => updateParam('pagina', String(page + 1)), rightIcon: _jsx(Icon, { name: "chevronRight", size: 16 }), children: "Siguiente" })] })) : null] }));
}
//# sourceMappingURL=CatalogPage.js.map