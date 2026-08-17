import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './IconButton';
import { Icon } from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cx } from '@/lib/cx';
import s from './Drawer.module.css';
/**
 * Panel lateral. Comparte con `Modal` el foco atrapado, el cierre con Escape y
 * el bloqueo de scroll; se diferencia en que ocupa toda la altura y no se cierra
 * el flujo de la página detrás.
 */
export function Drawer({ open, onClose, title, footer, side = 'right', children, className, }) {
    const panelRef = useRef(null);
    const titleId = useId();
    useFocusTrap(panelRef, open);
    useScrollLock(open);
    useEffect(() => {
        if (!open)
            return;
        function handleKey(event) {
            if (event.key === 'Escape')
                onClose();
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);
    if (!open)
        return null;
    return createPortal(_jsx("div", { className: s.overlay, onMouseDown: onClose, children: _jsxs("aside", { ref: panelRef, className: cx(s.panel, s[side], className), role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabIndex: -1, onMouseDown: (event) => event.stopPropagation(), children: [_jsxs("header", { className: s.header, children: [_jsx("h2", { className: s.title, id: titleId, children: title }), _jsx(IconButton, { label: "Cerrar", icon: _jsx(Icon, { name: "close", size: 18 }), onClick: onClose })] }), _jsx("div", { className: s.body, children: children }), footer ? _jsx("footer", { className: s.footer, children: footer }) : null] }) }), document.body);
}
//# sourceMappingURL=Drawer.js.map