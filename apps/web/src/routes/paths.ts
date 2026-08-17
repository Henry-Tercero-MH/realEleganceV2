/**
 * Rutas de la aplicación en un solo sitio.
 *
 * Nunca se escribe una URL a mano en un componente: si mañana `/catalogo` pasa
 * a `/trajes`, se cambia aquí y el compilador señala todo lo que hay que tocar.
 */
export const paths = {
  home: '/',

  // Tienda
  catalog: '/catalogo',
  suit: (code: string) => `/catalogo/${code}`,
  customize: (code: string) => `/catalogo/${code}/personalizar`,
  fabrics: '/telas',
  accessories: '/accesorios',
  accessory: (sku: string) => `/accesorios/${sku}`,

  // Compra
  cart: '/carrito',
  checkout: '/checkout',
  checkoutSuccess: (orderNumber: string) => `/checkout/confirmado/${orderNumber}`,

  // Cliente
  account: '/mi-cuenta',
  orders: '/mi-cuenta/pedidos',
  order: (orderNumber: string) => `/mi-cuenta/pedidos/${orderNumber}`,
  appointments: '/mi-cuenta/citas',
  bookAppointment: '/mi-cuenta/citas/agendar',
  measurements: '/mi-cuenta/medidas',
  myLoyalty: '/mi-cuenta/puntos',

  // Público sin sesión
  tracking: '/seguimiento',
  trackingFor: (orderNumber: string) => `/seguimiento/${orderNumber}`,
  about: '/el-taller',

  // Sesión
  login: '/entrar',
  register: '/crear-cuenta',

  // Back-office
  admin: '/admin',
  adminSuits: '/admin/trajes',
  adminFabrics: '/admin/telas',
  adminProducts: '/admin/accesorios',
  adminCoupons: '/admin/cupones',
  adminCustomers: '/admin/clientes',
  adminCustomer: (id: number | string) => `/admin/clientes/${id}`,
  adminOrders: '/admin/pedidos',
  adminNewOrder: '/admin/pedidos/nuevo',
  adminOrder: (orderNumber: string) => `/admin/pedidos/${orderNumber}`,
  adminAppointments: '/admin/citas',
  adminProduction: '/admin/taller',
  adminLoyalty: '/admin/fidelizacion',
} as const;
