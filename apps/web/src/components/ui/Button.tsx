import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { cx } from '@/lib/cx';
import { Spinner } from './Spinner';
import s from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa todo el ancho disponible (útil en móvil y en formularios). */
  fullWidth?: boolean;
  /** Icono a la izquierda del texto. */
  leftIcon?: ReactNode;
  /** Icono a la derecha del texto. */
  rightIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export interface ButtonProps
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  /** Muestra un spinner y desactiva el botón, sin que cambie de tamaño. */
  isLoading?: boolean;
}

function classesFor({ variant = 'secondary', size = 'md', fullWidth, className }: ButtonBaseProps) {
  return cx(s.button, s[variant], s[size], fullWidth && s.fullWidth, className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    fullWidth,
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(classesFor({ variant, size, fullWidth, className }), isLoading && s.loading)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      <span className={isLoading ? s.loadingLabel : s.label}>
        {leftIcon ? <span className={s.icon}>{leftIcon}</span> : null}
        {children}
        {rightIcon ? <span className={s.icon}>{rightIcon}</span> : null}
      </span>
      {isLoading ? (
        <span className={s.spinner}>
          <Spinner size={size === 'lg' ? 20 : 16} label="Procesando" />
        </span>
      ) : null}
    </button>
  );
});

export interface ButtonLinkProps extends ButtonBaseProps, Omit<LinkProps, 'className' | 'children'> {
  /**
   * `true` cuando el destino es externo o un `mailto:`/`tel:`: renderiza un
   * `<a>` normal en lugar del `<Link>` del router.
   */
  external?: boolean;
}

/**
 * Un enlace que se ve como un botón. Existe para no romper la semántica: si la
 * acción **navega**, debe ser un `<a>`, no un `<button>` con `onClick`.
 */
export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  fullWidth,
  leftIcon,
  rightIcon,
  children,
  className,
  external = false,
  to,
  ...rest
}: ButtonLinkProps) {
  const classes = classesFor({ variant, size, fullWidth, className });
  const content = (
    <>
      {leftIcon ? <span className={s.icon}>{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className={s.icon}>{rightIcon}</span> : null}
    </>
  );

  if (external) {
    return (
      <a
        href={String(to)}
        className={classes}
        target="_blank"
        rel="noreferrer noopener"
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {content}
    </Link>
  );
}
