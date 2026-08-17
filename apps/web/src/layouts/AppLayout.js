import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/PageLoader';
import s from './AppLayout.module.css';
/**
 * Envoltorio de toda la tienda pública y del área de cliente.
 *
 * Aquí viven las tres cosas que deben existir en cualquier ruta: la cabecera,
 * el pie y el carrito. El `<Suspense>` rodea al `<Outlet/>` para que el
 * code-splitting por ruta tenga dónde caer mientras baja el chunk.
 */
export function AppLayout() {
    // Deja el foco en un sitio previsible al cargar la app.
    useEffect(() => {
        document.getElementById('contenido')?.setAttribute('tabindex', '-1');
    }, []);
    return (_jsxs("div", { className: s.shell, children: [_jsx("a", { className: "re-skip-link", href: "#contenido", children: "Saltar al contenido" }), _jsx(Header, {}), _jsx("main", { id: "contenido", className: s.main, children: _jsx(ErrorBoundary, { children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Outlet, {}) }) }) }), _jsx(Footer, {}), _jsx(CartDrawer, {}), _jsx(ScrollRestoration, {})] }));
}
//# sourceMappingURL=AppLayout.js.map