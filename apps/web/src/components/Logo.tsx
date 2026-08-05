import { cx } from '@/lib/cx';
import s from './Logo.module.css';

export interface LogoProps {
  /** `full` muestra el nombre completo; `mark`, solo el monograma. */
  variant?: 'full' | 'mark';
  className?: string;
}

/**
 * Identidad de Real Elegance.
 *
 * El monograma «RE» va enmarcado por dos filetes con ticks de cinta métrica —
 * el mismo motivo que recorre toda la interfaz.
 */
export function Logo({ variant = 'full', className }: LogoProps) {
  return (
    <span className={cx(s.logo, className)}>
      <span className={s.mark} aria-hidden="true">
        RE
      </span>
      {variant === 'full' ? (
        <span className={s.words}>
          <span className={s.name}>Real Elegance</span>
          <span className={s.tagline}>Sastrería artesanal</span>
        </span>
      ) : null}
      <span className="re-sr-only">Real Elegance — sastrería artesanal</span>
    </span>
  );
}
