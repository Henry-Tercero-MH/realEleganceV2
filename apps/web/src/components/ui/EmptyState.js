import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './EmptyState.module.css';
/**
 * Estado vacío o de error. Es un componente propio (y no un `<p>` suelto) para
 * que «no hay nada aquí» se vea igual en las 20 pantallas donde puede pasar.
 */
export function EmptyState({ icon = 'hanger', title, description, action, tone = 'neutral', size = 'md', className, }) {
    return (_jsxs("div", { className: cx(s.empty, s[tone], s[size], className), role: tone === 'error' ? 'alert' : undefined, children: [_jsx("span", { className: s.iconWrap, children: _jsx(Icon, { name: tone === 'error' ? 'alert' : icon, size: size === 'sm' ? 22 : 28 }) }), _jsx("h3", { className: s.title, children: title }), description ? _jsx("p", { className: s.description, children: description }) : null, action ? _jsx("div", { className: s.action, children: action }) : null] }));
}
//# sourceMappingURL=EmptyState.js.map