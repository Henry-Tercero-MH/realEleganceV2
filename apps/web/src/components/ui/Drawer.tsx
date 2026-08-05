import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { IconButton } from './IconButton';
import { Icon } from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cx } from '@/lib/cx';
import s from './Drawer.module.css';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Contenido fijo al pie (totales del carrito, botón de pago). */
  footer?: ReactNode;
  /** Lado por el que entra. El carrito viene de la derecha; los filtros, de la izquierda. */
  side?: 'right' | 'left';
  children: ReactNode;
  className?: string;
}

/**
 * Panel lateral. Comparte con `Modal` el foco atrapado, el cierre con Escape y
 * el bloqueo de scroll; se diferencia en que ocupa toda la altura y no se cierra
 * el flujo de la página detrás.
 */
export function Drawer({
  open,
  onClose,
  title,
  footer,
  side = 'right',
  children,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useFocusTrap(panelRef, open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={s.overlay} onMouseDown={onClose}>
      <aside
        ref={panelRef}
        className={cx(s.panel, s[side], className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={s.header}>
          <h2 className={s.title} id={titleId}>
            {title}
          </h2>
          <IconButton label="Cerrar" icon={<Icon name="close" size={18} />} onClick={onClose} />
        </header>

        <div className={s.body}>{children}</div>

        {footer ? <footer className={s.footer}>{footer}</footer> : null}
      </aside>
    </div>,
    document.body,
  );
}
