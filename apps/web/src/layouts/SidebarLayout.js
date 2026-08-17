import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from '@/components/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/PageLoader';
import { cx } from '@/lib/cx';
import s from './SidebarLayout.module.css';
/**
 * Estructura de dos columnas para las áreas con navegación propia: la cuenta
 * del cliente y el back-office.
 *
 * En móvil la barra lateral se convierte en una tira horizontal deslizable
 * sobre el contenido, que es lo que funciona en una pantalla estrecha.
 */
export function SidebarLayout({ title, subtitle, sections, aside, feature }) {
    return (_jsxs("div", { className: cx('re-container', s.layout), children: [_jsxs("aside", { className: s.sidebar, children: [_jsxs("div", { className: s.heading, children: [_jsx("h1", { className: s.title, children: title }), subtitle ? _jsx("p", { className: s.subtitle, children: subtitle }) : null] }), _jsx("nav", { className: s.nav, "aria-label": title, children: sections.map((section, index) => (_jsxs("div", { className: s.section, children: [section.title ? _jsx("p", { className: s.sectionTitle, children: section.title }) : null, _jsx("ul", { role: "list", className: s.items, children: section.items.map((item) => (_jsx("li", { children: _jsxs(NavLink, { to: item.to, end: item.end, className: ({ isActive }) => cx(s.item, isActive && s.itemActive), children: [_jsx(Icon, { name: item.icon, size: 17 }), _jsx("span", { children: item.label })] }) }, item.to))) })] }, section.title ?? index))) }), aside ? _jsx("div", { className: s.aside, children: aside }) : null] }), _jsx("div", { className: s.content, children: _jsx(ErrorBoundary, { feature: feature, children: _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsx(Outlet, {}) }) }) })] }));
}
//# sourceMappingURL=SidebarLayout.js.map