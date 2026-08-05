import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { PageLoader } from '@/components/PageLoader';
import { paths } from '@/routes/paths';
import s from './AuthLayout.module.css';

/**
 * Pantalla partida para entrar y crear cuenta.
 *
 * Sin cabecera ni carrito: en este momento solo hay una cosa que hacer, y el
 * panel izquierdo está para recordar dónde se está entrando.
 */
export function AuthLayout() {
  return (
    <div className={s.layout}>
      <aside className={s.brandPanel}>
        <Link to={paths.home} className={s.brandLink}>
          <Logo />
        </Link>

        <blockquote className={s.quote}>
          <p>
            «Un traje a medida no se compra: se encarga, se prueba y se espera. Lo demás es ropa.»
          </p>
          <footer>— Marta Quiñónez, maestra cortadora</footer>
        </blockquote>

        <ul role="list" className={s.points}>
          <li>Corte y confección artesanal en nuestro taller</li>
          <li>Seguimiento en línea de cada etapa de tu traje</li>
          <li>Pruebas y ajustes incluidos hasta que caiga bien</li>
        </ul>
      </aside>

      <main className={s.formPanel} id="contenido">
        <div className={s.formInner}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
