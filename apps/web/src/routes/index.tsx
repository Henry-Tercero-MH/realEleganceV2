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

// Sesión
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// Back-office
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminSuitsPage = lazy(() => import('@/pages/admin/AdminSuitsPage'));
const AdminFabricsPage = lazy(() => import('@/pages/admin/AdminFabricsPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCouponsPage = lazy(() => import('@/pages/admin/AdminCouponsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminAppointmentsPage = lazy(() => import('@/pages/admin/AdminAppointmentsPage'));
const AdminProductionPage = lazy(() => import('@/pages/admin/AdminProductionPage'));

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },

      // ── Tienda ───────────────────────────────────────────────────────────
      { path: paths.catalog, element: <CatalogPage /> },
      { path: '/catalogo/:code', element: <SuitDetailPage /> },
      { path: '/catalogo/:code/personalizar', element: <CustomizePage /> },
      { path: paths.fabrics, element: <FabricsPage /> },
      { path: paths.accessories, element: <AccessoriesPage /> },
      { path: paths.about, element: <AboutPage /> },

      // ── Compra ───────────────────────────────────────────────────────────
      { path: paths.cart, element: <CartPage /> },
      { path: paths.checkout, element: <CheckoutPage /> },
      { path: '/checkout/confirmado/:orderNumber', element: <CheckoutSuccessPage /> },

      // ── Seguimiento ──────────────────────────────────────────────────────
      { path: paths.tracking, element: <TrackingPage /> },
      { path: '/seguimiento/:orderNumber', element: <TrackingPage /> },

      // ── Cuenta del cliente ───────────────────────────────────────────────
      {
        path: paths.account,
        element: (
          <RequireRole>
            <AccountLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <AccountOverviewPage /> },
          { path: 'pedidos', element: <OrdersPage /> },
          { path: 'pedidos/:orderNumber', element: <OrderDetailPage /> },
          { path: 'citas', element: <AppointmentsPage /> },
          { path: 'citas/agendar', element: <BookAppointmentPage /> },
          { path: 'medidas', element: <MeasurementsPage /> },
        ],
      },

      // ── Back-office ──────────────────────────────────────────────────────
      {
        path: paths.admin,
        element: (
          <RequireRole roles={['admin', 'staff', 'tailor']}>
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'trajes', element: <AdminSuitsPage /> },
          { path: 'telas', element: <AdminFabricsPage /> },
          { path: 'accesorios', element: <AdminProductsPage /> },
          { path: 'cupones', element: <AdminCouponsPage /> },
          { path: 'taller', element: <AdminProductionPage /> },
          { path: 'pedidos', element: <AdminOrdersPage /> },
          { path: 'citas', element: <AdminAppointmentsPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Sesión ─────────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: paths.login, element: <LoginPage /> },
      { path: paths.register, element: <RegisterPage /> },
      // Alias en inglés por si alguien llega con un enlace antiguo.
      { path: '/login', element: <Navigate to={paths.login} replace /> },
    ],
  },
]);
