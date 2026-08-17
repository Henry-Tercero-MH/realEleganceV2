import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from 'react';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Checkbox.module.css';
/**
 * Casilla con marca dibujada a mano (el mismo trazo de los iconos).
 *
 * El `<input>` real sigue ahí, transparente y encima de la caja: conserva el
 * comportamiento nativo de teclado, formulario y lector de pantalla.
 */
export const Checkbox = forwardRef(function Checkbox({ label, hint, error, id, className, fieldClassName, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    return (_jsxs("div", { className: cx(s.wrapper, fieldClassName), children: [_jsxs("div", { className: s.row, children: [_jsxs("span", { className: s.boxWrap, children: [_jsx("input", { ref: ref, id: fieldId, type: "checkbox", className: cx(s.input, className), "aria-invalid": error ? true : undefined, "aria-describedby": [errorId, hintId].filter(Boolean).join(' ') || undefined, ...rest }), _jsx("span", { className: s.box, "aria-hidden": "true", children: _jsx(Icon, { name: "check", size: 13, className: s.check }) })] }), _jsx("label", { className: s.label, htmlFor: fieldId, children: label })] }), hint && !error ? (_jsx("p", { className: s.hint, id: hintId, children: hint })) : null, error ? (_jsx("p", { className: s.error, id: errorId, role: "alert", children: error })) : null] }));
});
//# sourceMappingURL=Checkbox.js.map