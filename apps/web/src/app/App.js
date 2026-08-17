import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './queryClient';
import { router } from '@/routes';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
/**
 * Composición de proveedores.
 *
 * El orden no es casual: el tema pinta, los avisos son transversales a todo, la
 * sesión decide qué se ve y el carrito depende de la sesión (al iniciarla se
 * fusiona con el del servidor).
 */
export function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(ThemeProvider, { children: _jsx(ToastProvider, { children: _jsx(AuthProvider, { children: _jsx(CartProvider, { children: _jsx(RouterProvider, { router: router }) }) }) }) }) }) }));
}
//# sourceMappingURL=App.js.map