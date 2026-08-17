import '@testing-library/jest-dom/vitest';
/**
 * jsdom no implementa `matchMedia`: lo mockeamos para que `useMediaQuery` (y
 * por tanto `ThemeProvider`, `useIsMobile`, etc.) no revienten en los tests.
 */
if (!window.matchMedia) {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
    });
}
//# sourceMappingURL=setup.js.map