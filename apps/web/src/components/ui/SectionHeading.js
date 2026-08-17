import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from '@/lib/cx';
import s from './SectionHeading.module.css';
/**
 * Encabezado de sección con la jerarquía de la marca: versalita dorada, título
 * en serif y un filete de cinta métrica debajo.
 */
export function SectionHeading({ eyebrow, title, description, action, align = 'left', as: Tag = 'h2', size = 'md', className, }) {
    return (_jsxs("div", { className: cx(s.heading, s[align], s[size], className), children: [_jsxs("div", { className: s.main, children: [eyebrow ? (_jsxs("p", { className: s.eyebrow, children: [_jsx("span", { className: s.tick, "aria-hidden": "true" }), eyebrow] })) : null, _jsx(Tag, { className: s.title, children: title }), description ? _jsx("p", { className: s.description, children: description }) : null] }), action ? _jsx("div", { className: s.action, children: action }) : null] }));
}
/** Separador horizontal con el motivo de la marca. */
export function Rule({ variant = 'stitch', className }) {
    return _jsx("hr", { className: cx(s.rule, s[variant], className) });
}
//# sourceMappingURL=SectionHeading.js.map