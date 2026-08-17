import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '@/lib/cx';
import { Spinner } from './Spinner';
import s from './Button.module.css';
function classesFor({ variant = 'secondary', size = 'md', fullWidth, className }) {
    return cx(s.button, s[variant], s[size], fullWidth && s.fullWidth, className);
}
export const Button = forwardRef(function Button({ variant = 'secondary', size = 'md', fullWidth, isLoading = false, leftIcon, rightIcon, children, className, disabled, type = 'button', ...rest }, ref) {
    return (_jsxs("button", { ref: ref, type: type, className: cx(classesFor({ variant, size, fullWidth, className }), isLoading && s.loading), disabled: disabled || isLoading, "aria-busy": isLoading || undefined, ...rest, children: [_jsxs("span", { className: isLoading ? s.loadingLabel : s.label, children: [leftIcon ? _jsx("span", { className: s.icon, children: leftIcon }) : null, children, rightIcon ? _jsx("span", { className: s.icon, children: rightIcon }) : null] }), isLoading ? (_jsx("span", { className: s.spinner, children: _jsx(Spinner, { size: size === 'lg' ? 20 : 16, label: "Procesando" }) })) : null] }));
});
/**
 * Un enlace que se ve como un botón. Existe para no romper la semántica: si la
 * acción **navega**, debe ser un `<a>`, no un `<button>` con `onClick`.
 */
export function ButtonLink({ variant = 'secondary', size = 'md', fullWidth, leftIcon, rightIcon, children, className, external = false, to, ...rest }) {
    const classes = classesFor({ variant, size, fullWidth, className });
    const content = (_jsxs(_Fragment, { children: [leftIcon ? _jsx("span", { className: s.icon, children: leftIcon }) : null, children, rightIcon ? _jsx("span", { className: s.icon, children: rightIcon }) : null] }));
    if (external) {
        return (_jsx("a", { href: String(to), className: classes, target: "_blank", rel: "noreferrer noopener", ...rest, children: content }));
    }
    return (_jsx(Link, { to: to, className: classes, ...rest, children: content }));
}
//# sourceMappingURL=Button.js.map