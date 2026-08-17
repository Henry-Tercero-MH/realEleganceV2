import { useEffect, useState } from 'react';
/**
 * Devuelve `value` con retardo. Se usa en el buscador del catálogo para no
 * disparar una consulta por tecla.
 */
export function useDebounce(value, delayMs = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timer);
    }, [value, delayMs]);
    return debounced;
}
//# sourceMappingURL=useDebounce.js.map