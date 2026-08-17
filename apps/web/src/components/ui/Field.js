import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Field.module.css';
/**
 * Envoltorio de un campo: etiqueta, control, ayuda y error.
 *
 * `Input`, `Textarea` y `Select` ya lo usan por dentro; se exporta suelto para
 * los controles compuestos (selector de tela, calendario de citas) que quieren
 * el mismo chrome sin ser un `<input>`.
 */
export function Field({ htmlFor, label, hint, error, required, className, children, hintId, errorId, }) {
    return (_jsxs("div", { className: cx(s.field, className), children: [label ? (_jsxs("label", { className: s.label, htmlFor: htmlFor, children: [label, required ? (_jsx("span", { className: s.required, "aria-hidden": "true", children: "*" })) : null] })) : null, children, hint && !error ? (_jsx("p", { className: s.hint, id: hintId, children: hint })) : null, error ? (_jsxs("p", { className: s.error, id: errorId, role: "alert", children: [_jsx(Icon, { name: "alert", size: 14 }), _jsx("span", { children: error })] })) : null] }));
}
/**
 * Calcula los ids de ayuda/error y el `aria-describedby` de un control.
 * Se comparte entre Input, Textarea y Select para no repetir la lógica.
 */
export function describedBy(id, hint, error) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    return {
        hintId,
        errorId,
        // El error va primero: es lo que más urge escuchar.
        'aria-describedby': [errorId, !error ? hintId : undefined].filter(Boolean).join(' ') || undefined,
    };
}
//# sourceMappingURL=Field.js.map