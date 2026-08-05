/**
 * Catálogos cerrados del dominio.
 *
 * Estos códigos son el contrato entre la base de datos (tablas *lookup*), la API
 * y la UI. Las tablas lookup guardan el `code`; aquí vive su tipado y su
 * etiqueta en español para presentación.
 */

// ── Roles / RBAC ───────────────────────────────────────────────────────────

export const ROLES = ['admin', 'tailor', 'staff', 'customer'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  tailor: 'Sastre',
  staff: 'Personal',
  customer: 'Cliente',
};

/** Roles con acceso al back-office `/admin` (el sastre solo ve el taller). */
export const BACKOFFICE_ROLES: readonly Role[] = ['admin', 'staff', 'tailor'];

// ── Estados del pedido ─────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  'pending_deposit',
  'confirmed',
  'in_production',
  'fitting',
  'ready',
  'delivered',
  'cancelled',
] as const;
export type OrderStatusCode = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatusCode, string> = {
  pending_deposit: 'Pendiente de anticipo',
  confirmed: 'Confirmado',
  in_production: 'En confección',
  fitting: 'Prueba y ajustes',
  ready: 'Listo para entrega',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

/** Estados terminales: el pedido ya no se considera "abierto" en el taller. */
export const CLOSED_ORDER_STATUSES: readonly OrderStatusCode[] = ['delivered', 'cancelled'];

// ── Etapas de producción ───────────────────────────────────────────────────

export const PRODUCTION_STAGES = ['corte', 'confeccion', 'prueba', 'ajustes', 'entrega'] as const;
export type ProductionStageCode = (typeof PRODUCTION_STAGES)[number];

export const PRODUCTION_STAGE_LABELS: Record<ProductionStageCode, string> = {
  corte: 'Corte',
  confeccion: 'Confección',
  prueba: 'Prueba',
  ajustes: 'Ajustes',
  entrega: 'Entrega',
};

// ── Citas ──────────────────────────────────────────────────────────────────

export const APPOINTMENT_TYPES = ['medidas', 'prueba', 'consulta', 'entrega'] as const;
export type AppointmentTypeCode = (typeof APPOINTMENT_TYPES)[number];

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentTypeCode, string> = {
  medidas: 'Toma de medidas',
  prueba: 'Prueba de traje',
  consulta: 'Consulta y asesoría',
  entrega: 'Entrega',
};

export const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled', 'no_show'] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Agendada',
  completed: 'Atendida',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

// ── Carrito y comercio ─────────────────────────────────────────────────────

export const CART_ITEM_TYPES = ['made_to_measure', 'ready_to_wear'] as const;
export type CartItemType = (typeof CART_ITEM_TYPES)[number];

export const CART_ITEM_TYPE_LABELS: Record<CartItemType, string> = {
  made_to_measure: 'A medida',
  ready_to_wear: 'Listo para llevar',
};

export const CART_STATUSES = ['active', 'converted', 'abandoned'] as const;
export type CartStatus = (typeof CART_STATUSES)[number];

export const COUPON_TYPES = ['percent', 'fixed'] as const;
export type CouponType = (typeof COUPON_TYPES)[number];

export const QUOTE_STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired'] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  expired: 'Vencida',
};

// ── Pagos y entregas ───────────────────────────────────────────────────────

export const PAYMENT_TYPES = ['anticipo', 'saldo'] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  anticipo: 'Anticipo',
  saldo: 'Saldo',
};

export const DELIVERY_STATUSES = ['pending', 'scheduled', 'delivered', 'cancelled'] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

// ── Medios ─────────────────────────────────────────────────────────────────

export const MEDIA_VARIANTS = ['thumbnail', 'card', 'full'] as const;
export type MediaVariant = (typeof MEDIA_VARIANTS)[number];

/** Ancho en píxeles de cada variante generada por `sharp`. */
export const MEDIA_VARIANT_WIDTHS: Record<MediaVariant, number> = {
  thumbnail: 400,
  card: 800,
  full: 1600,
};

export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

// ── Códigos de error de la API ─────────────────────────────────────────────

export const API_ERROR_CODES = [
  'VALIDATION_ERROR',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'BUSINESS_RULE',
  'RATE_LIMITED',
  'PAYLOAD_TOO_LARGE',
  'INTERNAL_ERROR',
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

// ── Misceláneos ────────────────────────────────────────────────────────────

/** Moneda del negocio (quetzal guatemalteco). */
export const CURRENCY = 'GTQ' as const;

/** Cabecera con la que un invitado identifica su carrito. */
export const CART_SESSION_HEADER = 'x-cart-session';
