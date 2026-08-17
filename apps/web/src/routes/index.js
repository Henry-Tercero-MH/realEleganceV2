import { jsx as _jsx } from "react/jsx-runtime";
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AccountLayout } from '@/layouts/AccountLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { RequireRole } from './RequireRole';
import { paths } from './paths';
/*
 * Cada página se carga por separado (`lazy`) para que la primera visita solo
 * baje la portada. El `<Suspense>` que las recibe está en cada layout.
 */
// Tienda
const HomePage = lazy(() => import('@/pages/HomePage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const SuitDetailPage = lazy(() => import('@/pages/SuitDetailPage'));
const CustomizePage = lazy(() => import('@/pages/CustomizePage'));
const FabricsPage = lazy(() => import('@/pages/FabricsPage'));
const AccessoriesPage = lazy(() => import('@/pages/AccessoriesPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
// Compra
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('@/pages/CheckoutSuccessPage'));
// Seguimiento (público: basta el número de pedido)
const TrackingPage = lazy(() => import('@/pages/TrackingPage'));
// Cuenta
const AccountOverviewPage = lazy(() => import('@/pages/account/AccountOverviewPage'));
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'));
const AppointmentsPage = lazy(() => import('@/pages/account/AppointmentsPage'));
const BookAppointmentPage = lazy(() => import('@/pages/account/BookAppointmentPage'));
const MeasurementsPage = lazy(() => import('@/pages/account/MeasurementsPage'));
const MyLoyaltyPage = lazy(() => import('@/pages/account/MyLoyaltyPage'));
// Sesión
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
// Back-office
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminSuitsPage = lazy(() => import('@/pages/admin/AdminSuitsPage'));
const AdminFabricsPage = lazy(() => import('@/pages/admin/AdminFabricsPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCouponsPage = lazy(() => import('@/pages/admin/AdminCouponsPage'));
const AdminCustomersPage = lazy(() => import('@/pages/admin/AdminCustomersPage'));
const AdminCustomerDetailPage = lazy(() => import('@/pages/admin/AdminCustomerDetailPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminNewOrderPage = lazy(() => import('@/pages/admin/AdminNewOrderPage'));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin/AdminOrderDetailPage'));
const AdminAppointmentsPage = lazy(() => import('@/pages/admin/AdminAppointmentsPage'));
const AdminProductionPage = lazy(() => import('@/pages/admin/AdminProductionPage'));
const AdminLoyaltyPage = lazy(() => import('@/pages/admin/AdminLoyaltyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
export const router = createBrowserRouter([
    {
        element: _jsx(AppLayout, {}),
        children: [
            { path: paths.home, element: _jsx(HomePage, {}) },
            // ── Tienda ───────────────────────────────────────────────────────────
            { path: paths.catalog, element: _jsx(CatalogPage, {}) },
            { path: '/catalogo/:code', element: _jsx(SuitDetailPage, {}) },
            { path: '/catalogo/:code/personalizar', element: _jsx(CustomizePage, {}) },
            { path: paths.fabrics, element: _jsx(FabricsPage, {}) },
            { path: paths.accessories, element: _jsx(AccessoriesPage, {}) },
            { path: paths.about, element: _jsx(AboutPage, {}) },
            // ── Compra ───────────────────────────────────────────────────────────
            { path: paths.cart, element: _jsx(CartPage, {}) },
            { path: paths.checkout, element: _jsx(CheckoutPage, {}) },
            { path: '/checkout/confirmado/:orderNumber', element: _jsx(CheckoutSuccessPage, {}) },
            // ── Seguimiento ──────────────────────────────────────────────────────
            { path: paths.tracking, element: _jsx(TrackingPage, {}) },
            { path: '/seguimiento/:orderNumber', element: _jsx(TrackingPage, {}) },
            // ── Cuenta del cliente ───────────────────────────────────────────────
            {
                path: paths.account,
                element: (_jsx(RequireRole, { children: _jsx(AccountLayout, {}) })),
                children: [
                    { index: true, element: _jsx(AccountOverviewPage, {}) },
                    { path: 'pedidos', element: _jsx(OrdersPage, {}) },
                    { path: 'pedidos/:orderNumber', element: _jsx(OrderDetailPage, {}) },
                    { path: 'citas', element: _jsx(AppointmentsPage, {}) },
                    { path: 'citas/agendar', element: _jsx(BookAppointmentPage, {}) },
                    { path: 'medidas', element: _jsx(MeasurementsPage, {}) },
                    { path: 'puntos', element: _jsx(MyLoyaltyPage, {}) },
                ],
            },
            // ── Back-office ──────────────────────────────────────────────────────
            {
                path: paths.admin,
                element: (_jsx(RequireRole, { roles: ['admin', 'staff', 'tailor'], children: _jsx(AdminLayout, {}) })),
                children: [
                    { index: true, element: _jsx(AdminDashboardPage, {}) },
                    { path: 'trajes', element: _jsx(AdminSuitsPage, {}) },
                    { path: 'telas', element: _jsx(AdminFabricsPage, {}) },
                    { path: 'accesorios', element: _jsx(AdminProductsPage, {}) },
                    { path: 'cupones', element: _jsx(AdminCouponsPage, {}) },
                    { path: 'clientes', element: _jsx(AdminCustomersPage, {}) },
                    { path: 'clientes/:id', element: _jsx(AdminCustomerDetailPage, {}) },
                    { path: 'taller', element: _jsx(AdminProductionPage, {}) },
                    { path: 'pedidos', element: _jsx(AdminOrdersPage, {}) },
                    { path: 'pedidos/nuevo', element: _jsx(AdminNewOrderPage, {}) },
                    { path: 'pedidos/:orderNumber', element: _jsx(AdminOrderDetailPage, {}) },
                    { path: 'citas', element: _jsx(AdminAppointmentsPage, {}) },
                    { path: 'fidelizacion', element: _jsx(AdminLoyaltyPage, {}) },
                ],
            },
            { path: '*', element: _jsx(NotFoundPage, {}) },
        ],
    },
    // ── Sesión ─────────────────────────────────────────────────────────────
    {
        element: _jsx(AuthLayout, {}),
        children: [
            { path: paths.login, element: _jsx(LoginPage, {}) },
            { path: paths.register, element: _jsx(RegisterPage, {}) },
            // Alias en inglés por si alguien llega con un enlace antiguo.
            { path: '/login', element: _jsx(Navigate, { to: paths.login, replace: true }) },
        ],
    },
]);
//# sourceMappingURL=index.js.map