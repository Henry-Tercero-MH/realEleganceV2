import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes, ReactNode } from 'react';
import { Field, describedBy } from './Field';
import { cx } from '@/lib/cx';
import s from './Field.module.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  fieldClassName?: string;
  id?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, className, fieldClassName, id, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const { hintId, errorId, ...aria } = describedBy(fieldId, hint, error);

  return (
    <Field
      htmlFor={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={fieldClassName}
      hintId={hintId}
      errorId={errorId}
    >
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        className={cx(s.control, s.textarea, className)}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        required={required}
        {...aria}
        {...rest}
      />
    </Field>
  );
});
