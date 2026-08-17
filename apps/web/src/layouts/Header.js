import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon, IconButton, ButtonLink, Button } from '@/components/ui';
import { Logo } from '@/components/Logo';
import { paths } from '@/routes/paths';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { cx } from '@/lib/cx';
import s from './Header.module.css';
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
    // Al navegar, el menú móvil debe cerrarse solo.
    useEffect(() => setMenuOpen(false), [location.pathname]);
    // La cabecera gana fondo y filete al despegarse del hero.
    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 12);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (_jsx("header", { className: cx(s.header, isScrolled && s.scrolled), children: _jsxs("div", { className: cx('re-container', s.inner), children: [_jsx(Link, { to: paths.home, className: s.brand, "aria-label": "Real Elegance \u2014 inicio", children: _jsx(Logo, {}) }), _jsxs("nav", { className: cx(s.nav, isMenuOpen && s.navOpen), "aria-label": "Navegaci\u00F3n principal", children: [NAV_LINKS.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => cx(s.navLink, isActive && s.navLinkActive), children: link.label }, link.to))), _jsx("div", { className: s.navFooter, children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: paths.account, className: s.navLink, children: "Mi cuenta" }), hasRole('admin', 'staff', 'tailor') ? (_jsx(NavLink, { to: paths.admin, className: s.navLink, children: "Back-office" })) : null, _jsx(Button, { variant: "link", onClick: logout, children: "Cerrar sesi\u00F3n" })] })) : (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: paths.login, className: s.navLink, children: "Entrar" }), _jsx(ButtonLink, { to: paths.register, variant: "primary", size: "sm", children: "Crear cuenta" })] })) })] }), _jsxs("div", { className: s.actions, children: [_jsx(IconButton, { label: theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro', icon: _jsx(Icon, { name: theme === 'dark' ? 'sun' : 'moon', size: 19 }), onClick: toggleTheme }), isAuthenticated ? (_jsx(Link, { to: paths.account, className: cx(s.iconLink, s.desktopOnly), "aria-label": `Mi cuenta — ${user?.firstName ?? ''}`, title: "Mi cuenta", children: _jsx(Icon, { name: "user", size: 19 }) })) : null, _jsx(IconButton, { label: `Carrito — ${totals.itemCount} ${totals.itemCount === 1 ? 'artículo' : 'artículos'}`, icon: _jsx(Icon, { name: "cart", size: 19 }), badge: totals.itemCount, onClick: openDrawer }), _jsx(IconButton, { label: isMenuOpen ? 'Cerrar menú' : 'Abrir menú', icon: _jsx(Icon, { name: isMenuOpen ? 'close' : 'menu', size: 20 }), onClick: () => setMenuOpen((open) => !open), "aria-expanded": isMenuOpen, className: s.menuToggle })] })] }) }));
}
//# sourceMappingURL=Header.js.map