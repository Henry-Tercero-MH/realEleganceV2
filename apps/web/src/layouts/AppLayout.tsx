import { Suspense, useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/PageLoader';
import { FloatingSocial } from '@/components/FloatingSocial';
import { OfflineScreen } from '@/components/OfflineScreen';
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

  return (
    <div className={s.shell}>
      <OfflineScreen />

      <a className="re-skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <Header />

      <main id="contenido" className={s.main}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <CartDrawer />
      <FloatingSocial />

      {/* Devuelve el scroll arriba al navegar, y lo restaura al volver atrás. */}
      <ScrollRestoration />
    </div>
  );
}
