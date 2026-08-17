import { jsx as _jsx } from "react/jsx-runtime";
import { ButtonLink, EmptyState } from '@/components/ui';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
export default function NotFoundPage() {
    return (_jsx("div", { className: cx('re-container', 're-container--narrow', l.section), children: _jsx(EmptyState, { icon: "search", title: "Esta p\u00E1gina se descosi\u00F3", description: "La direcci\u00F3n que buscas no existe o cambi\u00F3 de sitio. Desde el cat\u00E1logo llegas a todo lo dem\u00E1s.", action: _jsx(ButtonLink, { to: paths.catalog, variant: "primary", children: "Ir al cat\u00E1logo" }) }) }));
}
//# sourceMappingURL=NotFoundPage.js.map