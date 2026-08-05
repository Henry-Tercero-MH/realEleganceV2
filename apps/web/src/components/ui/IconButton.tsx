import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './IconButton.module.css';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Obligatorio: sin texto visible, es la única etiqueta accesible que hay. */
  label: string;
  icon: ReactNode;
  variant?: 'ghost' | 'outline' | 'solid' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Punto dorado sobre la esquina (p. ej. el carrito con ítems). */
  badge?: number;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', size = 'md', badge, className, type = 'button', ...rest },
  ref,
) {
  const showBadge = typeof badge === 'number' && badge > 0;

  return (
    <button
      ref={ref}
      type={type}
      className={cx(s.button, s[variant], s[size], className)}
      aria-label={label}
      title={label}
      {...rest}
    >
      {icon}
      {showBadge ? (
        <span className={s.badge} aria-hidden="true">
          {badge > 9 ? '9+' : badge}
        </span>
      ) : null}
    </button>
  );
});
