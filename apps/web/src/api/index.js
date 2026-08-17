/**
 * Punto único por el que la app habla con «el servidor».
 *
 * Ninguna feature importa `mock.ts` ni `http.ts` directamente: todas usan `api`.
 * Cuando `apps/api` esté en pie, aquí se escribe la implementación real sobre
 * `http` y se cambia esta constante — las páginas y los hooks no se tocan.
 */
import { mockApi } from './mock';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
if (!USE_MOCKS && import.meta.env.DEV) {
    // Aviso deliberado: durante la fase de diseño no hay implementación HTTP.
    console.warn('[api] VITE_USE_MOCKS=false pero el backend aún no está implementado. Se seguirán usando los mocks.');
}
export const api = mockApi;
export { ApiError, http } from './http';
export { DEMO_CREDENTIALS } from './mock';
/** Claves de React Query, centralizadas para invalidar sin adivinar cadenas. */
export const queryKeys = {
    styles: ['catalog', 'styles'],
    suits: (filters) => ['catalog', 'suits', filters ?? {}],
    suit: (code) => ['catalog', 'suit', code],
    fabricCategories: ['catalog', 'fabric-categories'],
    fabrics: (filters) => ['catalog', 'fabrics', filters ?? {}],
    optionGroups: ['catalog', 'option-groups'],
    productCategories: ['catalog', 'product-categories'],
    products: (filters) => ['catalog', 'products', filters ?? {}],
    product: (sku) => ['catalog', 'product', sku],
    myOrders: (customerId) => ['orders', 'mine', customerId],
    order: (orderNumber) => ['orders', orderNumber],
    tracking: (orderNumber) => ['orders', orderNumber, 'tracking'],
    myAppointments: (customerId) => ['appointments', 'mine', customerId],
    staff: ['appointments', 'staff'],
    availability: (date, staffId) => ['appointments', 'availability', date, staffId],
    myMeasurements: (customerId) => ['measurements', 'mine', customerId],
    measurementTypes: ['measurements', 'types'],
    loyaltySettings: ['loyalty', 'settings'],
    myLoyalty: (customerId) => ['loyalty', 'mine', customerId],
    myLoyaltyMovements: (customerId) => ['loyalty', 'mine', customerId, 'movements'],
    adminLoyaltyAccounts: ['admin', 'loyalty', 'accounts'],
    adminCustomers: (filters) => ['admin', 'customers', filters ?? {}],
    adminCustomer: (id) => ['admin', 'customers', id],
    adminStats: ['admin', 'stats'],
    adminSuits: ['admin', 'suits'],
    adminFabrics: ['admin', 'fabrics'],
    adminProducts: ['admin', 'products'],
    adminCoupons: ['admin', 'coupons'],
    adminOrders: ['admin', 'orders'],
    adminOrder: (orderNumber) => ['admin', 'orders', orderNumber],
    adminAppointments: ['admin', 'appointments'],
    productionBoard: ['admin', 'production-board'],
    tailorWorkload: ['admin', 'tailor-workload'],
};
//# sourceMappingURL=index.js.map