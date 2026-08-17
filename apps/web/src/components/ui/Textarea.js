import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useId } from 'react';
import { Field, describedBy } from './Field';
import { cx } from '@/lib/cx';
import s from './Field.module.css';
export const Textarea = forwardRef(function Textarea({ label, hint, error, required, className, fieldClassName, id, rows = 4, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const { hintId, errorId, ...aria } = describedBy(fieldId, hint, error);
    return (_jsx(Field, { htmlFor: fieldId, label: label, hint: hint, error: error, required: required, className: fieldClassName, hintId: hintId, errorId: errorId, children: _jsx("textarea", { ref: ref, id: fieldId, rows: rows, className: cx(s.control, s.textarea, className), "aria-invalid": error ? true : undefined, "aria-required": required || undefined, required: required, ...aria, ...rest }) }));
});
//# sourceMappingURL=Textarea.js.map