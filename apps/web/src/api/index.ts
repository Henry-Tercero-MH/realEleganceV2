/**
 * Punto único por el que la app habla con «el servidor».
 *
 * Ninguna feature importa `mock.ts` ni `http.ts` directamente: todas usan `api`.
 * Cuando `apps/api` esté en pie, aquí se escribe la implementación real sobre
 * `http` y se cambia esta constante — las páginas y los hooks no se tocan.
 */
import { mockApi } from './mock';
import type { Api } from './mock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

if (!USE_MOCKS && import.meta.env.DEV) {
  // Aviso deliberado: durante la fase de diseño no hay implementación HTTP.
  console.warn(
    '[api] VITE_USE_MOCKS=false pero el backend aún no está implementado. Se seguirán usando los mocks.',
  );
}

export const api: Api = mockApi;

export { ApiError, http } from './http';
export { DEMO_CREDENTIALS } from './mock';
export type { Api } from './mock';
export type { SuitFilters } from './mock';

/** Claves de React Query, centralizadas para invalidar sin adivinar cadenas. */
export const queryKeys = {
  styles: ['catalog', 'styles'] as const,
  suits: (filters?: unknown) => ['catalog', 'suits', filters ?? {}] as const,
  suit: (code: string) => ['catalog', 'suit', code] as const,
  fabricCategories: ['catalog', 'fabric-categories'] as const,
  fabrics: (filters?: unknown) => ['catalog', 'fabrics', filters ?? {}] as const,
  optionGroups: ['catalog', 'option-groups'] as const,
  productCategories: ['catalog', 'product-categories'] as const,
  products: (filters?: unknown) => ['catalog', 'products', filters ?? {}] as const,
  product: (sku: string) => ['catalog', 'product', sku] as const,

  myOrders: (customerId: number) => ['orders', 'mine', customerId] as const,
  order: (orderNumber: string) => ['orders', orderNumber] as const,
  tracking: (orderNumber: string) => ['orders', orderNumber, 'tracking'] as const,

  myAppointments: (customerId: number) => ['appointments', 'mine', customerId] as const,
  staff: ['appointments', 'staff'] as const,
  availability: (date: string, staffId: number | null) =>
    ['appointments', 'availability', date, staffId] as const,

  myMeasurements: (customerId: number) => ['measurements', 'mine', customerId] as const,
  measurementTypes: ['measurements', 'types'] as const,

  loyaltySettings: ['loyalty', 'settings'] as const,
  myLoyalty: (customerId: number) => ['loyalty', 'mine', customerId] as const,
  myLoyaltyMovements: (customerId: number) => ['loyalty', 'mine', customerId, 'movements'] as const,
  adminLoyaltyAccounts: ['admin', 'loyalty', 'accounts'] as const,

  adminCustomers: (filters?: unknown) => ['admin', 'customers', filters ?? {}] as const,
  adminCustomer: (id: number) => ['admin', 'customers', id] as const,

  adminStats: ['admin', 'stats'] as const,
  adminSuits: ['admin', 'suits'] as const,
  adminFabrics: ['admin', 'fabrics'] as const,
  adminProducts: ['admin', 'products'] as const,
  adminCoupons: ['admin', 'coupons'] as const,
  adminOrders: ['admin', 'orders'] as const,
  adminOrder: (orderNumber: string) => ['admin', 'orders', orderNumber] as const,
  adminAppointments: ['admin', 'appointments'] as const,
  productionBoard: ['admin', 'production-board'] as const,
  tailorWorkload: ['admin', 'tailor-workload'] as const,
};
