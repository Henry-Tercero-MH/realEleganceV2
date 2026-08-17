import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';
/**
 * Límite de error **por feature**.
 *
 * Se envuelve cada área (catálogo, carrito, taller) por separado a propósito:
 * que reviente el tablero del taller no debe dejar en blanco la tienda entera.
 */
export class ErrorBoundary extends Component {
    state = { error: null };
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, info) {
        // En producción esto va al servicio de observabilidad.
        console.error(`[ErrorBoundary${this.props.feature ? `: ${this.props.feature}` : ''}]`, error, info);
    }
    reset = () => this.setState({ error: null });
    render() {
        if (!this.state.error)
            return this.props.children;
        if (this.props.fallback)
            return this.props.fallback;
        return (_jsx(EmptyState, { tone: "error", title: "Algo se descosi\u00F3 por aqu\u00ED", description: this.props.feature
                ? `No pudimos mostrar «${this.props.feature}». Puedes reintentar o seguir navegando por el resto del sitio.`
                : 'No pudimos mostrar esta sección. Puedes reintentar o seguir navegando.', action: _jsx(Button, { variant: "secondary", onClick: this.reset, children: "Reintentar" }) }));
    }
}
//# sourceMappingURL=ErrorBoundary.js.map