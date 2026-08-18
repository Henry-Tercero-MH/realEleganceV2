/**
 * DTOs de la API. Son la forma *de salida* (lo que el backend serializa y el
 * frontend consume), no el reflejo literal de las filas de la base de datos.
 */
import type {
  AppointmentStatus,
  AppointmentTypeCode,
  ApiErrorCode,
  CartItemType,
  CartStatus,
  CouponType,
  DeliveryStatus,
  MediaVariant,
  OrderStatusCode,
  PaymentType,
  ProductionStageCode,
  QuoteStatus,
  Role,
} from './constants';

// ── Envoltura de respuestas ────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    /** Detalle por campo cuando el error viene de una validación Zod. */
    details?: Array<{ path: string; message: string }>;
  };
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ── Identidad ──────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  isActive: boolean;
  customerId: number | null;
  staffId: number | null;
  firstName: string | null;
  lastName: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}

/** Contenido del JWT de acceso. */
export interface AccessTokenPayload {
  sub: number;
  email: string;
  role: Role;
  customerId: number | null;
  staffId: number | null;
}

export interface Address {
  id: number;
  customerId: number;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
}

export interface StaffMember {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string | null;
  isAvailable: boolean;
  hireDate: string | null;
}

export interface Customer {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

// ── Medios ─────────────────────────────────────────────────────────────────

export interface MediaAsset {
  id: number;
  storageKey: string;
  url: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  variant: MediaVariant;
  /** Variantes hermanas (mismo original, distinto ancho) para construir `srcset`. */
  variants: Array<{ variant: MediaVariant; url: string; width: number | null }>;
  uploadedBy: number | null;
  createdAt: string;
}

export interface GalleryImage {
  id: number;
  mediaAssetId: number;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  variants: Array<{ variant: MediaVariant; url: string; width: number | null }>;
}

// ── Catálogo ───────────────────────────────────────────────────────────────

export interface SuitStyle {
  id: number;
  name: string;
  slug: string;
}

export interface SuitModel {
  id: number;
  styleId: number;
  styleName: string;
  code: string;
  name: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
  sortOrder: number;
  images: GalleryImage[];
  primaryImage: GalleryImage | null;
}

export interface FabricCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Fabric {
  id: number;
  categoryId: number;
  categoryName: string;
  code: string;
  name: string;
  composition: string | null;
  colorHex: string | null;
  pricePerMeter: number;
  stockMeters: number;
  isActive: boolean;
  images: GalleryImage[];
  primaryImage: GalleryImage | null;
}

export interface OptionValue {
  id: number;
  optionGroupId: number;
  name: string;
  description: string | null;
  priceDelta: number;
  sortOrder: number;
  isActive: boolean;
}

export interface OptionGroup {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isRequired: boolean;
  sortOrder: number;
  values: OptionValue[];
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  categoryId: number;
  categoryName: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  images: GalleryImage[];
  primaryImage: GalleryImage | null;
}

// ── Medidas ────────────────────────────────────────────────────────────────

export interface MeasurementType {
  id: number;
  code: string;
  name: string;
  unit: string;
  sortOrder: number;
}

export interface MeasurementValue {
  id: number;
  measurementTypeId: number;
  code: string;
  name: string;
  unit: string;
  valueCm: number;
}

export interface MeasurementSet {
  id: number;
  customerId: number;
  takenBy: number | null;
  takenByName: string | null;
  takenAt: string;
  note: string | null;
  values: MeasurementValue[];
}

// ── Clientela (CRM del taller) ─────────────────────────────────────────────

/** Nota libre de mostrador: preferencias, alergias, quién lo refirió. */
export interface CustomerNote {
  id: number;
  customerId: number;
  authorId: number | null;
  authorName: string | null;
  note: string;
  createdAt: string;
}

/** Fila de la lista `/admin/clientes`: el cliente más lo que resume su relación con el taller. */
export interface CustomerListItem extends Customer {
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
  pointsBalance: number;
}

/** Ficha completa de un cliente para `/admin/clientes/:id`. */
export interface CustomerDetail extends Customer {
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
  pointsBalance: number;
  notes: CustomerNote[];
  measurementSets: MeasurementSet[];
  orders: OrderSummary[];
}

// ── Carrito ────────────────────────────────────────────────────────────────

/** Snapshot de las opciones de personalización de un traje a medida. */
export interface CartItemConfig {
  optionValueIds: number[];
  measurementSetId?: number | null;
  note?: string | null;
}

export interface CartItem {
  id: number;
  cartId: number;
  itemType: CartItemType;
  suitModelId: number | null;
  fabricId: number | null;
  productId: number | null;
  config: CartItemConfig | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Datos desnormalizados solo para pintar el carrito. */
  displayName: string;
  displaySubtitle: string | null;
  imageUrl: string | null;
  /** Desglose de las opciones elegidas (solo `made_to_measure`). */
  selectedOptions: Array<{ id: number; groupName: string; name: string; priceDelta: number }>;
}

export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  discount: number;
}

export interface Cart {
  id: number;
  customerId: number | null;
  sessionToken: string;
  status: CartStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  /** Anticipo exigido por los ítems a medida + total de los listos para llevar. */
  dueNow: number;
  coupon: AppliedCoupon | null;
  requiresAppointment: boolean;
  updatedAt: string;
}

export interface CouponValidation {
  valid: boolean;
  discount: number;
  reason: string | null;
}

/** Cupón tal y como lo administra el back-office. */
export interface Coupon {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  minSubtotal: number;
  validUntil: string;
  usageLimit: number | null;
  timesUsed: number;
  isActive: boolean;
}

// ── Cotizaciones ───────────────────────────────────────────────────────────

export interface Quote {
  id: number;
  customerId: number;
  quoteNumber: string;
  estimatedTotal: number;
  validUntil: string;
  status: QuoteStatus;
  note: string | null;
  createdAt: string;
}

// ── Pedidos ────────────────────────────────────────────────────────────────

export interface OrderItemCustomization {
  id: number;
  optionValueId: number;
  groupName: string;
  optionName: string;
  priceDelta: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  itemType: CartItemType;
  suitModelId: number | null;
  suitModelName: string | null;
  fabricId: number | null;
  fabricName: string | null;
  productId: number | null;
  productName: string | null;
  measurementSetId: number | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
  customizations: OrderItemCustomization[];
}

export interface OrderStatusHistoryEntry {
  id: number;
  statusCode: OrderStatusCode;
  statusName: string;
  changedBy: number | null;
  changedByName: string | null;
  changedAt: string;
  note: string | null;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  orderNumber: string;
  statusCode: OrderStatusCode;
  statusName: string;
  quoteId: number | null;
  couponCode: string | null;
  /** `null` en pedidos de mostrador: se recogen en el taller, no se envían. */
  deliveryAddress: Address | null;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  depositPaid: number;
  balanceDue: number;
  promisedDate: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
  history: OrderStatusHistoryEntry[];
  /** Puntos de fidelización que este pedido sumó al saldo del cliente. */
  pointsEarned: number;
  /** Puntos que el cliente canjeó como parte del pago de este pedido. */
  pointsRedeemed: number;
  /** Descuento en quetzales que representaron esos puntos canjeados. */
  pointsDiscount: number;
}

/** Fila ligera para listados / historial. */
export interface OrderSummary {
  id: number;
  orderNumber: string;
  statusCode: OrderStatusCode;
  statusName: string;
  total: number;
  balanceDue: number;
  promisedDate: string | null;
  createdAt: string;
  itemCount: number;
}

export interface CheckoutResult {
  orderNumber: string;
  orderId: number;
  total: number;
  dueNow: number;
  requiresAppointment: boolean;
  payment: {
    status: 'succeeded' | 'requires_action' | 'failed';
    reference: string;
    amount: number;
  };
  pointsEarned: number;
  pointsRedeemed: number;
  pointsDiscount: number;
  /** Saldo de puntos del cliente después de este pedido. */
  pointsBalanceAfter: number;
}

// ── Fidelización ─────────────────────────────────────────────────────────

/**
 * Reglas del programa de puntos. Las ajusta el administrador desde
 * `/admin/fidelizacion` — no son un valor fijo en el código.
 */
export interface LoyaltySettings {
  /** Quetzales gastados (sobre la base gravable) que otorgan 1 punto. */
  earnRateQuetzalPerPoint: number;
  /** Cuántos quetzales vale 1 punto al canjearlo como descuento. */
  redemptionValueQuetzalPerPoint: number;
  /** Apagado, el carrito deja de ofrecer canje y los pedidos no acumulan. */
  isActive: boolean;
  updatedAt: string;
}

/** Saldo de puntos de un cliente. */
export interface LoyaltyAccount {
  customerId: number;
  customerName: string;
  customerEmail: string;
  pointsBalance: number;
  /** Puntos acumulados históricamente, sin restar lo ya canjeado. */
  pointsLifetime: number;
  updatedAt: string;
}

/** Un movimiento del historial de puntos de un cliente (gana o canjea). */
export interface LoyaltyMovement {
  id: number;
  customerId: number;
  orderId: number | null;
  orderNumber: string | null;
  type: 'earned' | 'redeemed' | 'adjustment';
  points: number;
  note: string | null;
  createdAt: string;
}

// ── Seguimiento ────────────────────────────────────────────────────────────

export interface TrackingStep {
  stageCode: ProductionStageCode;
  stageName: string;
  sortOrder: number;
  estimatedDate: string | null;
  doneAt: string | null;
  note: string | null;
  assignedTailor: string | null;
}

export interface OrderTracking {
  orderNumber: string;
  statusCode: OrderStatusCode;
  statusName: string;
  promisedDate: string | null;
  currentStage: ProductionStageCode | null;
  steps: TrackingStep[];
  history: OrderStatusHistoryEntry[];
}

// ── Producción ─────────────────────────────────────────────────────────────

export interface WorkOrder {
  id: number;
  orderId: number;
  orderNumber: string;
  customerName: string;
  assignedTailorId: number | null;
  assignedTailorName: string | null;
  stageCode: ProductionStageCode;
  stageName: string;
  startedAt: string | null;
  dueAt: string | null;
  completedAt: string | null;
  note: string | null;
}

export interface ProductionBoardColumn {
  stageCode: ProductionStageCode;
  stageName: string;
  sortOrder: number;
  workOrders: WorkOrder[];
}

export interface TailorWorkload {
  staffId: number;
  tailorName: string;
  specialty: string | null;
  isAvailable: boolean;
  activeWorkOrders: number;
  overdueWorkOrders: number;
}

// ── Citas ──────────────────────────────────────────────────────────────────

export interface Appointment {
  id: number;
  customerId: number;
  customerName: string;
  staffId: number | null;
  staffName: string | null;
  appointmentTypeId: number;
  appointmentTypeCode: AppointmentTypeCode;
  appointmentTypeName: string;
  orderId: number | null;
  orderNumber: string | null;
  scheduledAt: string;
  durationMin: number;
  status: AppointmentStatus;
  note: string | null;
}

export interface AvailabilitySlot {
  staffId: number;
  staffName: string;
  startsAt: string;
  endsAt: string;
}

// ── Pagos y entregas ───────────────────────────────────────────────────────

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface Payment {
  id: number;
  orderId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  amount: number;
  paymentType: PaymentType;
  paidAt: string;
  reference: string | null;
}

export interface Delivery {
  id: number;
  orderId: number;
  addressId: number | null;
  scheduledDate: string | null;
  deliveredAt: string | null;
  status: DeliveryStatus;
  note: string | null;
}

// ── Métricas del back-office ───────────────────────────────────────────────

export interface AdminDashboardStats {
  openOrders: number;
  ordersInProduction: number;
  appointmentsToday: number;
  revenueThisMonth: number;
  pendingBalance: number;
  lowStockFabrics: number;
  lowStockProducts: number;
}
