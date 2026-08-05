import { useId } from 'react';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';
import s from './QuantityStepper.module.css';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Etiqueta accesible; en el carrito conviene nombrar el artículo. */
  label?: string;
  /** Deshabilita todo mientras hay una mutación en vuelo. */
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Selector de cantidad del carrito.
 *
 * El número es un `<input type="number">` real para que se pueda escribir
 * directamente «12» en lugar de pulsar «+» doce veces.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = 'Cantidad',
  disabled = false,
  size = 'md',
  className,
}: QuantityStepperProps) {
  const id = useId();

  function clamp(next: number) {
    if (Number.isNaN(next)) return min;
    return Math.min(max, Math.max(min, next));
  }

  return (
    <div className={cx(s.stepper, s[size], disabled && s.disabled, className)}>
      <button
        type="button"
        className={s.button}
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label={`Quitar uno — ${label}`}
      >
        <Icon name="minus" size={size === 'sm' ? 14 : 16} />
      </button>

      <label htmlFor={id} className="re-sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        className={s.value}
        value={value}
        min={min}
        max={max}
        step={1}
        disabled={disabled}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
      />

      <button
        type="button"
        className={s.button}
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label={`Añadir uno — ${label}`}
      >
        <Icon name="plus" size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  );
}
