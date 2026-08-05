import { useId } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { formatCurrency } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './OptionCard.module.css';

export interface OptionCardProps {
  /** Nombre del grupo de radio (p. ej. `option-group-solapa`). */
  name: string;
  value: string | number;
  checked: boolean;
  onChange: (value: string | number) => void;

  title: ReactNode;
  description?: ReactNode;
  /** Diferencia de precio sobre el precio base. `0` se muestra como «Incluido». */
  priceDelta?: number;

  /** Color de la muestra de tela. Se ignora si hay `imageUrl`. */
  swatchColor?: string | null;
  /** Foto del muestrario; manda sobre `swatchColor`. */
  imageUrl?: string | null;

  disabled?: boolean;
  /** `tile` pone la muestra grande arriba; `row`, un cuadro pequeño a la izquierda. */
  layout?: 'row' | 'tile';
  className?: string;
}

/**
 * Opción seleccionable del personalizador: solapa, forro, botones, tela.
 *
 * Por dentro es un `<input type="radio">` real —teclado con flechas, un solo
 * seleccionado por grupo, envío nativo— con la caja dibujada encima.
 */
export function OptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  priceDelta,
  swatchColor,
  imageUrl,
  disabled = false,
  layout = 'row',
  className,
}: OptionCardProps) {
  const id = useId();
  const hasSwatch = Boolean(imageUrl || swatchColor);

  return (
    <div className={cx(s.option, s[layout], checked && s.checked, disabled && s.disabled, className)}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className={s.input}
      />

      <label htmlFor={id} className={s.label}>
        {hasSwatch ? (
          <span className={s.swatch} style={{ backgroundColor: swatchColor ?? undefined }}>
            {imageUrl ? <img src={imageUrl} alt="" loading="lazy" /> : null}
          </span>
        ) : null}

        <span className={s.text}>
          <span className={s.title}>{title}</span>
          {description ? <span className={s.description}>{description}</span> : null}
        </span>

        {typeof priceDelta === 'number' ? (
          <span className={cx(s.price, priceDelta === 0 && s.included)}>
            {priceDelta === 0
              ? 'Incluido'
              : `${priceDelta > 0 ? '+' : '−'}${formatCurrency(Math.abs(priceDelta))}`}
          </span>
        ) : null}

        <span className={s.mark} aria-hidden="true">
          <Icon name="check" size={12} />
        </span>
      </label>
    </div>
  );
}
