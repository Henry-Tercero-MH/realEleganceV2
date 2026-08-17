import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from '@/lib/cx';
import s from './Card.module.css';
/**
 * Contenedor base del sistema, compuesto por *slots* en lugar de por una lista
 * infinita de props booleanas:
 *
 * ```tsx
 * <Card interactive>
 *   <Card.Media><img … /></Card.Media>
 *   <Card.Header title="Traje Príncipe de Gales" eyebrow="Cruzado" />
 *   <Card.Body>…</Card.Body>
 *   <Card.Footer>…</Card.Footer>
 * </Card>
 * ```
 */
export function Card({ variant = 'plain', interactive = false, className, children, ...rest }) {
    return (_jsx("div", { className: cx(s.card, s[variant], interactive && s.interactive, className), ...rest, children: children }));
}
function CardMedia({ ratio = '3/4', className, children, ...rest }) {
    return (_jsx("div", { className: cx(s.media, className), style: { aspectRatio: ratio }, ...rest, children: children }));
}
function CardHeader({ eyebrow, title, subtitle, aside, className, children, ...rest }) {
    return (_jsxs("div", { className: cx(s.header, className), ...rest, children: [_jsxs("div", { className: s.headerMain, children: [eyebrow ? _jsx("p", { className: s.eyebrow, children: eyebrow }) : null, title ? _jsx("h3", { className: s.title, children: title }) : null, subtitle ? _jsx("p", { className: s.subtitle, children: subtitle }) : null, children] }), aside ? _jsx("div", { className: s.headerAside, children: aside }) : null] }));
}
function CardBody({ className, children, ...rest }) {
    return (_jsx("div", { className: cx(s.body, className), ...rest, children: children }));
}
function CardFooter({ className, children, ...rest }) {
    return (_jsx("div", { className: cx(s.footer, className), ...rest, children: children }));
}
Card.Media = CardMedia;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
//# sourceMappingURL=Card.js.map