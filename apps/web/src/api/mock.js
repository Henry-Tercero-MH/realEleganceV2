import { APPOINTMENT_TYPES, APPOINTMENT_TYPE_LABELS, CLOSED_ORDER_STATUSES, ORDER_STATUSES, ORDER_STATUS_LABELS, PRODUCTION_STAGES, PRODUCTION_STAGE_LABELS, } from '@real-elegance/shared';
import { TAX_RATE } from '@/features/cart/pricing';
import { isMeasurementValueValid, isValidEmail, isValidName, isValidPhoneGT } from '@/lib/validation';
import * as db from '@/mocks/data';
import { ApiError } from './http';
// ── Infraestructura del mock ───────────────────────────────────────────────
const LATENCY = Number(import.meta.env.VITE_MOCK_LATENCY ?? 320);
function delay(value, ms = LATENCY) {
    return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}
function fail(code, message, status = 400) {
    throw new ApiError(code, message, status);
}
function round2(value) {
    return Math.round(value * 100) / 100;
}
/** `21` → fecha de hoy + 21 días, en ISO. */
function isoDaysFromNow(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
}
/** `21` → fecha de hoy + 21 días, sin hora (`YYYY-MM-DD`). */
function dateOnlyFromNow(days) {
    return isoDaysFromNow(days).slice(0, 10);
}
function paginate(items, page, pageSize) {
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
function normalize(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
// ── Autenticación ──────────────────────────────────────────────────────────
/** Cuentas de demo. En producción esto es `USERS` + bcrypt, evidentemente. */
const DEMO_ACCOUNTS = [
    { email: 'admin@realelegance.com', password: 'Admin!2026', role: 'admin', customerId: null, staffId: null, firstName: 'Dirección', lastName: 'Real Elegance' },
    { email: 'sastre@realelegance.com', password: 'Sastre!2026', role: 'tailor', customerId: null, staffId: 2, firstName: 'Julián', lastName: 'Estrada' },
    { email: 'cliente@realelegance.com', password: 'Cliente!2026', role: 'customer', customerId: 1, staffId: null, firstName: 'Henry', lastName: 'Tercero' },
];
export const DEMO_CREDENTIALS = DEMO_ACCOUNTS.map(({ email, password, role }) => ({
    email,
    password,
    role,
}));
function sessionFor(account, id) {
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
    async login(email, password) {
        await delay(null, 420);
        const index = DEMO_ACCOUNTS.findIndex((account) => account.email.toLowerCase() === email.trim().toLowerCase());
        const account = DEMO_ACCOUNTS[index];
        if (!account || account.password !== password) {
            fail('UNAUTHORIZED', 'Correo o contraseña incorrectos.', 401);
        }
        return sessionFor(account, index + 1);
    },
    async register(input) {
        await delay(null, 520);
        if (DEMO_ACCOUNTS.some((account) => account.email === input.email.toLowerCase())) {
            fail('CONFLICT', 'Ya existe una cuenta con ese correo.', 409);
        }
        return sessionFor({
            email: input.email,
            password: input.password,
            role: 'customer',
            customerId: 1,
            staffId: null,
            firstName: input.firstName,
            lastName: input.lastName,
        }, 99);
    },
};
const catalog = {
    async listStyles() {
        return delay(db.suitStyles, 120);
    },
    async listSuits(filters = {}) {
        const { search, styleId, minPrice, maxPrice, sort = 'featured', page = 1, pageSize = 12 } = filters;
        let items = db.suitModels.filter((model) => model.isActive);
        if (search) {
            const needle = normalize(search);
            items = items.filter((model) => normalize(model.name).includes(needle) ||
                normalize(model.code).includes(needle) ||
                normalize(model.description ?? '').includes(needle));
        }
        if (styleId)
            items = items.filter((model) => model.styleId === styleId);
        if (typeof minPrice === 'number')
            items = items.filter((model) => model.basePrice >= minPrice);
        if (typeof maxPrice === 'number')
            items = items.filter((model) => model.basePrice <= maxPrice);
        items = [...items].sort((a, b) => {
            if (sort === 'price-asc')
                return a.basePrice - b.basePrice;
            if (sort === 'price-desc')
                return b.basePrice - a.basePrice;
            if (sort === 'name')
                return a.name.localeCompare(b.name, 'es');
            return a.sortOrder - b.sortOrder;
        });
        return delay(paginate(items, page, pageSize));
    },
    async getSuit(code) {
        const model = db.suitModels.find((suit) => suit.code === code || String(suit.id) === code);
        if (!model)
            fail('NOT_FOUND', 'No encontramos ese modelo.', 404);
        return delay(model);
    },
    async listFabricCategories() {
        return delay(db.fabricCategories, 120);
    },
    async listFabrics(filters = {}) {
        let items = db.fabrics.filter((item) => item.isActive);
        if (filters.categoryId)
            items = items.filter((item) => item.categoryId === filters.categoryId);
        if (filters.search) {
            const needle = normalize(filters.search);
            items = items.filter((item) => normalize(item.name).includes(needle) || normalize(item.code).includes(needle));
        }
        return delay(items);
    },
    async listOptionGroups() {
        return delay(db.optionGroups);
    },
    async listProductCategories() {
        return delay(db.productCategories, 120);
    },
    async listProducts(filters = {}) {
        let items = db.products.filter((item) => item.isActive);
        if (filters.categoryId)
            items = items.filter((item) => item.categoryId === filters.categoryId);
        if (filters.search) {
            const needle = normalize(filters.search);
            items = items.filter((item) => normalize(item.name).includes(needle) || normalize(item.sku).includes(needle));
        }
        return delay(items);
    },
    async getProduct(sku) {
        const item = db.products.find((product) => product.sku === sku || String(product.id) === sku);
        if (!item)
            fail('NOT_FOUND', 'No encontramos ese accesorio.', 404);
        return delay(item);
    },
};
// ── Carrito ────────────────────────────────────────────────────────────────
/** Mismos ids que usa el pedido de mostrador (`AdminNewOrderPage`): un pago no distingue de dónde vino. */
const WEB_PAYMENT_METHODS = {
    cash: { id: 1, name: 'Efectivo' },
    card: { id: 2, name: 'Tarjeta de crédito' },
    transfer: { id: 3, name: 'Transferencia bancaria' },
};
const cart = {
    /**
     * Valida un cupón como lo hará `fn_validate_coupon`: vigencia, subtotal
     * mínimo y límite de usos.
     */
    async validateCoupon(code, subtotal) {
        await delay(null, 380);
        const coupon = db.coupons.find((item) => item.code.toUpperCase() === code.trim().toUpperCase());
        if (!coupon)
            return { valid: false, discount: 0, reason: 'El código no existe.' };
        if (!coupon.isActive)
            return { valid: false, discount: 0, reason: 'El cupón ya no está activo.' };
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
        const discount = coupon.type === 'percent'
            ? Math.round(subtotal * (coupon.value / 100) * 100) / 100
            : Math.min(coupon.value, subtotal);
        return { valid: true, discount, reason: null };
    },
    /**
     * Simula `sp_checkout`: cobra, **guarda el pedido** y devuelve su número.
     *
     * Antes este mock solo calculaba el resultado sin tocar `db.orders`, así que
     * un pedido pagado en la tienda no existía para nadie después de esta
     * llamada — ni para «Mis pedidos», ni para el seguimiento, ni para el
     * panel de administración. Ahora arma el mismo `Order` que arma el pedido
     * de mostrador (`admin.createOrder`), para que ambos caminos terminen en
     * el mismo sitio.
     *
     * Los puntos de fidelización se recalculan aquí con la tasa **vigente en el
     * servidor** (`db.loyaltySettings`), no con la que el carrito usó para
     * estimar — igual que el precio, el canje nunca se confía tal cual llega
     * del cliente.
     */
    async checkout(input) {
        await delay(null, 900);
        if (input.items.length === 0) {
            fail('VALIDATION_ERROR', 'El carrito está vacío.', 422);
        }
        // El esquema Zod del cliente ya valida esto, pero `contact` llega tipado
        // como datos externos: nunca se confía en el navegador para lo que se va
        // a guardar como la ficha del cliente y su dirección de entrega.
        if (!isValidName(input.contact.firstName) || !isValidName(input.contact.lastName)) {
            fail('VALIDATION_ERROR', 'Nombre y apellidos deben tener entre 2 y 60 letras.', 422);
        }
        if (!isValidEmail(input.contact.email)) {
            fail('VALIDATION_ERROR', 'El correo no es válido.', 422);
        }
        if (!isValidPhoneGT(input.contact.phone)) {
            fail('VALIDATION_ERROR', 'El teléfono no es válido.', 422);
        }
        if (!input.contact.addressLine1.trim() || !input.contact.city.trim()) {
            fail('VALIDATION_ERROR', 'La dirección de entrega está incompleta.', 422);
        }
        // Invitado: se busca por correo antes de crear un cliente nuevo, para no
        // duplicar la ficha de alguien que ya compró antes sin haber iniciado sesión.
        let customer = input.customerId != null ? db.customers.find((item) => item.id === input.customerId) : undefined;
        if (!customer) {
            const email = input.contact.email.trim().toLowerCase();
            customer = db.customers.find((item) => item.email.toLowerCase() === email);
        }
        if (!customer) {
            const nextCustomerId = Math.max(0, ...db.customers.map((item) => item.id)) + 1;
            customer = {
                id: nextCustomerId,
                userId: 1000 + nextCustomerId,
                firstName: input.contact.firstName.trim(),
                lastName: input.contact.lastName.trim(),
                email: input.contact.email.trim(),
                phone: input.contact.phone?.trim() || null,
                createdAt: new Date().toISOString(),
            };
            db.customers.push(customer);
        }
        const account = db.loyaltyAccounts.find((item) => item.customerId === customer.id);
        const requestedPoints = Math.max(0, Math.floor(input.pointsToRedeem ?? 0));
        let pointsRedeemed = 0;
        let pointsDiscount = 0;
        if (requestedPoints > 0) {
            if (!account) {
                fail('BUSINESS_RULE', 'No encontramos una cuenta de fidelización para canjear puntos.', 422);
            }
            if (requestedPoints > account.pointsBalance) {
                fail('BUSINESS_RULE', `Solo tienes ${account.pointsBalance} puntos disponibles.`, 422);
            }
            pointsRedeemed = requestedPoints;
            pointsDiscount = round2(pointsRedeemed * db.loyaltySettings.redemptionValueQuetzalPerPoint);
        }
        const pointsEarned = db.loyaltySettings.isActive
            ? Math.floor(input.taxableBase / db.loyaltySettings.earnRateQuetzalPerPoint)
            : 0;
        const nextOrderId = Math.max(0, ...db.orders.map((order) => order.id)) + 1;
        const sequence = String(1032 + db.orders.length).padStart(5, '0');
        const orderNumber = `RE-${new Date().getFullYear()}-${sequence}`;
        const now = new Date().toISOString();
        const dueNow = round2(input.dueNow);
        const balanceDue = round2(input.total - dueNow);
        const hasMadeToMeasure = input.items.some((item) => item.itemType === 'made_to_measure');
        let nextItemId = Math.max(0, ...db.orders.flatMap((order) => order.items.map((item) => item.id))) + 1;
        let nextCustomizationId = Math.max(0, ...db.orders.flatMap((order) => order.items.flatMap((item) => item.customizations.map((c) => c.id)))) + 1;
        const items = input.items.map((item) => {
            const suitModel = item.suitModelId != null ? db.suitModels.find((model) => model.id === item.suitModelId) : undefined;
            const fabricRow = item.fabricId != null ? db.fabrics.find((row) => row.id === item.fabricId) : undefined;
            const productRow = item.productId != null ? db.products.find((row) => row.id === item.productId) : undefined;
            return {
                id: nextItemId++,
                orderId: nextOrderId,
                itemType: item.itemType,
                suitModelId: item.suitModelId,
                suitModelName: suitModel?.name ?? null,
                fabricId: item.fabricId,
                fabricName: fabricRow?.name ?? null,
                productId: item.productId,
                productName: productRow?.name ?? null,
                // El carrito de la tienda todavía no liga una ficha de medidas al artículo.
                measurementSetId: null,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: round2(item.unitPrice * item.quantity),
                imageUrl: suitModel?.primaryImage?.url ?? productRow?.primaryImage?.url ?? null,
                customizations: item.selectedOptions.map((option) => ({
                    id: nextCustomizationId++,
                    optionValueId: option.id,
                    groupName: option.groupName,
                    optionName: option.name,
                    priceDelta: option.priceDelta,
                })),
            };
        });
        const paymentMethod = WEB_PAYMENT_METHODS[input.contact.paymentMethod];
        const paymentType = balanceDue > 0 ? 'anticipo' : 'saldo';
        const payments = dueNow > 0
            ? [
                {
                    id: Math.max(0, ...db.orders.flatMap((order) => order.payments.map((p) => p.id))) + 1,
                    orderId: nextOrderId,
                    paymentMethodId: paymentMethod.id,
                    paymentMethodName: paymentMethod.name,
                    amount: dueNow,
                    paymentType,
                    paidAt: now,
                    reference: `TRX-${Math.floor(Math.random() * 9000 + 1000)}-${new Date().getFullYear()}`,
                },
            ]
            : [];
        // Antes el checkout pedía la dirección y la tiraba: no se guardaba en
        // ningún lado, así que «entregar» un pedido no tenía ni destino que
        // mostrarle al taller. Ahora queda en `db.addresses` como una ficha real
        // del cliente, y una copia va en el pedido para no depender de un join.
        const deliveryAddress = {
            id: Math.max(0, ...db.addresses.map((item) => item.id)) + 1,
            customerId: customer.id,
            label: null,
            line1: input.contact.addressLine1.trim(),
            line2: null,
            city: input.contact.city.trim(),
            state: input.contact.state?.trim() || null,
            postalCode: input.contact.postalCode?.trim() || null,
            country: 'Guatemala',
            isDefault: !db.addresses.some((item) => item.customerId === customer.id),
        };
        db.addresses.push(deliveryAddress);
        const order = {
            id: nextOrderId,
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            orderNumber,
            statusCode: 'confirmed',
            statusName: ORDER_STATUS_LABELS.confirmed,
            deliveryAddress,
            quoteId: null,
            couponCode: input.couponCode?.trim() || null,
            subtotal: round2(input.subtotal),
            discountAmount: round2(input.discountAmount + pointsDiscount),
            tax: round2(input.tax),
            total: round2(input.total),
            depositPaid: dueNow,
            balanceDue,
            promisedDate: hasMadeToMeasure ? dateOnlyFromNow(28) : dateOnlyFromNow(3),
            createdAt: now,
            updatedAt: now,
            items,
            payments,
            history: [
                {
                    id: Math.max(0, ...db.orders.flatMap((o) => o.history.map((h) => h.id))) + 1,
                    statusCode: 'confirmed',
                    statusName: ORDER_STATUS_LABELS.confirmed,
                    changedBy: null,
                    changedByName: `${customer.firstName} ${customer.lastName}`,
                    changedAt: now,
                    note: input.contact.note?.trim()
                        ? `Pedido creado desde la tienda en línea. ${input.contact.note.trim()}`
                        : 'Pedido creado desde la tienda en línea.',
                },
            ],
            pointsEarned,
            pointsRedeemed,
            pointsDiscount,
        };
        db.orders.push(order);
        if (hasMadeToMeasure) {
            db.workOrders.push({
                id: Math.max(0, ...db.workOrders.map((wo) => wo.id)) + 1,
                orderId: nextOrderId,
                orderNumber,
                customerName: order.customerName,
                assignedTailorId: null,
                assignedTailorName: null,
                stageCode: 'corte',
                stageName: PRODUCTION_STAGE_LABELS.corte,
                startedAt: now,
                dueAt: isoDaysFromNow(21),
                completedAt: null,
                note: null,
            });
        }
        if (account) {
            account.pointsBalance = account.pointsBalance - pointsRedeemed + pointsEarned;
            account.pointsLifetime += pointsEarned;
            account.updatedAt = now;
            const nextMovementId = Math.max(0, ...db.loyaltyMovements.map((movement) => movement.id)) + 1;
            if (pointsEarned > 0) {
                db.loyaltyMovements.push({
                    id: nextMovementId,
                    customerId: account.customerId,
                    orderId: nextOrderId,
                    orderNumber,
                    type: 'earned',
                    points: pointsEarned,
                    note: null,
                    createdAt: now,
                });
            }
            if (pointsRedeemed > 0) {
                db.loyaltyMovements.push({
                    id: nextMovementId + 1,
                    customerId: account.customerId,
                    orderId: nextOrderId,
                    orderNumber,
                    type: 'redeemed',
                    points: -pointsRedeemed,
                    note: null,
                    createdAt: now,
                });
            }
        }
        return {
            orderNumber,
            orderId: nextOrderId,
            total: order.total,
            dueNow,
            requiresAppointment: input.requiresAppointment,
            payment: {
                status: 'succeeded',
                reference: payments[0]?.reference ?? `TRX-${Math.floor(Math.random() * 9000 + 1000)}-${new Date().getFullYear()}`,
                amount: dueNow,
            },
            pointsEarned,
            pointsRedeemed,
            pointsDiscount,
            pointsBalanceAfter: account?.pointsBalance ?? 0,
        };
    },
};
// ── Fidelización ───────────────────────────────────────────────────────────
const loyalty = {
    async getSettings() {
        return delay(db.loyaltySettings, 150);
    },
    /** Solo la usa `/admin/fidelizacion`: ajustar cuánto vale 1 punto. */
    async updateSettings(patch) {
        await delay(null, 500);
        if (patch.earnRateQuetzalPerPoint !== undefined && patch.earnRateQuetzalPerPoint <= 0) {
            fail('VALIDATION_ERROR', 'Los quetzales por punto deben ser mayores que cero.', 422);
        }
        if (patch.redemptionValueQuetzalPerPoint !== undefined && patch.redemptionValueQuetzalPerPoint < 0) {
            fail('VALIDATION_ERROR', 'El valor de canje no puede ser negativo.', 422);
        }
        const effectiveEarnRate = patch.earnRateQuetzalPerPoint ?? db.loyaltySettings.earnRateQuetzalPerPoint;
        const effectiveRedemption = patch.redemptionValueQuetzalPerPoint ?? db.loyaltySettings.redemptionValueQuetzalPerPoint;
        if (effectiveRedemption > effectiveEarnRate) {
            fail('VALIDATION_ERROR', 'El valor de canje no puede ser mayor que los quetzales que cuesta ganar un punto.', 422);
        }
        Object.assign(db.loyaltySettings, patch, { updatedAt: new Date().toISOString() });
        return structuredClone(db.loyaltySettings);
    },
    async getMyAccount(customerId) {
        const account = db.loyaltyAccounts.find((item) => item.customerId === customerId);
        // Cliente que nunca ha comprado: cuenta implícita en cero, sin fila propia.
        return delay(account ?? {
            customerId,
            customerName: '',
            customerEmail: '',
            pointsBalance: 0,
            pointsLifetime: 0,
            updatedAt: new Date(0).toISOString(),
        });
    },
    async getMyMovements(customerId) {
        const items = db.loyaltyMovements
            .filter((movement) => movement.customerId === customerId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return delay(items);
    },
    async listAccounts() {
        return delay([...db.loyaltyAccounts].sort((a, b) => b.pointsBalance - a.pointsBalance));
    },
    /**
     * Ajuste manual de puntos (una compensación, una corrección). Antes la
     * tabla de saldos era de solo lectura: no había forma de mover un punto
     * fuera de lo que un pedido ganaba o canjeaba automáticamente.
     */
    async adjustPoints(input) {
        await delay(null, 500);
        const points = Math.trunc(input.points);
        if (!points)
            fail('VALIDATION_ERROR', 'El ajuste no puede ser cero.', 422);
        if (!input.note.trim())
            fail('VALIDATION_ERROR', 'Escribe un motivo para el ajuste.', 422);
        const customer = db.customers.find((item) => item.id === input.customerId);
        if (!customer)
            fail('NOT_FOUND', 'Ese cliente no existe.', 404);
        let account = db.loyaltyAccounts.find((item) => item.customerId === input.customerId);
        const now = new Date().toISOString();
        if (!account) {
            account = {
                customerId: customer.id,
                customerName: `${customer.firstName} ${customer.lastName}`,
                customerEmail: customer.email,
                pointsBalance: 0,
                pointsLifetime: 0,
                updatedAt: now,
            };
            db.loyaltyAccounts.push(account);
        }
        const newBalance = account.pointsBalance + points;
        if (newBalance < 0) {
            fail('BUSINESS_RULE', 'Ese ajuste dejaría el saldo en negativo.', 422);
        }
        account.pointsBalance = newBalance;
        if (points > 0)
            account.pointsLifetime += points;
        account.updatedAt = now;
        db.loyaltyMovements.push({
            id: Math.max(0, ...db.loyaltyMovements.map((movement) => movement.id)) + 1,
            customerId: input.customerId,
            orderId: null,
            orderNumber: null,
            type: 'adjustment',
            points,
            note: input.note.trim(),
            createdAt: now,
        });
        return structuredClone(account);
    },
};
// ── Pedidos y seguimiento ──────────────────────────────────────────────────
function toSummary(order) {
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
function trackingSteps(order) {
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
    async listMine(customerId) {
        const items = db.orders
            .filter((order) => order.customerId === customerId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return delay(items.map(toSummary));
    },
    async getByNumber(orderNumber) {
        const order = db.orders.find((item) => item.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
        if (!order)
            fail('NOT_FOUND', 'No encontramos ese pedido.', 404);
        return delay(order);
    },
    async tracking(orderNumber) {
        const order = db.orders.find((item) => item.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
        if (!order) {
            fail('NOT_FOUND', 'No encontramos ningún pedido con ese número.', 404);
        }
        const steps = trackingSteps(order);
        const current = db.workOrders.find((workOrder) => workOrder.orderId === order.id && !workOrder.completedAt);
        return delay({
            orderNumber: order.orderNumber,
            statusCode: order.statusCode,
            statusName: order.statusName,
            promisedDate: order.promisedDate,
            currentStage: current?.stageCode ?? null,
            steps,
            history: order.history,
        });
    },
    /**
     * Reenvía el correo de confirmación. Equivale a `POST /orders/:id/resend`:
     * dispara la misma plantilla que se manda al confirmar, para cuando el
     * cliente perdió el número de pedido o el correo se fue a spam.
     */
    async resendConfirmation(orderNumber) {
        await delay(null, 700);
        const order = db.orders.find((item) => item.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
        if (!order)
            fail('NOT_FOUND', 'No encontramos ese pedido.', 404);
        const customer = db.customers.find((item) => item.id === order.customerId);
        if (!customer)
            fail('NOT_FOUND', 'No encontramos al cliente de ese pedido.', 404);
        return delay({ sentTo: customer.email });
    },
};
// ── Citas ──────────────────────────────────────────────────────────────────
const appointmentsApi = {
    async listMine(customerId) {
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
    async availability(date, staffId) {
        await delay(null, 300);
        const hours = [9, 10, 11, 12, 14, 15, 16, 17];
        const candidates = db.staff.filter((member) => member.isAvailable && (staffId === null || member.id === staffId));
        return candidates.flatMap((member) => hours
            .map((hour) => {
            const starts = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`);
            const taken = db.appointments.some((appointment) => appointment.staffId === member.id &&
                appointment.status === 'scheduled' &&
                Math.abs(new Date(appointment.scheduledAt).getTime() - starts.getTime()) < 60 * 60 * 1000);
            if (taken || starts.getTime() < Date.now())
                return null;
            return {
                staffId: member.id,
                staffName: `${member.firstName} ${member.lastName}`,
                startsAt: starts.toISOString(),
                endsAt: new Date(starts.getTime() + 60 * 60 * 1000).toISOString(),
            };
        })
            .filter((slot) => slot !== null));
    },
    /**
     * Equivale a `sp_book_appointment`. Antes este mock validaba el horario
     * pero nunca hacía `db.appointments.push(...)`, así que una cita agendada
     * no aparecía después en «Mis citas» ni en la agenda del taller — el mismo
     * problema que tenía `cart.checkout` con los pedidos.
     */
    async create(input) {
        await delay(null, 700);
        const customer = db.customers.find((item) => item.id === input.customerId);
        if (!customer)
            fail('NOT_FOUND', 'Ese cliente no existe.', 404);
        const member = db.staff.find((item) => item.id === input.staffId);
        if (!member)
            fail('NOT_FOUND', 'Ese miembro del taller no existe.', 404);
        // El `min` del input de fecha en el formulario es solo una ayuda visual:
        // sin esto, una cita en el pasado se aceptaría igual si se salta el cliente.
        if (new Date(input.scheduledAt).getTime() < Date.now()) {
            fail('VALIDATION_ERROR', 'No puedes agendar una cita en una fecha que ya pasó.', 422);
        }
        // El trigger `trg_appointments_no_overlap` hará esta misma comprobación.
        const overlaps = db.appointments.some((appointment) => appointment.staffId === input.staffId &&
            appointment.status === 'scheduled' &&
            Math.abs(new Date(appointment.scheduledAt).getTime() - new Date(input.scheduledAt).getTime()) <
                45 * 60 * 1000);
        if (overlaps) {
            fail('CONFLICT', 'Ese horario acaba de ocuparse. Elige otro, por favor.', 409);
        }
        const relatedOrder = input.orderId != null ? db.orders.find((order) => order.id === input.orderId) : undefined;
        const created = {
            id: Math.max(0, ...db.appointments.map((item) => item.id)) + 1,
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            staffId: member.id,
            staffName: `${member.firstName} ${member.lastName}`,
            appointmentTypeId: APPOINTMENT_TYPES.indexOf(input.appointmentTypeCode) + 1,
            appointmentTypeCode: input.appointmentTypeCode,
            appointmentTypeName: APPOINTMENT_TYPE_LABELS[input.appointmentTypeCode],
            orderId: relatedOrder?.id ?? null,
            orderNumber: relatedOrder?.orderNumber ?? null,
            scheduledAt: input.scheduledAt,
            durationMin: 60,
            status: 'scheduled',
            note: input.note?.trim() || null,
        };
        db.appointments.push(created);
        return structuredClone(created);
    },
    /**
     * Cierra una cita: cancelarla, marcarla atendida o registrar que no se
     * presentó. Antes ninguna acción cambiaba el estado con el que nacía
     * («agendada»), así que una cita cancelada seguía apareciendo como próxima.
     */
    async updateStatus(input) {
        await delay(null, 500);
        const appointment = db.appointments.find((item) => item.id === input.appointmentId);
        if (!appointment)
            fail('NOT_FOUND', 'Esa cita no existe.', 404);
        if (appointment.status !== 'scheduled') {
            fail('BUSINESS_RULE', 'Esa cita ya se cerró y no se puede modificar.', 422);
        }
        appointment.status = input.status;
        if (input.note?.trim())
            appointment.note = input.note.trim();
        return structuredClone(appointment);
    },
    /** Cambia el día/hora (y de paso el sastre) de una cita todavía agendada. */
    async reschedule(input) {
        await delay(null, 600);
        const appointment = db.appointments.find((item) => item.id === input.appointmentId);
        if (!appointment)
            fail('NOT_FOUND', 'Esa cita no existe.', 404);
        if (appointment.status !== 'scheduled') {
            fail('BUSINESS_RULE', 'Esa cita ya se cerró y no se puede reprogramar.', 422);
        }
        const member = db.staff.find((item) => item.id === input.staffId);
        if (!member)
            fail('NOT_FOUND', 'Ese miembro del taller no existe.', 404);
        if (new Date(input.scheduledAt).getTime() < Date.now()) {
            fail('VALIDATION_ERROR', 'No puedes reprogramar una cita a una fecha que ya pasó.', 422);
        }
        const overlaps = db.appointments.some((item) => item.id !== appointment.id &&
            item.staffId === input.staffId &&
            item.status === 'scheduled' &&
            Math.abs(new Date(item.scheduledAt).getTime() - new Date(input.scheduledAt).getTime()) <
                45 * 60 * 1000);
        if (overlaps) {
            fail('CONFLICT', 'Ese horario acaba de ocuparse. Elige otro, por favor.', 409);
        }
        appointment.staffId = member.id;
        appointment.staffName = `${member.firstName} ${member.lastName}`;
        appointment.scheduledAt = input.scheduledAt;
        return structuredClone(appointment);
    },
};
// ── Medidas ────────────────────────────────────────────────────────────────
const measurements = {
    async listMine(customerId) {
        return delay(db.measurementSets.filter((set) => set.customerId === customerId));
    },
    async listTypes() {
        return delay(db.measurementTypes, 120);
    },
};
// ── Back-office ────────────────────────────────────────────────────────────
/**
 * A qué estado del pedido corresponde cada etapa del taller. Antes
 * `advanceStage` solo movía `db.workOrders`: un pedido podía llegar a
 * «Entrega» en el taller y el cliente seguía viéndolo como «Confirmado»
 * para siempre. `entrega` llega solo hasta `ready` — pasar a `delivered`
 * sigue siendo una acción explícita del mostrador (cobra el saldo primero).
 */
const STAGE_ORDER_STATUS = {
    corte: 'in_production',
    confeccion: 'in_production',
    prueba: 'fitting',
    ajustes: 'fitting',
    entrega: 'ready',
};
const admin = {
    async stats() {
        return delay(db.dashboardStats);
    },
    async listSuits() {
        return delay(db.suitModels);
    },
    async listFabrics() {
        return delay(db.fabrics);
    },
    async listProducts() {
        return delay(db.products);
    },
    async listCoupons() {
        return delay(db.coupons);
    },
    async listOrders() {
        return delay(db.orders.map(toSummary));
    },
    /** Ficha completa de un pedido para `/admin/pedidos/:orderNumber`. */
    async getOrder(orderNumber) {
        const order = db.orders.find((item) => item.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
        if (!order)
            fail('NOT_FOUND', 'No encontramos ese pedido.', 404);
        return delay(order);
    },
    /**
     * Cobra el anticipo o el saldo de un pedido ya creado. Equivale a
     * `sp_record_payment`: hasta ahora la única forma de que un pedido tuviera
     * un pago era en el momento de crearlo, y no había manera de cerrar el
     * saldo que quedaba pendiente para la entrega.
     */
    async recordPayment(input) {
        await delay(null, 600);
        const order = db.orders.find((item) => item.orderNumber.toUpperCase() === input.orderNumber.trim().toUpperCase());
        if (!order)
            fail('NOT_FOUND', 'Ese pedido no existe.', 404);
        if (CLOSED_ORDER_STATUSES.includes(order.statusCode)) {
            fail('BUSINESS_RULE', 'Este pedido ya está cerrado.', 422);
        }
        const amount = round2(input.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            fail('VALIDATION_ERROR', 'El monto debe ser mayor que cero.', 422);
        }
        if (amount > order.balanceDue) {
            fail('VALIDATION_ERROR', 'El monto no puede ser mayor que el saldo pendiente.', 422);
        }
        const paymentType = order.depositPaid > 0 ? 'saldo' : 'anticipo';
        const nextPaymentId = Math.max(0, ...db.orders.flatMap((item) => item.payments.map((p) => p.id))) + 1;
        const now = new Date().toISOString();
        order.payments.push({
            id: nextPaymentId,
            orderId: order.id,
            paymentMethodId: input.paymentMethodId,
            paymentMethodName: input.paymentMethodName,
            amount,
            paymentType,
            paidAt: now,
            reference: input.reference?.trim() || null,
        });
        order.depositPaid = round2(order.depositPaid + amount);
        order.balanceDue = round2(order.balanceDue - amount);
        order.updatedAt = now;
        return structuredClone(order);
    },
    /**
     * Cambia el estado de un pedido y deja constancia en su bitácora. Equivale
     * a `sp_update_order_status`: antes no existía ninguna acción capaz de
     * mover un pedido de «Confirmado» a «Entregado» — el estado con el que
     * nacía era el que tenía para siempre.
     */
    async updateOrderStatus(input) {
        await delay(null, 500);
        const order = db.orders.find((item) => item.orderNumber.toUpperCase() === input.orderNumber.trim().toUpperCase());
        if (!order)
            fail('NOT_FOUND', 'Ese pedido no existe.', 404);
        if (CLOSED_ORDER_STATUSES.includes(order.statusCode)) {
            fail('BUSINESS_RULE', 'Este pedido ya está cerrado y no cambia de estado.', 422);
        }
        if (input.statusCode === order.statusCode) {
            fail('VALIDATION_ERROR', 'El pedido ya está en ese estado.', 422);
        }
        if (input.statusCode === 'delivered' && order.balanceDue > 0) {
            fail('BUSINESS_RULE', 'No se puede entregar un pedido con saldo pendiente.', 422);
        }
        const now = new Date().toISOString();
        order.statusCode = input.statusCode;
        order.statusName = ORDER_STATUS_LABELS[input.statusCode];
        order.updatedAt = now;
        order.history.push({
            id: Math.max(0, ...db.orders.flatMap((o) => o.history.map((h) => h.id))) + 1,
            statusCode: input.statusCode,
            statusName: ORDER_STATUS_LABELS[input.statusCode],
            changedBy: null,
            changedByName: input.changedByName,
            changedAt: now,
            note: input.note?.trim() || null,
        });
        return structuredClone(order);
    },
    async listAppointments() {
        return delay([...db.appointments].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)));
    },
    /** Equivale a la vista `vw_production_board`. */
    async productionBoard() {
        const columns = PRODUCTION_STAGES.map((stageCode, index) => ({
            stageCode,
            stageName: PRODUCTION_STAGE_LABELS[stageCode],
            sortOrder: index + 1,
            workOrders: db.workOrders.filter((workOrder) => workOrder.stageCode === stageCode && !workOrder.completedAt),
        }));
        return delay(columns);
    },
    /** Equivale a la vista `vw_tailor_workload`. */
    async tailorWorkload() {
        const now = Date.now();
        const rows = db.staff.map((member) => {
            const own = db.workOrders.filter((workOrder) => workOrder.assignedTailorId === member.id && !workOrder.completedAt);
            return {
                staffId: member.id,
                tailorName: `${member.firstName} ${member.lastName}`,
                specialty: member.specialty,
                isAvailable: member.isAvailable,
                activeWorkOrders: own.length,
                overdueWorkOrders: own.filter((workOrder) => workOrder.dueAt && new Date(workOrder.dueAt).getTime() < now).length,
            };
        });
        return delay(rows);
    },
    /** Equivale a `sp_assign_tailor`. */
    async assignTailor(workOrderId, tailorId) {
        await delay(null, 480);
        const workOrder = db.workOrders.find((item) => item.id === workOrderId);
        const tailor = db.staff.find((item) => item.id === tailorId);
        if (!workOrder || !tailor)
            fail('NOT_FOUND', 'Orden de trabajo o sastre inexistente.', 404);
        if (!tailor.isAvailable)
            fail('BUSINESS_RULE', `${tailor.firstName} no está disponible.`, 422);
        workOrder.assignedTailorId = tailor.id;
        workOrder.assignedTailorName = `${tailor.firstName} ${tailor.lastName}`;
        return structuredClone(workOrder);
    },
    /** Equivale a `sp_advance_stage`. */
    async advanceStage(workOrderId) {
        await delay(null, 480);
        const workOrder = db.workOrders.find((item) => item.id === workOrderId);
        if (!workOrder)
            fail('NOT_FOUND', 'Esa orden de trabajo no existe.', 404);
        const index = PRODUCTION_STAGES.indexOf(workOrder.stageCode);
        const next = PRODUCTION_STAGES[index + 1];
        if (!next)
            fail('BUSINESS_RULE', 'La orden ya está en la última etapa.', 422);
        const now = new Date().toISOString();
        workOrder.completedAt = now;
        const created = {
            ...structuredClone(workOrder),
            id: Math.max(...db.workOrders.map((item) => item.id)) + 1,
            stageCode: next,
            stageName: PRODUCTION_STAGE_LABELS[next],
            startedAt: now,
            completedAt: null,
        };
        db.workOrders.push(created);
        const relatedOrder = db.orders.find((order) => order.id === workOrder.orderId);
        const targetStatus = STAGE_ORDER_STATUS[next];
        if (relatedOrder &&
            targetStatus &&
            !CLOSED_ORDER_STATUSES.includes(relatedOrder.statusCode) &&
            ORDER_STATUSES.indexOf(targetStatus) > ORDER_STATUSES.indexOf(relatedOrder.statusCode)) {
            relatedOrder.statusCode = targetStatus;
            relatedOrder.statusName = ORDER_STATUS_LABELS[targetStatus];
            relatedOrder.updatedAt = now;
            relatedOrder.history.push({
                id: Math.max(0, ...db.orders.flatMap((order) => order.history.map((h) => h.id))) + 1,
                statusCode: targetStatus,
                statusName: ORDER_STATUS_LABELS[targetStatus],
                changedBy: null,
                changedByName: 'Taller',
                changedAt: now,
                note: `Actualizado automáticamente: la prenda avanzó a «${PRODUCTION_STAGE_LABELS[next]}».`,
            });
        }
        return created;
    },
    // ── Clientela (CRM del taller) ─────────────────────────────────────────
    /** Fila de `/admin/clientes`: el cliente más lo que resume su relación con el taller. */
    async listCustomers(filters = {}) {
        let items = db.customers;
        if (filters.search?.trim()) {
            const needle = normalize(filters.search);
            const rawNeedle = filters.search.trim();
            items = items.filter((customer) => normalize(`${customer.firstName} ${customer.lastName}`).includes(needle) ||
                normalize(customer.email).includes(needle) ||
                (customer.phone ?? '').includes(rawNeedle));
        }
        const rows = items.map((customer) => {
            const own = db.orders.filter((order) => order.customerId === customer.id);
            const account = db.loyaltyAccounts.find((item) => item.customerId === customer.id);
            const lastOrderAt = own.reduce((latest, order) => (!latest || order.createdAt > latest ? order.createdAt : latest), null);
            return {
                ...customer,
                totalOrders: own.length,
                totalSpent: round2(own.reduce((sum, order) => sum + order.total, 0)),
                lastOrderAt,
                pointsBalance: account?.pointsBalance ?? 0,
            };
        });
        rows.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, 'es'));
        return delay(rows);
    },
    /** Ficha completa de un cliente para `/admin/clientes/:id`. */
    async getCustomer(id) {
        const customer = db.customers.find((item) => item.id === id);
        if (!customer)
            fail('NOT_FOUND', 'No encontramos ese cliente.', 404);
        const own = [...db.orders]
            .filter((order) => order.customerId === id)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        const account = db.loyaltyAccounts.find((item) => item.customerId === id);
        const detail = {
            ...customer,
            totalOrders: own.length,
            totalSpent: round2(own.reduce((sum, order) => sum + order.total, 0)),
            lastOrderAt: own[0]?.createdAt ?? null,
            pointsBalance: account?.pointsBalance ?? 0,
            notes: db.customerNotes
                .filter((note) => note.customerId === id)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
            measurementSets: [...db.measurementSets]
                .filter((set) => set.customerId === id)
                .sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
            orders: own.map(toSummary),
        };
        return delay(detail);
    },
    /** Alta de un cliente nuevo desde el mostrador (sin cuenta de acceso todavía). */
    async createCustomer(input) {
        await delay(null, 500);
        const firstName = input.firstName.trim();
        const lastName = input.lastName.trim();
        const email = input.email.trim();
        if (!isValidName(firstName) || !isValidName(lastName)) {
            fail('VALIDATION_ERROR', 'Nombre y apellidos deben tener entre 2 y 60 letras.', 422);
        }
        if (!isValidEmail(email)) {
            fail('VALIDATION_ERROR', 'El correo no es válido.', 422);
        }
        if (input.phone?.trim() && !isValidPhoneGT(input.phone)) {
            fail('VALIDATION_ERROR', 'El teléfono no es válido.', 422);
        }
        if (db.customers.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
            fail('CONFLICT', 'Ya existe un cliente con ese correo.', 409);
        }
        const nextId = Math.max(0, ...db.customers.map((item) => item.id)) + 1;
        const created = {
            id: nextId,
            userId: 1000 + nextId,
            firstName,
            lastName,
            email,
            phone: input.phone?.trim() || null,
            createdAt: new Date().toISOString(),
        };
        db.customers.push(created);
        return structuredClone(created);
    },
    /**
     * Corrige la ficha de un cliente ya registrado. Antes, un correo o
     * teléfono mal tecleado en el alta se quedaba así para siempre: la única
     * salida era vivir con el error.
     */
    async updateCustomer(input) {
        await delay(null, 500);
        const customer = db.customers.find((item) => item.id === input.id);
        if (!customer)
            fail('NOT_FOUND', 'Ese cliente no existe.', 404);
        const firstName = input.firstName.trim();
        const lastName = input.lastName.trim();
        const email = input.email.trim();
        if (!isValidName(firstName) || !isValidName(lastName)) {
            fail('VALIDATION_ERROR', 'Nombre y apellidos deben tener entre 2 y 60 letras.', 422);
        }
        if (!isValidEmail(email)) {
            fail('VALIDATION_ERROR', 'El correo no es válido.', 422);
        }
        if (input.phone?.trim() && !isValidPhoneGT(input.phone)) {
            fail('VALIDATION_ERROR', 'El teléfono no es válido.', 422);
        }
        if (db.customers.some((item) => item.id !== input.id && item.email.toLowerCase() === email.toLowerCase())) {
            fail('CONFLICT', 'Ya existe otro cliente con ese correo.', 409);
        }
        customer.firstName = firstName;
        customer.lastName = lastName;
        customer.email = email;
        customer.phone = input.phone?.trim() || null;
        return structuredClone(customer);
    },
    /** Nota de mostrador: preferencias, alergias, quién refirió al cliente. */
    async addCustomerNote(input) {
        await delay(null, 400);
        const customer = db.customers.find((item) => item.id === input.customerId);
        if (!customer)
            fail('NOT_FOUND', 'Ese cliente no existe.', 404);
        const note = input.note.trim();
        if (!note)
            fail('VALIDATION_ERROR', 'La nota no puede estar vacía.', 422);
        const created = {
            id: Math.max(0, ...db.customerNotes.map((item) => item.id)) + 1,
            customerId: input.customerId,
            authorId: null,
            authorName: input.authorName,
            note,
            createdAt: new Date().toISOString(),
        };
        db.customerNotes.push(created);
        return structuredClone(created);
    },
    /**
     * Registra una ficha de medidas nueva, tomada en el taller.
     *
     * Equivale a `sp_record_measurements`: el cliente nunca la edita desde su
     * cuenta (`MeasurementsPage` es de solo lectura), solo el personal que la toma.
     */
    async addMeasurementSet(input) {
        await delay(null, 600);
        const customer = db.customers.find((item) => item.id === input.customerId);
        if (!customer)
            fail('NOT_FOUND', 'Ese cliente no existe.', 404);
        if (input.values.length === 0) {
            fail('VALIDATION_ERROR', 'Registra al menos una medida.', 422);
        }
        let nextValueId = Math.max(0, ...db.measurementSets.flatMap((set) => set.values.map((value) => value.id))) + 1;
        const values = input.values.map((entry) => {
            const type = db.measurementTypes.find((item) => item.id === entry.measurementTypeId);
            if (!type)
                fail('VALIDATION_ERROR', 'Ese tipo de medida no existe.', 422);
            if (!isMeasurementValueValid(type.code, entry.valueCm)) {
                fail('VALIDATION_ERROR', `El valor de «${type.name}» está fuera de un rango razonable.`, 422);
            }
            return {
                id: nextValueId++,
                measurementTypeId: type.id,
                code: type.code,
                name: type.name,
                unit: type.unit,
                valueCm: entry.valueCm,
            };
        });
        const created = {
            id: Math.max(0, ...db.measurementSets.map((set) => set.id)) + 1,
            customerId: input.customerId,
            takenBy: input.takenBy,
            takenByName: input.takenByName,
            takenAt: new Date().toISOString(),
            note: input.note?.trim() || null,
            values,
        };
        db.measurementSets.push(created);
        return structuredClone(created);
    },
    /**
     * Corrige una ficha de medidas ya guardada. Antes, un valor mal anotado
     * obligaba a tomar una ficha nueva completa, dejando la incorrecta visible
     * para siempre en el historial del cliente.
     */
    async updateMeasurementSet(input) {
        await delay(null, 600);
        const set = db.measurementSets.find((item) => item.id === input.id && item.customerId === input.customerId);
        if (!set)
            fail('NOT_FOUND', 'Esa ficha de medidas no existe.', 404);
        if (input.values.length === 0) {
            fail('VALIDATION_ERROR', 'Registra al menos una medida.', 422);
        }
        let nextValueId = Math.max(0, ...db.measurementSets.flatMap((item) => item.values.map((value) => value.id))) + 1;
        const values = input.values.map((entry) => {
            const type = db.measurementTypes.find((item) => item.id === entry.measurementTypeId);
            if (!type)
                fail('VALIDATION_ERROR', 'Ese tipo de medida no existe.', 422);
            if (!isMeasurementValueValid(type.code, entry.valueCm)) {
                fail('VALIDATION_ERROR', `El valor de «${type.name}» está fuera de un rango razonable.`, 422);
            }
            const existing = set.values.find((value) => value.measurementTypeId === entry.measurementTypeId);
            return {
                id: existing?.id ?? nextValueId++,
                measurementTypeId: type.id,
                code: type.code,
                name: type.name,
                unit: type.unit,
                valueCm: entry.valueCm,
            };
        });
        set.takenBy = input.takenBy;
        set.takenByName = input.takenByName;
        set.note = input.note?.trim() || null;
        set.values = values;
        return structuredClone(set);
    },
    /**
     * Pedido tomado en el mostrador: cliente presente, sin pasar por el carrito
     * web. Equivale a `sp_checkout` pero disparado por el personal, no por el
     * cliente — por eso pide `createdByName` y no hay cupón ni canje de puntos.
     */
    async createOrder(input) {
        await delay(null, 900);
        const customer = db.customers.find((item) => item.id === input.customerId);
        if (!customer)
            fail('NOT_FOUND', 'Ese cliente no existe.', 404);
        if (input.items.length === 0) {
            fail('VALIDATION_ERROR', 'El pedido necesita al menos un artículo.', 422);
        }
        const subtotal = round2(input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
        const tax = round2(subtotal * TAX_RATE);
        const total = round2(subtotal + tax);
        const depositAmount = round2(input.depositAmount);
        if (depositAmount < 0 || depositAmount > total) {
            fail('VALIDATION_ERROR', 'El monto pagado no puede ser mayor que el total del pedido.', 422);
        }
        const nextOrderId = Math.max(0, ...db.orders.map((order) => order.id)) + 1;
        const sequence = String(1032 + db.orders.length).padStart(5, '0');
        const orderNumber = `RE-${new Date().getFullYear()}-${sequence}`;
        const now = new Date().toISOString();
        const balanceDue = round2(total - depositAmount);
        const hasMadeToMeasure = input.items.some((item) => item.itemType === 'made_to_measure');
        let nextItemId = Math.max(0, ...db.orders.flatMap((order) => order.items.map((item) => item.id))) + 1;
        let nextCustomizationId = Math.max(0, ...db.orders.flatMap((order) => order.items.flatMap((item) => item.customizations.map((c) => c.id)))) + 1;
        const items = input.items.map((item) => {
            const suitModel = item.suitModelId != null ? db.suitModels.find((model) => model.id === item.suitModelId) : undefined;
            const fabricRow = item.fabricId != null ? db.fabrics.find((row) => row.id === item.fabricId) : undefined;
            const productRow = item.productId != null ? db.products.find((row) => row.id === item.productId) : undefined;
            return {
                id: nextItemId++,
                orderId: nextOrderId,
                itemType: item.itemType,
                suitModelId: item.suitModelId ?? null,
                suitModelName: suitModel?.name ?? null,
                fabricId: item.fabricId ?? null,
                fabricName: fabricRow?.name ?? null,
                productId: item.productId ?? null,
                productName: productRow?.name ?? null,
                measurementSetId: item.measurementSetId ?? null,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: round2(item.unitPrice * item.quantity),
                imageUrl: suitModel?.primaryImage?.url ?? productRow?.primaryImage?.url ?? null,
                customizations: (item.customizations ?? []).map((customization) => ({
                    id: nextCustomizationId++,
                    ...customization,
                })),
            };
        });
        const paymentType = balanceDue > 0 ? 'anticipo' : 'saldo';
        const payments = depositAmount > 0
            ? [
                {
                    id: Math.max(0, ...db.orders.flatMap((order) => order.payments.map((p) => p.id))) + 1,
                    orderId: nextOrderId,
                    paymentMethodId: input.paymentMethodId,
                    paymentMethodName: input.paymentMethodName,
                    amount: depositAmount,
                    paymentType,
                    paidAt: now,
                    reference: null,
                },
            ]
            : [];
        const account = db.loyaltyAccounts.find((item) => item.customerId === input.customerId);
        const pointsEarned = db.loyaltySettings.isActive
            ? Math.floor(subtotal / db.loyaltySettings.earnRateQuetzalPerPoint)
            : 0;
        if (account && pointsEarned > 0) {
            account.pointsBalance += pointsEarned;
            account.pointsLifetime += pointsEarned;
            account.updatedAt = now;
            db.loyaltyMovements.push({
                id: Math.max(0, ...db.loyaltyMovements.map((movement) => movement.id)) + 1,
                customerId: input.customerId,
                orderId: nextOrderId,
                orderNumber,
                type: 'earned',
                points: pointsEarned,
                note: 'Pedido de mostrador.',
                createdAt: now,
            });
        }
        const order = {
            id: nextOrderId,
            customerId: input.customerId,
            customerName: `${customer.firstName} ${customer.lastName}`,
            orderNumber,
            statusCode: 'confirmed',
            statusName: ORDER_STATUS_LABELS.confirmed,
            quoteId: null,
            couponCode: null,
            deliveryAddress: null,
            subtotal,
            discountAmount: 0,
            tax,
            total,
            depositPaid: depositAmount,
            balanceDue,
            promisedDate: hasMadeToMeasure ? dateOnlyFromNow(28) : dateOnlyFromNow(3),
            createdAt: now,
            updatedAt: now,
            items,
            payments,
            history: [
                {
                    id: Math.max(0, ...db.orders.flatMap((o) => o.history.map((h) => h.id))) + 1,
                    statusCode: 'confirmed',
                    statusName: ORDER_STATUS_LABELS.confirmed,
                    changedBy: null,
                    changedByName: input.createdByName,
                    changedAt: now,
                    note: input.note?.trim()
                        ? `Pedido creado en mostrador. ${input.note.trim()}`
                        : 'Pedido creado en mostrador.',
                },
            ],
            pointsEarned,
            pointsRedeemed: 0,
            pointsDiscount: 0,
        };
        db.orders.push(order);
        // Un traje a medida entra al tablero del taller de una vez, en corte.
        if (hasMadeToMeasure) {
            db.workOrders.push({
                id: Math.max(0, ...db.workOrders.map((wo) => wo.id)) + 1,
                orderId: nextOrderId,
                orderNumber,
                customerName: order.customerName,
                assignedTailorId: null,
                assignedTailorName: null,
                stageCode: 'corte',
                stageName: PRODUCTION_STAGE_LABELS.corte,
                startedAt: now,
                dueAt: isoDaysFromNow(21),
                completedAt: null,
                note: input.note?.trim() || null,
            });
        }
        return structuredClone(order);
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
    loyalty,
    admin,
};
//# sourceMappingURL=mock.js.map