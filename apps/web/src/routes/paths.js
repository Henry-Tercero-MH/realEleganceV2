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
    suit: (code) => `/catalogo/${code}`,
    customize: (code) => `/catalogo/${code}/personalizar`,
    fabrics: '/telas',
    accessories: '/accesorios',
    accessory: (sku) => `/accesorios/${sku}`,
    // Compra
    cart: '/carrito',
    checkout: '/checkout',
    checkoutSuccess: (orderNumber) => `/checkout/confirmado/${orderNumber}`,
    // Cliente
    account: '/mi-cuenta',
    orders: '/mi-cuenta/pedidos',
    order: (orderNumber) => `/mi-cuenta/pedidos/${orderNumber}`,
    appointments: '/mi-cuenta/citas',
    bookAppointment: '/mi-cuenta/citas/agendar',
    measurements: '/mi-cuenta/medidas',
    myLoyalty: '/mi-cuenta/puntos',
    // Público sin sesión
    tracking: '/seguimiento',
    trackingFor: (orderNumber) => `/seguimiento/${orderNumber}`,
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
    adminCustomer: (id) => `/admin/clientes/${id}`,
    adminOrders: '/admin/pedidos',
    adminNewOrder: '/admin/pedidos/nuevo',
    adminOrder: (orderNumber) => `/admin/pedidos/${orderNumber}`,
    adminAppointments: '/admin/citas',
    adminProduction: '/admin/taller',
    adminLoyalty: '/admin/fidelizacion',
};
//# sourceMappingURL=paths.js.map