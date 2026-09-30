import { lazy } from 'react';
import type { ReactElement } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AccountLayout } from '@/layouts/AccountLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SHOP_ENABLED } from '@/config/features';
import { RequireRole } from './RequireRole';
import { paths } from './paths';

/**
 * Fase solo informativa (`SHOP_ENABLED = false`, ver `config/features.ts`):
 * cualquier ruta de compra/cuenta/back-office redirige a inicio en vez de
 * renderizar la página real, aunque alguien escriba la URL a mano. El árbol
 * de rutas no cambia de forma — mismos paths, mismos `lazy()` — así que
 * reactivar la tienda es solo volver `SHOP_ENABLED` a `true`.
 */
const gate = (element: ReactElement) =>
  SHOP_ENABLED ? element : <Navigate to={paths.home} replace />;

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
    element: <AppLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },

      // ── Tienda ───────────────────────────────────────────────────────────
      { path: paths.catalog, element: <CatalogPage /> },
      { path: '/catalogo/:code', element: <SuitDetailPage /> },
      { path: '/catalogo/:code/personalizar', element: gate(<CustomizePage />) },
      { path: paths.fabrics, element: <FabricsPage /> },
      { path: paths.accessories, element: <AccessoriesPage /> },
      { path: paths.about, element: <AboutPage /> },

      // ── Compra ───────────────────────────────────────────────────────────
      { path: paths.cart, element: gate(<CartPage />) },
      { path: paths.checkout, element: gate(<CheckoutPage />) },
      { path: '/checkout/confirmado/:orderNumber', element: gate(<CheckoutSuccessPage />) },

      // ── Seguimiento ──────────────────────────────────────────────────────
      { path: paths.tracking, element: gate(<TrackingPage />) },
      { path: '/seguimiento/:orderNumber', element: gate(<TrackingPage />) },

      // ── Cuenta del cliente ───────────────────────────────────────────────
      {
        path: paths.account,
        element: gate(
          <RequireRole>
            <AccountLayout />
          </RequireRole>,
        ),
        children: [
          { index: true, element: <AccountOverviewPage /> },
          { path: 'pedidos', element: <OrdersPage /> },
          { path: 'pedidos/:orderNumber', element: <OrderDetailPage /> },
          { path: 'citas', element: <AppointmentsPage /> },
          { path: 'citas/agendar', element: <BookAppointmentPage /> },
          { path: 'medidas', element: <MeasurementsPage /> },
          { path: 'puntos', element: <MyLoyaltyPage /> },
        ],
      },

      // ── Back-office ──────────────────────────────────────────────────────
      {
        path: paths.admin,
        element: gate(
          <RequireRole roles={['admin', 'staff', 'tailor']}>
            <AdminLayout />
          </RequireRole>,
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'trajes', element: <AdminSuitsPage /> },
          { path: 'telas', element: <AdminFabricsPage /> },
          { path: 'accesorios', element: <AdminProductsPage /> },
          { path: 'cupones', element: <AdminCouponsPage /> },
          { path: 'clientes', element: <AdminCustomersPage /> },
          { path: 'clientes/:id', element: <AdminCustomerDetailPage /> },
          { path: 'taller', element: <AdminProductionPage /> },
          { path: 'pedidos', element: <AdminOrdersPage /> },
          { path: 'pedidos/nuevo', element: <AdminNewOrderPage /> },
          { path: 'pedidos/:orderNumber', element: <AdminOrderDetailPage /> },
          { path: 'citas', element: <AdminAppointmentsPage /> },
          { path: 'fidelizacion', element: <AdminLoyaltyPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Sesión ─────────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: paths.login, element: gate(<LoginPage />) },
      { path: paths.register, element: gate(<RegisterPage />) },
      // Alias en inglés por si alguien llega con un enlace antiguo.
      { path: '/login', element: <Navigate to={paths.login} replace /> },
    ],
  },
]);
