import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { Field, describedBy } from './Field';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Field.module.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  options: SelectOption[];
  /** Opción vacía inicial (`value=""`), p. ej. «Todos los estilos». */
  placeholder?: string;
  fieldClassName?: string;
  id?: string;
}

/**
 * `<select>` nativo con la piel de la marca.
 *
 * Nativo a propósito: en móvil abre la rueda del sistema, funciona sin
 * JavaScript de teclado y no arrastra una librería de combobox.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, required, className, fieldClassName, id, ...rest },
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
      <div className={s.controlWrap}>
        <select
          ref={ref}
          id={fieldId}
          className={cx(s.control, s.select, className)}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          required={required}
          {...aria}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={s.selectChevron}>
          <Icon name="chevronDown" size={16} />
        </span>
      </div>
    </Field>
  );
});
