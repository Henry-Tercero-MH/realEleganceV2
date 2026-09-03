import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/PageLoader';
import { cx } from '@/lib/cx';
import s from './SidebarLayout.module.css';

export interface SidebarItem {
  to: string;
  label: string;
  icon: IconName;
  /** `true` cuando la ruta solo debe marcarse activa en coincidencia exacta. */
  end?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarLayoutProps {
  title: string;
  subtitle?: string;
  sections: SidebarSection[];
  /** Contenido extra al pie de la barra (avatar, cerrar sesión). */
  aside?: ReactNode;
  /** Nombre de la feature para el límite de error. */
  feature: string;
}

/**
 * Estructura de dos columnas para las áreas con navegación propia: la cuenta
 * del cliente y el back-office.
 *
 * En móvil la barra lateral se convierte en una tira horizontal deslizable
 * sobre el contenido, que es lo que funciona en una pantalla estrecha.
 */
export function SidebarLayout({ title, subtitle, sections, aside, feature }: SidebarLayoutProps) {
  return (
    <div className={cx('re-container', s.layout)}>
      <aside className={s.sidebar}>
        <div className={s.heading}>
          {/* Rótulo de sección ("Back-office"/"Mi cuenta"), no el título de la
              página: cada página hija ya pone su propio <h1> vía SectionHeading,
              y dos <h1> por vista rompía la navegación por encabezados. */}
          <p className={s.title}>{title}</p>
          {subtitle ? <p className={s.subtitle}>{subtitle}</p> : null}
        </div>

        <nav className={s.nav} aria-label={title}>
          {sections.map((section, index) => (
            <div key={section.title ?? index} className={s.section}>
              {section.title ? <p className={s.sectionTitle}>{section.title}</p> : null}
              <ul role="list" className={s.items}>
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) => cx(s.item, isActive && s.itemActive)}
                    >
                      <Icon name={item.icon} size={17} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {aside ? <div className={s.aside}>{aside}</div> : null}
      </aside>

      <div className={s.content}>
        <ErrorBoundary feature={feature}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
