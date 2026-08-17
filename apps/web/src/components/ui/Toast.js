import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { cx } from '@/lib/cx';
import s from './Toast.module.css';
const TONE_ICONS = {
    info: 'info',
    success: 'checkCircle',
    error: 'alert',
};
/**
 * Aviso individual. Es puramente presentacional: quién lo crea y cuándo
 * desaparece lo decide `ToastProvider`.
 */
export function Toast({ toast, onDismiss }) {
    return (_jsxs("div", { className: cx(s.toast, s[toast.tone]), role: toast.tone === 'error' ? 'alert' : 'status', "aria-live": toast.tone === 'error' ? 'assertive' : 'polite', children: [_jsx("span", { className: s.icon, children: _jsx(Icon, { name: TONE_ICONS[toast.tone], size: 20 }) }), _jsxs("div", { className: s.content, children: [_jsx("p", { className: s.title, children: toast.title }), toast.description ? _jsx("p", { className: s.description, children: toast.description }) : null, toast.action ? (_jsx("button", { type: "button", className: s.action, onClick: toast.action.onClick, children: toast.action.label })) : null] }), _jsx(IconButton, { label: "Descartar aviso", size: "sm", icon: _jsx(Icon, { name: "close", size: 15 }), onClick: () => onDismiss(toast.id) })] }));
}
/** Pila de avisos, anclada abajo a la derecha (arriba en móvil). */
export function ToastViewport({ toasts, onDismiss }) {
    if (toasts.length === 0)
        return null;
    return (_jsx("div", { className: s.viewport, "aria-label": "Avisos", children: toasts.map((toast) => (_jsx(Toast, { toast: toast, onDismiss: onDismiss }, toast.id))) }));
}
//# sourceMappingURL=Toast.js.map