import { useEffect } from 'react';
const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');
function focusableWithin(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
}
/**
 * Atrapa el foco dentro de un contenedor mientras está activo (modales, drawer).
 *
 * Hace tres cosas que un diálogo accesible necesita y suelen olvidarse:
 * mover el foco al abrir, hacer que Tab dé la vuelta dentro, y **devolver el
 * foco al elemento que lo abrió** al cerrar.
 */
export function useFocusTrap(ref, active) {
    useEffect(() => {
        if (!active)
            return;
        const container = ref.current;
        if (!container)
            return;
        const previouslyFocused = document.activeElement;
        // Enfoca el primer elemento útil; si no hay ninguno, el propio contenedor.
        const initial = focusableWithin(container)[0] ?? container;
        initial.focus({ preventScroll: true });
        function handleKeyDown(event) {
            if (event.key !== 'Tab' || !container)
                return;
            const items = focusableWithin(container);
            if (items.length === 0) {
                event.preventDefault();
                return;
            }
            const first = items[0];
            const last = items[items.length - 1];
            const activeEl = document.activeElement;
            if (event.shiftKey && (activeEl === first || activeEl === container)) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && activeEl === last) {
                event.preventDefault();
                first.focus();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus?.({ preventScroll: true });
        };
    }, [ref, active]);
}
//# sourceMappingURL=useFocusTrap.js.map