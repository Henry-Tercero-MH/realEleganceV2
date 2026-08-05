/**
 * Implementación simulada de la API.
 *
 * Respeta las firmas y las formas de respuesta que tendrá `apps/api`, incluida
 * la latencia y los errores: así las pantallas se diseñan contra estados reales
 * (cargando, vacío, error) y no contra datos que aparecen al instante.
 */
import type {
  ApiErrorCode,
  Appointment,
  AuthSession,
  Coupon,
  CouponValidation,
  Fabric,
  MeasurementSet,
  Order,
  OrderSummary,
  OrderTracking,
  OptionGroup,
  Paginated,
  Product,
  ProductionBoardColumn,
  ProductionStageCode,
  Role,
  SuitModel,
  TailorWorkload,
  TrackingStep,
} from '@real-elegance/shared';
import { PRODUCTION_STAGES, PRODUCTION_STAGE_LABELS } from '@real-elegance/shared';
import * as db from '@/mocks/data';
import { ApiError } from './http';

// ── Infraestructura del mock ───────────────────────────────────────────────

const LATENCY = Number(import.meta.env.VITE_MOCK_LATENCY ?? 320);

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function fail(code: ApiErrorCode, message: string, status = 400): never {
  throw new ApiError(code, message, status);
}

function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

/** Minúsculas y sin tildes, para que «esmoquin» encuentre «Esmoquin». */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ── Autenticación ──────────────────────────────────────────────────────────

/** Cuentas de demo. En producción esto es `USERS` + bcrypt, evidentemente. */
const DEMO_ACCOUNTS: Array<{ email: string; password: string; role: Role; customerId: number | null; staffId: number | null; firstName: string; lastName: string }> = [
  { email: 'admin@realelegance.com', password: 'Admin!2026', role: 'admin', customerId: null, staffId: null, firstName: 'Dirección', lastName: 'Real Elegance' },
  { email: 'sastre@realelegance.com', password: 'Sastre!2026', role: 'tailor', customerId: null, staffId: 2, firstName: 'Julián', lastName: 'Estrada' },
  { email: 'cliente@realelegance.com', password: 'Cliente!2026', role: 'customer', customerId: 1, staffId: null, firstName: 'Henry', lastName: 'Tercero' },
];

export const DEMO_CREDENTIALS = DEMO_ACCOUNTS.map(({ email, password, role }) => ({
  email,
  password,
  role,
}));

function sessionFor(account: (typeof DEMO_ACCOUNTS)[number], id: number): AuthSession {
  return {
    user: {
      id,
      email: account.email,
      role: account.role,
      isActive: true,
      customerId: account.customerId,
      staffId: account.staffId,
      firstName: account.firstName,
      lastName: account.lastName,
    },
    tokens: {
      accessToken: `mock.access.${id}.${Date.now()}`,
      refreshToken: `mock.refresh.${id}.${Date.now()}`,
      expiresIn: 900,
    },
  };
}

const auth = {
  async login(email: string, password: string): Promise<AuthSession> {
    await delay(null, 420);
    const index = DEMO_ACCOUNTS.findIndex(
      (account) => account.email.toLowerCase() === email.trim().toLowerCase(),
    );
    const account = DEMO_ACCOUNTS[index];

    if (!account || account.password !== password) {
      fail('UNAUTHORIZED', 'Correo o contraseña incorrectos.', 401);
    }
    return sessionFor(account, index + 1);
  },

  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthSession> {
    await delay(null, 520);
    if (DEMO_ACCOUNTS.some((account) => account.email === input.email.toLowerCase())) {
      fail('CONFLICT', 'Ya existe una cuenta con ese correo.', 409);
    }
    return sessionFor(
      {
        email: input.email,
        password: input.password,
        role: 'customer',
        customerId: 1,
        staffId: null,
        firstName: input.firstName,
        lastName: input.lastName,
      },
      99,
    );
  },
};

// ── Catálogo ───────────────────────────────────────────────────────────────

export interface SuitFilters {
  search?: string;
  styleId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'name';
  page?: number;
  pageSize?: number;
}

const catalog = {
  async listStyles() {
    return delay(db.suitStyles, 120);
  },

  async listSuits(filters: SuitFilters = {}): Promise<Paginated<SuitModel>> {
    const { search, styleId, minPrice, maxPrice, sort = 'featured', page = 1, pageSize = 12 } = filters;

    let items = db.suitModels.filter((model) => model.isActive);

    if (search) {
      const needle = normalize(search);
      items = items.filter(
        (model) =>
          normalize(model.name).includes(needle) ||
          normalize(model.code).includes(needle) ||
          normalize(model.description ?? '').includes(needle),
      );
    }
    if (styleId) items = items.filter((model) => model.styleId === styleId);
    if (typeof minPrice === 'number') items = items.filter((model) => model.basePrice >= minPrice);
    if (typeof maxPrice === 'number') items = items.filter((model) => model.basePrice <= maxPrice);

    items = [...items].sort((a, b) => {
      if (sort === 'price-asc') return a.basePrice - b.basePrice;
      if (sort === 'price-desc') return b.basePrice - a.basePrice;
      if (sort === 'name') return a.name.localeCompare(b.name, 'es');
      return a.sortOrder - b.sortOrder;
    });

    return delay(paginate(items, page, pageSize));
  },

  async getSuit(code: string): Promise<SuitModel> {
    const model = db.suitModels.find((suit) => suit.code === code || String(suit.id) === code);
    if (!model) fail('NOT_FOUND', 'No encontramos ese modelo.', 404);
    return delay(model);
  },

  async listFabricCategories() {
    return delay(db.fabricCategories, 120);
  },

  async listFabrics(filters: { categoryId?: number | null; search?: string } = {}): Promise<Fabric[]> {
    let items = db.fabrics.filter((item) => item.isActive);
    if (filters.categoryId) items = items.filter((item) => item.categoryId === filters.categoryId);
    if (filters.search) {
      const needle = normalize(filters.search);
      items = items.filter(
        (item) => normalize(item.name).includes(needle) || normalize(item.code).includes(needle),
      );
    }
    return delay(items);
  },

  async listOptionGroups(): Promise<OptionGroup[]> {
    return delay(db.optionGroups);
  },

  async listProductCategories() {
    return delay(db.productCategories, 120);
  },

  async listProducts(filters: { categoryId?: number | null; search?: string } = {}): Promise<Product[]> {
    let items = db.products.filter((item) => item.isActive);
    if (filters.categoryId) items = items.filter((item) => item.categoryId === filters.categoryId);
    if (filters.search) {
      const needle = normalize(filters.search);
      items = items.filter(
        (item) => normalize(item.name).includes(needle) || normalize(item.sku).includes(needle),
      );
    }
    return delay(items);
  },

  async getProduct(sku: string): Promise<Product> {
    const item = db.products.find((product) => product.sku === sku || String(product.id) === sku);
    if (!item) fail('NOT_FOUND', 'No encontramos ese accesorio.', 404);
    return delay(item);
  },
};

// ── Carrito ────────────────────────────────────────────────────────────────

const cart = {
  /**
   * Valida un cupón como lo hará `fn_validate_coupon`: vigencia, subtotal
   * mínimo y límite de usos.
   */
  async validateCoupon(code: string, subtotal: number): Promise<CouponValidation> {
    await delay(null, 380);
    const coupon = db.coupons.find(
      (item) => item.code.toUpperCase() === code.trim().toUpperCase(),
    );

    if (!coupon) return { valid: false, discount: 0, reason: 'El código no existe.' };
    if (!coupon.isActive) return { valid: false, discount: 0, reason: 'El cupón ya no está activo.' };
    if (new Date(coupon.validUntil) < new Date()) {
      return { valid: false, discount: 0, reason: 'El cupón venció.' };
    }
    if (subtotal < coupon.minSubtotal) {
      return {
        valid: false,
        discount: 0,
        reason: `Requiere un subtotal mínimo de Q ${coupon.minSubtotal.toLocaleString('es-GT')}.`,
      };
    }
    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, discount: 0, reason: 'El cupón alcanzó su límite de usos.' };
    }

    const discount =
      coupon.type === 'percent'
        ? Math.round(subtotal * (coupon.value / 100) * 100) / 100
        : Math.min(coupon.value, subtotal);

    return { valid: true, discount, reason: null };
  },

  /**
   * Simula `sp_checkout`: revalida y devuelve el número de pedido.
   *
   * Recibe también los datos de contacto y entrega porque es lo que enviará
   * `POST /api/v1/checkout`; el mock no los usa, pero la firma es la real.
   */
  async checkout(input: {
    total: number;
    dueNow: number;
    requiresAppointment: boolean;
    contact?: Record<string, unknown>;
  }) {
    await delay(null, 900);
    const sequence = String(1032 + db.orders.length).padStart(5, '0');
    return {
      orderNumber: `RE-${new Date().getFullYear()}-${sequence}`,
      orderId: 900 + db.orders.length,
      total: input.total,
      dueNow: input.dueNow,
      requiresAppointment: input.requiresAppointment,
      payment: {
        status: 'succeeded' as const,
        reference: `TRX-${Math.floor(Math.random() * 9000 + 1000)}-${new Date().getFullYear()}`,
        amount: input.dueNow,
      },
    };
  },
};

// ── Pedidos y seguimiento ──────────────────────────────────────────────────

function toSummary(order: Order): OrderSummary {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    statusCode: order.statusCode,
    statusName: order.statusName,
    total: order.total,
    balanceDue: order.balanceDue,
    promisedDate: order.promisedDate,
    createdAt: order.createdAt,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

/** Reconstruye el timeline que devolverá `fn_order_tracking`. */
function trackingSteps(order: Order): TrackingStep[] {
  const stageOrder = [...PRODUCTION_STAGES];
  const own = db.workOrders.filter((workOrder) => workOrder.orderId === order.id);

  return stageOrder.map((stageCode, index) => {
    const workOrder = own.find((item) => item.stageCode === stageCode);
    return {
      stageCode,
      stageName: PRODUCTION_STAGE_LABELS[stageCode],
      sortOrder: index + 1,
      estimatedDate: workOrder?.dueAt ?? null,
      doneAt: workOrder?.completedAt ?? null,
      note: workOrder?.note ?? null,
      assignedTailor: workOrder?.assignedTailorName ?? null,
    };
  });
}

const ordersApi = {
  async listMine(customerId: number): Promise<OrderSummary[]> {
    const items = db.orders
      .filter((order) => order.customerId === customerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return delay(items.map(toSummary));
  },

  async getByNumber(orderNumber: string): Promise<Order> {
    const order = db.orders.find(
      (item) => item.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase(),
    );
    if (!order) fail('NOT_FOUND', 'No encontramos ese pedido.', 404);
    return delay(order);
  },

  async tracking(orderNumber: string): Promise<OrderTracking> {
    const order = db.orders.find(
      (item) => item.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase(),
    );
    if (!order) {
      fail('NOT_FOUND', 'No encontramos ningún pedido con ese número.', 404);
    }

    const steps = trackingSteps(order);
    const current = db.workOrders.find(
      (workOrder) => workOrder.orderId === order.id && !workOrder.completedAt,
    );

    return delay({
      orderNumber: order.orderNumber,
      statusCode: order.statusCode,
      statusName: order.statusName,
      promisedDate: order.promisedDate,
      currentStage: (current?.stageCode as ProductionStageCode | undefined) ?? null,
      steps,
      history: order.history,
    });
  },
};

// ── Citas ──────────────────────────────────────────────────────────────────

const appointmentsApi = {
  async listMine(customerId: number): Promise<Appointment[]> {
    const items = db.appointments
      .filter((appointment) => appointment.customerId === customerId)
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
    return delay(items);
  },

  async listStaff() {
    return delay(db.staff, 150);
  },

  /**
   * Huecos libres de un día. En el backend esto lo resuelve una consulta contra
   * `appointments(staff_id, scheduled_at)`; aquí basta con descartar los ocupados.
   */
  async availability(date: string, staffId: number | null) {
    await delay(null, 300);
    const hours = [9, 10, 11, 12, 14, 15, 16, 17];
    const candidates = db.staff.filter(
      (member) => member.isAvailable && (staffId === null || member.id === staffId),
    );

    return candidates.flatMap((member) =>
      hours
        .map((hour) => {
          const starts = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`);
          const taken = db.appointments.some(
            (appointment) =>
              appointment.staffId === member.id &&
              appointment.status === 'scheduled' &&
              Math.abs(new Date(appointment.scheduledAt).getTime() - starts.getTime()) < 60 * 60 * 1000,
          );
          if (taken || starts.getTime() < Date.now()) return null;
          return {
            staffId: member.id,
            staffName: `${member.firstName} ${member.lastName}`,
            startsAt: starts.toISOString(),
            endsAt: new Date(starts.getTime() + 60 * 60 * 1000).toISOString(),
          };
        })
        .filter((slot): slot is NonNullable<typeof slot> => slot !== null),
    );
  },

  async create(input: {
    appointmentTypeCode: string;
    staffId: number;
    scheduledAt: string;
    note?: string;
  }) {
    await delay(null, 700);
    const member = db.staff.find((item) => item.id === input.staffId);
    if (!member) fail('NOT_FOUND', 'Ese miembro del taller no existe.', 404);

    // El trigger `trg_appointments_no_overlap` hará esta misma comprobación.
    const overlaps = db.appointments.some(
      (appointment) =>
        appointment.staffId === input.staffId &&
        appointment.status === 'scheduled' &&
        Math.abs(new Date(appointment.scheduledAt).getTime() - new Date(input.scheduledAt).getTime()) <
          45 * 60 * 1000,
    );
    if (overlaps) {
      fail('CONFLICT', 'Ese horario acaba de ocuparse. Elige otro, por favor.', 409);
    }

    return { id: Date.now(), scheduledAt: input.scheduledAt, staffName: `${member.firstName} ${member.lastName}` };
  },
};

// ── Medidas ────────────────────────────────────────────────────────────────

const measurements = {
  async listMine(customerId: number): Promise<MeasurementSet[]> {
    return delay(db.measurementSets.filter((set) => set.customerId === customerId));
  },
  async listTypes() {
    return delay(db.measurementTypes, 120);
  },
};

// ── Back-office ────────────────────────────────────────────────────────────

const admin = {
  async stats() {
    return delay(db.dashboardStats);
  },

  async listSuits(): Promise<SuitModel[]> {
    return delay(db.suitModels);
  },

  async listFabrics(): Promise<Fabric[]> {
    return delay(db.fabrics);
  },

  async listProducts(): Promise<Product[]> {
    return delay(db.products);
  },

  async listCoupons(): Promise<Coupon[]> {
    return delay(db.coupons);
  },

  async listOrders(): Promise<OrderSummary[]> {
    return delay(db.orders.map(toSummary));
  },

  async listAppointments(): Promise<Appointment[]> {
    return delay([...db.appointments].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)));
  },

  /** Equivale a la vista `vw_production_board`. */
  async productionBoard(): Promise<ProductionBoardColumn[]> {
    const columns = PRODUCTION_STAGES.map((stageCode, index) => ({
      stageCode,
      stageName: PRODUCTION_STAGE_LABELS[stageCode],
      sortOrder: index + 1,
      workOrders: db.workOrders.filter(
        (workOrder) => workOrder.stageCode === stageCode && !workOrder.completedAt,
      ),
    }));
    return delay(columns);
  },

  /** Equivale a la vista `vw_tailor_workload`. */
  async tailorWorkload(): Promise<TailorWorkload[]> {
    const now = Date.now();
    const rows = db.staff.map((member) => {
      const own = db.workOrders.filter(
        (workOrder) => workOrder.assignedTailorId === member.id && !workOrder.completedAt,
      );
      return {
        staffId: member.id,
        tailorName: `${member.firstName} ${member.lastName}`,
        specialty: member.specialty,
        isAvailable: member.isAvailable,
        activeWorkOrders: own.length,
        overdueWorkOrders: own.filter(
          (workOrder) => workOrder.dueAt && new Date(workOrder.dueAt).getTime() < now,
        ).length,
      };
    });
    return delay(rows);
  },

  /** Equivale a `sp_assign_tailor`. */
  async assignTailor(workOrderId: number, tailorId: number) {
    await delay(null, 480);
    const workOrder = db.workOrders.find((item) => item.id === workOrderId);
    const tailor = db.staff.find((item) => item.id === tailorId);
    if (!workOrder || !tailor) fail('NOT_FOUND', 'Orden de trabajo o sastre inexistente.', 404);
    if (!tailor.isAvailable) fail('BUSINESS_RULE', `${tailor.firstName} no está disponible.`, 422);

    workOrder.assignedTailorId = tailor.id;
    workOrder.assignedTailorName = `${tailor.firstName} ${tailor.lastName}`;
    return structuredClone(workOrder);
  },

  /** Equivale a `sp_advance_stage`. */
  async advanceStage(workOrderId: number) {
    await delay(null, 480);
    const workOrder = db.workOrders.find((item) => item.id === workOrderId);
    if (!workOrder) fail('NOT_FOUND', 'Esa orden de trabajo no existe.', 404);

    const index = PRODUCTION_STAGES.indexOf(workOrder.stageCode);
    const next = PRODUCTION_STAGES[index + 1];
    if (!next) fail('BUSINESS_RULE', 'La orden ya está en la última etapa.', 422);

    workOrder.completedAt = new Date().toISOString();
    const created = {
      ...structuredClone(workOrder),
      id: Math.max(...db.workOrders.map((item) => item.id)) + 1,
      stageCode: next,
      stageName: PRODUCTION_STAGE_LABELS[next],
      startedAt: new Date().toISOString(),
      completedAt: null,
    };
    db.workOrders.push(created);
    return created;
  },
};

// ── Superficie pública del mock ────────────────────────────────────────────

export const mockApi = {
  auth,
  catalog,
  cart,
  orders: ordersApi,
  appointments: appointmentsApi,
  measurements,
  admin,
};

export type Api = typeof mockApi;
