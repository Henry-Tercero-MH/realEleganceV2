import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon, IconButton, ButtonLink, Button } from '@/components/ui';
import { Logo } from '@/components/Logo';
import { paths } from '@/routes/paths';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cx } from '@/lib/cx';
import s from './Header.module.css';

const MOBILE_NAV_ID = 'site-nav';

const NAV_LINKS = [
  { to: paths.catalog, label: 'Trajes' },
  { to: paths.fabrics, label: 'Telas' },
  { to: paths.accessories, label: 'Accesorios' },
  { to: paths.tracking, label: 'Seguimiento' },
  { to: paths.about, label: 'El taller' },
];

export function Header() {
  const { isAuthenticated, user, hasRole, logout } = useAuth();
  const { totals, openDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Mismo punto de corte que `.menuToggle`/`.nav` en Header.module.css: por
  // debajo de 960px el <nav> pasa a ser el menú desplegable, y solo ahí tiene
  // sentido atraparle el foco (en escritorio son enlaces normales en fila).
  const isMobileNav = useMediaQuery('(max-width: 960px)');
  const menuTrapActive = isMenuOpen && isMobileNav;

  useFocusTrap(navRef, menuTrapActive);

  // Al navegar, el menú móvil debe cerrarse solo.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuTrapActive) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuTrapActive]);

  // La cabecera gana fondo y filete al despegarse del hero.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cx(s.header, isScrolled && s.scrolled)}>
      <div className={cx('re-container', s.inner)}>
        <Link to={paths.home} className={s.brand} aria-label="Real Elegance — inicio">
          <Logo />
        </Link>

        <nav
          ref={navRef}
          id={MOBILE_NAV_ID}
          className={cx(s.nav, isMenuOpen && s.navOpen)}
          aria-label="Navegación principal"
          // Respaldo de useFocusTrap cuando aún no hay ningún enlace enfocable
          // a tiempo (mismo patrón que el panel de Modal.tsx): sin esto,
          // container.focus() no hace nada porque un <nav> no es enfocable.
          tabIndex={-1}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cx(s.navLink, isActive && s.navLinkActive)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* En móvil el menú también contiene las acciones de cuenta. */}
          <div className={s.navFooter}>
            {isAuthenticated ? (
              <>
                <NavLink to={paths.account} className={s.navLink}>
                  Mi cuenta
                </NavLink>
                {hasRole('admin', 'staff', 'tailor') ? (
                  <NavLink to={paths.admin} className={s.navLink}>
                    Back-office
                  </NavLink>
                ) : null}
                <Button variant="link" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <NavLink to={paths.login} className={s.navLink}>
                  Entrar
                </NavLink>
                <ButtonLink to={paths.register} variant="primary" size="md">
                  Crear cuenta
                </ButtonLink>
              </>
            )}
          </div>
        </nav>

        <div className={s.actions}>
          <IconButton
            label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            icon={<Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />}
            onClick={toggleTheme}
          />

          {/* Navega, luego es un enlace — no un botón con `onClick`. */}
          {isAuthenticated ? (
            <Link
              to={paths.account}
              className={cx(s.iconLink, s.desktopOnly)}
              aria-label={`Mi cuenta — ${user?.firstName ?? ''}`}
              title="Mi cuenta"
            >
              <Icon name="user" size={19} />
            </Link>
          ) : null}

          <IconButton
            label={`Carrito — ${totals.itemCount} ${totals.itemCount === 1 ? 'artículo' : 'artículos'}`}
            icon={<Icon name="cart" size={19} />}
            badge={totals.itemCount}
            onClick={openDrawer}
          />

          <IconButton
            label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            icon={<Icon name={isMenuOpen ? 'close' : 'menu'} size={20} />}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls={MOBILE_NAV_ID}
            className={s.menuToggle}
          />
        </div>
      </div>
    </header>
  );
}
