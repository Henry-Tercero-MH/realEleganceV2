import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './IconButton';
import { Icon } from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cx } from '@/lib/cx';
import s from './Modal.module.css';
/**
 * Diálogo modal accesible: foco atrapado, cierre con Escape, fondo bloqueado y
 * el foco devuelto al disparador al cerrar.
 *
 * Se monta en un portal sobre `<body>` para que ningún `overflow: hidden` de un
 * ancestro lo recorte.
 */
export function Modal({ open, onClose, title, description, footer, size = 'md', closeOnBackdrop = true, children, className, }) {
    const panelRef = useRef(null);
    const titleId = useId();
    const descriptionId = useId();
    useFocusTrap(panelRef, open);
    useScrollLock(open);
    useEffect(() => {
        if (!open)
            return;
        function handleKey(event) {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onClose();
            }
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);
    if (!open)
        return null;
    return createPortal(_jsx("div", { className: s.overlay, onMouseDown: closeOnBackdrop ? onClose : undefined, children: _jsxs("div", { ref: panelRef, className: cx(s.panel, s[size], className), role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": description ? descriptionId : undefined, tabIndex: -1, 
            // Frena la propagación para que un clic dentro no dispare el cierre
            // del backdrop.
            onMouseDown: (event) => event.stopPropagation(), children: [_jsxs("header", { className: s.header, children: [_jsxs("div", { className: s.headerText, children: [_jsx("h2", { className: s.title, id: titleId, children: title }), description ? (_jsx("p", { className: s.description, id: descriptionId, children: description })) : null] }), _jsx(IconButton, { label: "Cerrar", icon: _jsx(Icon, { name: "close", size: 18 }), onClick: onClose, className: s.close })] }), _jsx("div", { className: s.body, children: children }), footer ? _jsx("footer", { className: s.footer, children: footer }) : null] }) }), document.body);
}
//# sourceMappingURL=Modal.js.map