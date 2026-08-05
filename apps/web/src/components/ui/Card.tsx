import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `plain` — panel sobrio, el de siempre.
   * `raised` — un escalón más de superficie, para tarjetas sobre paneles.
   * `outlined` — sin relleno, solo el filete dorado.
   */
  variant?: 'plain' | 'raised' | 'outlined';
  /** Realza el borde y levanta la tarjeta al pasar el cursor (rejillas clicables). */
  interactive?: boolean;
  children: ReactNode;
}

/**
 * Contenedor base del sistema, compuesto por *slots* en lugar de por una lista
 * infinita de props booleanas:
 *
 * ```tsx
 * <Card interactive>
 *   <Card.Media><img … /></Card.Media>
 *   <Card.Header title="Traje Príncipe de Gales" eyebrow="Cruzado" />
 *   <Card.Body>…</Card.Body>
 *   <Card.Footer>…</Card.Footer>
 * </Card>
 * ```
 */
export function Card({
  variant = 'plain',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(s.card, s[variant], interactive && s.interactive, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Proporción del hueco de imagen. Los trajes van en 3/4; las telas, cuadradas. */
  ratio?: '1/1' | '3/4' | '4/3' | '16/9';
  children: ReactNode;
}

function CardMedia({ ratio = '3/4', className, children, ...rest }: CardMediaProps) {
  return (
    <div
      className={cx(s.media, className)}
      style={{ aspectRatio: ratio }}
      {...rest}
    >
      {children}
    </div>
  );
}

// `title` se omite de los atributos nativos: aquí es contenido renderizable,
// no el `title` de HTML (que es solo texto y saldría como tooltip).
export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Versalita dorada sobre el título (categoría, estilo, código). */
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Contenido alineado a la derecha: precio, badge, menú. */
  aside?: ReactNode;
  children?: ReactNode;
}

function CardHeader({
  eyebrow,
  title,
  subtitle,
  aside,
  className,
  children,
  ...rest
}: CardHeaderProps) {
  return (
    <div className={cx(s.header, className)} {...rest}>
      <div className={s.headerMain}>
        {eyebrow ? <p className={s.eyebrow}>{eyebrow}</p> : null}
        {title ? <h3 className={s.title}>{title}</h3> : null}
        {subtitle ? <p className={s.subtitle}>{subtitle}</p> : null}
        {children}
      </div>
      {aside ? <div className={s.headerAside}>{aside}</div> : null}
    </div>
  );
}

function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(s.body, className)} {...rest}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(s.footer, className)} {...rest}>
      {children}
    </div>
  );
}

Card.Media = CardMedia;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
