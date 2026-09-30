import { cx } from '@/lib/cx';
import s from './Logo.module.css';

export interface LogoProps {
  /** `full` muestra el nombre completo; `mark`, solo el monograma. */
  variant?: 'full' | 'mark';
  className?: string;
}

/**
 * Identidad de Real Elegance: el monograma «RE» dorado que dio el usuario
 * (`public/images/logore.png`, PNG transparente). El texto de al lado lleva
 * el nombre y la marca por si el lector de pantalla no lee imágenes; el
 * `<img>` es puramente decorativo (`alt=""`).
 */
export function Logo({ variant = 'full', className }: LogoProps) {
  return (
    <span className={cx(s.logo, className)}>
      <img src="/images/logore.png" alt="" aria-hidden="true" className={s.mark} />
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
