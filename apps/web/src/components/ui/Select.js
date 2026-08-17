import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from 'react';
import { Field, describedBy } from './Field';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Field.module.css';
/**
 * `<select>` nativo con la piel de la marca.
 *
 * Nativo a propósito: en móvil abre la rueda del sistema, funciona sin
 * JavaScript de teclado y no arrastra una librería de combobox.
 */
export const Select = forwardRef(function Select({ label, hint, error, options, placeholder, required, className, fieldClassName, id, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const { hintId, errorId, ...aria } = describedBy(fieldId, hint, error);
    return (_jsx(Field, { htmlFor: fieldId, label: label, hint: hint, error: error, required: required, className: fieldClassName, hintId: hintId, errorId: errorId, children: _jsxs("div", { className: s.controlWrap, children: [_jsxs("select", { ref: ref, id: fieldId, className: cx(s.control, s.select, className), "aria-invalid": error ? true : undefined, "aria-required": required || undefined, required: required, ...aria, ...rest, children: [placeholder ? _jsx("option", { value: "", children: placeholder }) : null, options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)))] }), _jsx("span", { className: s.selectChevron, children: _jsx(Icon, { name: "chevronDown", size: 16 }) })] }) }));
});
//# sourceMappingURL=Select.js.map