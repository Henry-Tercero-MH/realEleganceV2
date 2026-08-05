import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Field, describedBy } from './Field';
import { cx } from '@/lib/cx';
import s from './Field.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Mensaje de error de React Hook Form / Zod. */
  error?: string;
  /** Icono o texto pegado al inicio del control (una lupa, `Q`). */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  /** Clase para el envoltorio del campo (no para el `<input>`). */
  fieldClassName?: string;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    required,
    startAdornment,
    endAdornment,
    className,
    fieldClassName,
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const { hintId, errorId, ...aria } = describedBy(inputId, hint, error);

  return (
    <Field
      htmlFor={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={fieldClassName}
      hintId={hintId}
      errorId={errorId}
    >
      <div className={s.controlWrap}>
        {startAdornment ? <span className={s.adornmentStart}>{startAdornment}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cx(
            s.control,
            startAdornment && s.hasStart,
            endAdornment && s.hasEnd,
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          required={required}
          {...aria}
          {...rest}
        />
        {endAdornment ? <span className={s.adornmentEnd}>{endAdornment}</span> : null}
      </div>
    </Field>
  );
});
