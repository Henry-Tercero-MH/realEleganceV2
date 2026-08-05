import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  /** Nombre de la feature, para el mensaje y el log. */
  feature?: string;
  /** Alternativa a medida; si no se pasa, se pinta el estado de error estándar. */
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Límite de error **por feature**.
 *
 * Se envuelve cada área (catálogo, carrito, taller) por separado a propósito:
 * que reviente el tablero del taller no debe dejar en blanco la tienda entera.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // En producción esto va al servicio de observabilidad.
    console.error(`[ErrorBoundary${this.props.feature ? `: ${this.props.feature}` : ''}]`, error, info);
  }

  private readonly reset = () => this.setState({ error: null });

  override render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <EmptyState
        tone="error"
        title="Algo se descosió por aquí"
        description={
          this.props.feature
            ? `No pudimos mostrar «${this.props.feature}». Puedes reintentar o seguir navegando por el resto del sitio.`
            : 'No pudimos mostrar esta sección. Puedes reintentar o seguir navegando.'
        }
        action={
          <Button variant="secondary" onClick={this.reset}>
            Reintentar
          </Button>
        }
      />
    );
  }
}
