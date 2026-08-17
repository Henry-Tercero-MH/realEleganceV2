import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from 'react';
import { Field, describedBy } from './Field';
import { cx } from '@/lib/cx';
import s from './Field.module.css';
export const Input = forwardRef(function Input({ label, hint, error, required, startAdornment, endAdornment, className, fieldClassName, id, ...rest }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const { hintId, errorId, ...aria } = describedBy(inputId, hint, error);
    return (_jsx(Field, { htmlFor: inputId, label: label, hint: hint, error: error, required: required, className: fieldClassName, hintId: hintId, errorId: errorId, children: _jsxs("div", { className: s.controlWrap, children: [startAdornment ? _jsx("span", { className: s.adornmentStart, children: startAdornment }) : null, _jsx("input", { ref: ref, id: inputId, className: cx(s.control, startAdornment && s.hasStart, endAdornment && s.hasEnd, className), "aria-invalid": error ? true : undefined, "aria-required": required || undefined, required: required, ...aria, ...rest }), endAdornment ? _jsx("span", { className: s.adornmentEnd, children: endAdornment }) : null] }) }));
});
//# sourceMappingURL=Input.js.map