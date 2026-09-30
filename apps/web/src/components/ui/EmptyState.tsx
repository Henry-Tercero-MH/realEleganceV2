import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { cx } from '@/lib/cx';
import s from './EmptyState.module.css';

export interface EmptyStateProps {
  icon?: IconName;
  /** Gráfico propio más grande que un `Icon` (p. ej. el carrete del 404); si se pasa, reemplaza al `icon`. */
  illustration?: ReactNode;
  title: string;
  /** Copy útil, no un «no hay datos»: di qué puede hacer la persona ahora. */
  description?: ReactNode;
  /** Acción principal — normalmente un `<ButtonLink>`. */
  action?: ReactNode;
  /** `error` tiñe el icono de rojo y sube el peso visual del bloque. */
  tone?: 'neutral' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Estado vacío o de error. Es un componente propio (y no un `<p>` suelto) para
 * que «no hay nada aquí» se vea igual en las 20 pantallas donde puede pasar.
 */
export function EmptyState({
  icon = 'hanger',
  illustration,
  title,
  description,
  action,
  tone = 'neutral',
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cx(s.empty, s[tone], s[size], className)}
      role={tone === 'error' ? 'alert' : undefined}
    >
      <span className={illustration ? s.illustrationWrap : s.iconWrap}>
        {illustration ?? <Icon name={tone === 'error' ? 'alert' : icon} size={size === 'sm' ? 22 : 28} />}
      </span>
      <h3 className={s.title}>{title}</h3>
      {description ? <p className={s.description}>{description}</p> : null}
      {action ? <div className={s.action}>{action}</div> : null}
    </div>
  );
}
