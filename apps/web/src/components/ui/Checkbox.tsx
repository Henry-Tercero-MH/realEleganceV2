import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  id?: string;
  fieldClassName?: string;
}

/**
 * Casilla con marca dibujada a mano (el mismo trazo de los iconos).
 *
 * El `<input>` real sigue ahí, transparente y encima de la caja: conserva el
 * comportamiento nativo de teclado, formulario y lector de pantalla.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, id, className, fieldClassName, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cx(s.wrapper, fieldClassName)}>
      <div className={s.row}>
        <span className={s.boxWrap}>
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            className={cx(s.input, className)}
            aria-invalid={error ? true : undefined}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            {...rest}
          />
          <span className={s.box} aria-hidden="true">
            <Icon name="check" size={13} className={s.check} />
          </span>
        </span>
        <label className={s.label} htmlFor={fieldId}>
          {label}
        </label>
      </div>

      {hint && !error ? (
        <p className={s.hint} id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className={s.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
