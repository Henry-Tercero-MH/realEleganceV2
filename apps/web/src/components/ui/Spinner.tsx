import { cx } from '@/lib/cx';
import s from './Spinner.module.css';

export interface SpinnerProps {
  size?: number;
  className?: string;
  /** Etiqueta anunciada por el lector de pantalla. */
  label?: string;
}

/**
 * Indicador de carga: un arco dorado girando, no un círculo completo, para que
 * se lea como una hilvanada en movimiento.
 */
export function Spinner({ size = 18, className, label }: SpinnerProps) {
  return (
    <span className={cx(s.wrapper, className)} role="status" aria-live="polite">
      <svg
        className={s.svg}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className={s.track} cx="12" cy="12" r="9" strokeWidth="2" />
        <circle
          className={s.arc}
          cx="12"
          cy="12"
          r="9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="16 40"
        />
      </svg>
      <span className="re-sr-only">{label ?? 'Cargando'}</span>
    </span>
  );
}
