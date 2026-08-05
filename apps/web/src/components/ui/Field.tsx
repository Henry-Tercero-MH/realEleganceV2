import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './Field.module.css';

export interface FieldProps {
  /** Id del control que etiqueta. */
  htmlFor: string;
  label?: ReactNode;
  hint?: ReactNode;
  /** Mensaje de error; cuando existe, sustituye visualmente a la ayuda. */
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  /** Ids que el control debe referenciar en `aria-describedby`. */
  hintId?: string;
  errorId?: string;
}

/**
 * Envoltorio de un campo: etiqueta, control, ayuda y error.
 *
 * `Input`, `Textarea` y `Select` ya lo usan por dentro; se exporta suelto para
 * los controles compuestos (selector de tela, calendario de citas) que quieren
 * el mismo chrome sin ser un `<input>`.
 */
export function Field({
  htmlFor,
  label,
  hint,
  error,
  required,
  className,
  children,
  hintId,
  errorId,
}: FieldProps) {
  return (
    <div className={cx(s.field, className)}>
      {label ? (
        <label className={s.label} htmlFor={htmlFor}>
          {label}
          {required ? (
            <span className={s.required} aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children}

      {hint && !error ? (
        <p className={s.hint} id={hintId}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p className={s.error} id={errorId} role="alert">
          <Icon name="alert" size={14} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * Calcula los ids de ayuda/error y el `aria-describedby` de un control.
 * Se comparte entre Input, Textarea y Select para no repetir la lógica.
 */
export function describedBy(id: string, hint?: ReactNode, error?: string) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return {
    hintId,
    errorId,
    // El error va primero: es lo que más urge escuchar.
    'aria-describedby': [errorId, !error ? hintId : undefined].filter(Boolean).join(' ') || undefined,
  };
}
