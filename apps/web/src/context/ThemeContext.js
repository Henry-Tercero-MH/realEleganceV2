import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage';
const ThemeContext = createContext(null);
/**
 * Tema de la interfaz.
 *
 * El tema «lino» (claro) es el valor por defecto; el tema oscuro existe para
 * quien lo prefiera.
 */
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => readStorage(STORAGE_KEYS.theme, 'light'));
    // El atributo vive en <html>, que es donde `tokens.css` remapea los semánticos.
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);
    const setTheme = useCallback((next) => {
        setThemeState(next);
        writeStorage(STORAGE_KEYS.theme, next);
    }, []);
    const toggleTheme = useCallback(() => {
        setThemeState((current) => {
            const next = current === 'dark' ? 'light' : 'dark';
            writeStorage(STORAGE_KEYS.theme, next);
            return next;
        });
    }, []);
    const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error('useTheme debe usarse dentro de <ThemeProvider>.');
    return context;
}
//# sourceMappingURL=ThemeContext.js.map