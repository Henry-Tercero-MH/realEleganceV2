import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './SectionHeading.module.css';

export interface SectionHeadingProps {
  /** Versalita dorada sobre el título. */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Acción a la derecha (un «Ver todo», un botón de crear). */
  action?: ReactNode;
  align?: 'left' | 'center';
  /** Nivel semántico real del encabezado; el tamaño lo decide `size`. */
  as?: ElementType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Encabezado de sección con la jerarquía de la marca: versalita dorada, título
 * en serif y un filete de cinta métrica debajo.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  as: Tag = 'h2',
  size = 'md',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cx(s.heading, s[align], s[size], className)}>
      <div className={s.main}>
        {eyebrow ? (
          <p className={s.eyebrow}>
            <span className={s.tick} aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <Tag className={s.title}>{title}</Tag>
        {description ? <p className={s.description}>{description}</p> : null}
      </div>
      {action ? <div className={s.action}>{action}</div> : null}
    </div>
  );
}

export interface RuleProps {
  /** `tape` dibuja los ticks de la cinta métrica; `stitch`, una hilvanada. */
  variant?: 'tape' | 'stitch' | 'solid';
  className?: string;
}

/** Separador horizontal con el motivo de la marca. */
export function Rule({ variant = 'stitch', className }: RuleProps) {
  return <hr className={cx(s.rule, s[variant], className)} />;
}
