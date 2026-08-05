import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { IconButton } from './IconButton';
import { cx } from '@/lib/cx';
import s from './Toast.module.css';

export type ToastTone = 'info' | 'success' | 'error';

export interface ToastData {
  id: string;
  tone: ToastTone;
  title: string;
  description?: ReactNode;
  /** Acción opcional en el propio aviso, p. ej. «Ver carrito». */
  action?: { label: string; onClick: () => void };
}

const TONE_ICONS: Record<ToastTone, IconName> = {
  info: 'info',
  success: 'checkCircle',
  error: 'alert',
};

export interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

/**
 * Aviso individual. Es puramente presentacional: quién lo crea y cuándo
 * desaparece lo decide `ToastProvider`.
 */
export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div
      className={cx(s.toast, s[toast.tone])}
      role={toast.tone === 'error' ? 'alert' : 'status'}
      aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}
    >
      <span className={s.icon}>
        <Icon name={TONE_ICONS[toast.tone]} size={20} />
      </span>

      <div className={s.content}>
        <p className={s.title}>{toast.title}</p>
        {toast.description ? <p className={s.description}>{toast.description}</p> : null}
        {toast.action ? (
          <button type="button" className={s.action} onClick={toast.action.onClick}>
            {toast.action.label}
          </button>
        ) : null}
      </div>

      <IconButton
        label="Descartar aviso"
        size="sm"
        icon={<Icon name="close" size={15} />}
        onClick={() => onDismiss(toast.id)}
      />
    </div>
  );
}

export interface ToastViewportProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

/** Pila de avisos, anclada abajo a la derecha (arriba en móvil). */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={s.viewport} aria-label="Avisos">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
