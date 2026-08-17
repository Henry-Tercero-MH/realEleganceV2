import { useEffect } from 'react';
/** Cuántos overlays hay abiertos: solo el último en cerrarse libera el scroll. */
let lockCount = 0;
/**
 * Bloquea el scroll del `<body>` mientras hay un overlay abierto, compensando
 * el ancho de la barra de scroll para que la página no dé un salto lateral.
 */
export function useScrollLock(active) {
    useEffect(() => {
        if (!active)
            return;
        lockCount += 1;
        if (lockCount === 1) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
            document.body.classList.add('re-scroll-locked');
        }
        return () => {
            lockCount -= 1;
            if (lockCount === 0) {
                document.body.style.paddingRight = '';
                document.body.classList.remove('re-scroll-locked');
            }
        };
    }, [active]);
}
//# sourceMappingURL=useScrollLock.js.map