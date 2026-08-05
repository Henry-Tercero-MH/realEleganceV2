import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './Price.module.css';

export interface PriceProps {
  amount: number;
  /** Precio anterior tachado, para mostrar un descuento. */
  compareAt?: number | null;
  size?: 'sm' | 'md' | 'lg';
  /** Texto delante del importe: «Desde», «Anticipo». */
  prefix?: string;
  /** Texto detrás: «/ metro», «IVA incl.». */
  suffix?: string;
  className?: string;
}

/**
 * Importe con el tratamiento tipográfico de la marca: cifras tabulares (para
 * que las columnas de precios queden alineadas) y el sufijo en versalita.
 */
export function Price({ amount, compareAt, size = 'md', prefix, suffix, className }: PriceProps) {
  const hasDiscount = typeof compareAt === 'number' && compareAt > amount;

  return (
    <span className={cx(s.price, s[size], className)}>
      {prefix ? <span className={s.prefix}>{prefix}</span> : null}
      {hasDiscount ? (
        <span className={s.compare}>
          <span className="re-sr-only">Precio anterior: </span>
          {formatCurrency(compareAt)}
        </span>
      ) : null}
      <span className={s.amount}>{formatCurrency(amount)}</span>
      {suffix ? <span className={s.suffix}>{suffix}</span> : null}
    </span>
  );
}
