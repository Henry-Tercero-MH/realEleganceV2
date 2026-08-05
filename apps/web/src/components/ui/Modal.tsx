import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { IconButton } from './IconButton';
import { Icon } from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cx } from '@/lib/cx';
import s from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Línea de apoyo bajo el título. */
  description?: ReactNode;
  /** Botonera inferior. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /**
   * `false` cuando el diálogo exige una decisión (confirmar borrado) y no
   * queremos que se cierre por accidente al pulsar fuera.
   */
  closeOnBackdrop?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Diálogo modal accesible: foco atrapado, cierre con Escape, fondo bloqueado y
 * el foco devuelto al disparador al cerrar.
 *
 * Se monta en un portal sobre `<body>` para que ningún `overflow: hidden` de un
 * ancestro lo recorte.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  children,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(panelRef, open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={s.overlay} onMouseDown={closeOnBackdrop ? onClose : undefined}>
      <div
        ref={panelRef}
        className={cx(s.panel, s[size], className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        // Frena la propagación para que un clic dentro no dispare el cierre
        // del backdrop.
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={s.header}>
          <div className={s.headerText}>
            <h2 className={s.title} id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className={s.description} id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>
          <IconButton
            label="Cerrar"
            icon={<Icon name="close" size={18} />}
            onClick={onClose}
            className={s.close}
          />
        </header>

        <div className={s.body}>{children}</div>

        {footer ? <footer className={s.footer}>{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
