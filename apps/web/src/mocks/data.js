import { placeholderImage } from './placeholder';
// ── Utilidades ─────────────────────────────────────────────────────────────
let imageSeq = 1;
/**
 * Fotos reales del taller: se colocan en `apps/web/public/images/` y se
 * referencian aquí por nombre de archivo. Vite las sirve tal cual desde `/images/…`.
 * Si un modelo/tela/producto no tiene fotos propias todavía, se usa el
 * placeholder SVG de marca mientras tanto.
 */
function localImage(fileName) {
    return `/images/${fileName}`;
}
function gallery(label, options = {}) {
    const { count = 2, tint, motif = 'suit', photos = [] } = options;
    const width = motif === 'swatch' ? 800 : 900;
    const height = motif === 'swatch' ? 800 : 1200;
    return Array.from({ length: count }, (_, index) => {
        const id = imageSeq++;
        const fileName = photos[index];
        const url = fileName
            ? localImage(fileName)
            : placeholderImage({
                label: index === 0 ? label : `${label} · ${index + 1}`,
                tint,
                motif,
                width,
                height,
            });
        return {
            id,
            mediaAssetId: id,
            url,
            altText: `${label} — vista ${index + 1}`,
            sortOrder: index,
            isPrimary: index === 0,
            // En los mocks las tres variantes comparten archivo; el `srcset` real
            // llegará con `sharp` en el backend.
            variants: [
                { variant: 'thumbnail', url, width: 400 },
                { variant: 'card', url, width: 800 },
                { variant: 'full', url, width: 1600 },
            ],
        };
    });
}
/** Fecha relativa a hoy, en ISO — mantiene la demo siempre «viva». */
function daysFromNow(days, hour = 10, minute = 0) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
}
function dateOnly(days) {
    return daysFromNow(days).slice(0, 10);
}
// ── Catálogo: estilos y modelos ────────────────────────────────────────────
export const suitStyles = [
    { id: 1, name: 'Clásico', slug: 'clasico' },
    { id: 2, name: 'Cruzado', slug: 'cruzado' },
    { id: 3, name: 'Esmoquin', slug: 'esmoquin' },
    { id: 4, name: 'Entallado', slug: 'entallado' },
    { id: 5, name: 'Tres piezas', slug: 'tres-piezas' },
];
function suit(id, styleId, code, name, basePrice, description, tint, photos) {
    const images = gallery(name, { count: 3, tint, photos });
    return {
        id,
        styleId,
        styleName: suitStyles.find((style) => style.id === styleId)?.name ?? '',
        code,
        name,
        description,
        basePrice,
        isActive: true,
        sortOrder: id,
        images,
        primaryImage: images[0] ?? null,
    };
}
export const suitModels = [
    suit(1, 1, 'RE-CL-001', 'Traje Windsor', 5400, 'Dos botones, solapa de muesca y hombro natural. El traje que resuelve una oficina, una boda y una cena sin cambiar de registro.', '#1D1912', ['fotodueño3.png']),
    suit(2, 2, 'RE-CR-002', 'Cruzado Príncipe de Gales', 7200, 'Seis botones sobre dos, solapa de pico y talle marcado. Un dibujo de cuadro discreto que se agradece de cerca.', '#211C14', ['fotodeueño.png']),
    suit(3, 3, 'RE-ES-003', 'Esmoquin Medianoche', 8900, 'Lana azul medianoche con solapa chal en seda. Bajo luz artificial se lee más negro que el negro.', '#12131C', ['tuprimertrajebienconfeccionado.png']),
    suit(4, 4, 'RE-EN-004', 'Entallado Milano', 5900, 'Corte alto de sisa, cintura ceñida y pantalón sin pinzas. Silueta italiana para figuras esbeltas.', '#1A1710', ['entalledeunsaco.png']),
    suit(5, 5, 'RE-TP-005', 'Tres Piezas Regente', 8400, 'Chaleco de seis botones a juego, espalda de raso y solapa de pico. La opción cuando la ocasión pide chaqueta abierta.', '#1C1811', ['coloresdetraje.png']),
    suit(6, 1, 'RE-CL-006', 'Traje Sabbatini', 6100, 'Lana fría de gramaje ligero, media forrería y hombro sin hombrera. Pensado para el calor del trópico.', '#1E1B15', ['fotodueño2.png']),
    suit(7, 4, 'RE-EN-007', 'Entallado Grafito', 5700, 'Gris grafito liso, un botón y bolsillos de ribete. El más sobrio del taller, y el más difícil de coser.', '#171614', ['telaazulconocinta.png']),
    suit(8, 2, 'RE-CR-008', 'Cruzado Espiga', 7600, 'Espiga ancha tejida en telar de lanzadera. Cae con peso y envejece bien.', '#20190F', ['telatijerasycinta.png']),
];
// ── Catálogo: telas ────────────────────────────────────────────────────────
export const fabricCategories = [
    { id: 1, name: 'Lana', slug: 'lana' },
    { id: 2, name: 'Lino', slug: 'lino' },
    { id: 3, name: 'Tweed', slug: 'tweed' },
    { id: 4, name: 'Seda y mezclas', slug: 'seda' },
];
function fabric(id, categoryId, code, name, composition, colorHex, pricePerMeter, stockMeters, photos) {
    const images = gallery(name, { count: 1, tint: colorHex, motif: 'swatch', photos });
    return {
        id,
        categoryId,
        categoryName: fabricCategories.find((category) => category.id === categoryId)?.name ?? '',
        code,
        name,
        composition,
        colorHex,
        pricePerMeter,
        stockMeters,
        isActive: true,
        images,
        primaryImage: images[0] ?? null,
    };
}
export const fabrics = [
    fabric(1, 1, 'LN-S110-NG', 'Súper 110 Negro', '100 % lana virgen', '#14120F', 420, 68, ['telatijerasycinta.png']),
    fabric(2, 1, 'LN-S130-AZ', 'Súper 130 Azul noche', '100 % lana virgen', '#171C2A', 560, 42, ['telaazulconocinta.png']),
    fabric(3, 1, 'LN-S120-GR', 'Súper 120 Gris humo', '100 % lana virgen', '#2A2926', 480, 55, ['telatijerasycinta.png']),
    fabric(4, 1, 'LN-PDG-CF', 'Príncipe de Gales café', '95 % lana, 5 % seda', '#2C2318', 640, 24, ['coloresdetraje.png']),
    fabric(5, 2, 'LI-IR-ARE', 'Lino irlandés arena', '100 % lino', '#5C513C', 380, 36, ['entalledeunsaco.png']),
    fabric(6, 2, 'LI-MZ-BLC', 'Lino mezcla blanco hueso', '55 % lino, 45 % algodón', '#6B6350', 340, 18, ['telaazulconocinta.png']),
    fabric(7, 3, 'TW-DN-VRD', 'Tweed Donegal verde', '100 % lana Donegal', '#28301F', 590, 12, ['telatijerasycinta.png']),
    fabric(8, 3, 'TW-ESP-GR', 'Espiga gris carbón', '100 % lana', '#232323', 520, 31, ['coloresdetraje.png']),
    fabric(9, 4, 'SD-BAR-NG', 'Barathea negro seda', '70 % lana, 30 % seda', '#100F10', 780, 9, ['telaazulconocinta.png']),
    fabric(10, 4, 'SD-MOH-AZ', 'Mohair azul medianoche', '60 % lana, 40 % mohair', '#141A2B', 860, 6, ['telatijerasycinta.png']),
];
// ── Catálogo: opciones de personalización ──────────────────────────────────
export const optionGroups = [
    {
        id: 1,
        name: 'Solapa',
        slug: 'solapa',
        description: 'Define el carácter de la chaqueta. La de pico estiliza; la de muesca es atemporal.',
        isRequired: true,
        sortOrder: 1,
        values: [
            { id: 101, optionGroupId: 1, name: 'De muesca', description: 'La clásica, para todo uso', priceDelta: 0, sortOrder: 1, isActive: true },
            { id: 102, optionGroupId: 1, name: 'De pico', description: 'Alarga la figura, ideal en cruzados', priceDelta: 350, sortOrder: 2, isActive: true },
            { id: 103, optionGroupId: 1, name: 'Chal', description: 'Reservada al esmoquin', priceDelta: 480, sortOrder: 3, isActive: true },
        ],
    },
    {
        id: 2,
        name: 'Forro',
        slug: 'forro',
        description: 'Lo que nadie ve, y lo primero que se nota al ponerlo.',
        isRequired: true,
        sortOrder: 2,
        values: [
            { id: 201, optionGroupId: 2, name: 'Viscosa lisa', description: 'Ligera y transpirable', priceDelta: 0, sortOrder: 1, isActive: true },
            { id: 202, optionGroupId: 2, name: 'Cupro estampado', description: 'Estampado a elegir del muestrario', priceDelta: 420, sortOrder: 2, isActive: true },
            { id: 203, optionGroupId: 2, name: 'Seda natural', description: 'La opción del esmoquin', priceDelta: 890, sortOrder: 3, isActive: true },
            { id: 204, optionGroupId: 2, name: 'Media forrería', description: 'Solo espalda alta — para el calor', priceDelta: -180, sortOrder: 4, isActive: true },
        ],
    },
    {
        id: 3,
        name: 'Botones',
        slug: 'botones',
        isRequired: true,
        description: null,
        sortOrder: 3,
        values: [
            { id: 301, optionGroupId: 3, name: 'Corozo mate', description: 'Marfil vegetal, el estándar del taller', priceDelta: 0, sortOrder: 1, isActive: true },
            { id: 302, optionGroupId: 3, name: 'Cuerno pulido', description: 'Veta única en cada pieza', priceDelta: 260, sortOrder: 2, isActive: true },
            { id: 303, optionGroupId: 3, name: 'Nácar', description: 'Para esmoquin y chalecos', priceDelta: 540, sortOrder: 3, isActive: true },
        ],
    },
    {
        id: 4,
        name: 'Aberturas',
        slug: 'aberturas',
        description: 'Cómo cae la chaqueta al sentarse y al meter la mano en el bolsillo.',
        isRequired: true,
        sortOrder: 4,
        values: [
            { id: 401, optionGroupId: 4, name: 'Dos laterales', description: 'Corte inglés, el más versátil', priceDelta: 0, sortOrder: 1, isActive: true },
            { id: 402, optionGroupId: 4, name: 'Central', description: 'Corte americano', priceDelta: 0, sortOrder: 2, isActive: true },
            { id: 403, optionGroupId: 4, name: 'Sin abertura', description: 'Línea italiana y esmoquin', priceDelta: 0, sortOrder: 3, isActive: true },
        ],
    },
    {
        id: 5,
        name: 'Puños',
        slug: 'punos',
        description: null,
        isRequired: false,
        sortOrder: 5,
        values: [
            { id: 501, optionGroupId: 5, name: 'Botones simulados', description: 'Cosidos sobre la manga', priceDelta: 0, sortOrder: 1, isActive: true },
            { id: 502, optionGroupId: 5, name: 'Ojal funcional', description: 'Se abren de verdad — «puño de cirujano»', priceDelta: 380, sortOrder: 2, isActive: true },
            { id: 503, optionGroupId: 5, name: 'Ojal en contraste', description: 'Último ojal en hilo de color', priceDelta: 450, sortOrder: 3, isActive: true },
        ],
    },
    {
        id: 6,
        name: 'Monograma',
        slug: 'monograma',
        description: 'Iniciales bordadas en el forro interior, a la altura del corazón.',
        isRequired: false,
        sortOrder: 6,
        values: [
            { id: 601, optionGroupId: 6, name: 'Sin monograma', description: null, priceDelta: 0, sortOrder: 1, isActive: true },
            { id: 602, optionGroupId: 6, name: 'Iniciales en hilo dorado', description: 'Hasta 3 caracteres', priceDelta: 320, sortOrder: 2, isActive: true },
        ],
    },
];
// ── Catálogo: accesorios listos para llevar ────────────────────────────────
export const productCategories = [
    { id: 1, name: 'Corbatas', slug: 'corbatas' },
    { id: 2, name: 'Pañuelos', slug: 'panuelos' },
    { id: 3, name: 'Camisas', slug: 'camisas' },
    { id: 4, name: 'Complementos', slug: 'complementos' },
];
function product(id, categoryId, sku, name, price, stock, description, tint, photos) {
    const images = gallery(name, { count: 2, tint, motif: 'accessory', photos });
    return {
        id,
        categoryId,
        categoryName: productCategories.find((category) => category.id === categoryId)?.name ?? '',
        sku,
        name,
        description,
        price,
        stock,
        isActive: true,
        images,
        primaryImage: images[0] ?? null,
    };
}
export const products = [
    product(1, 1, 'CB-SD-001', 'Corbata de seda granadina', 480, 24, 'Tejida en Como, nudo firme y caída limpia.', '#2A1B1B', ['fotodueño2.png']),
    product(2, 1, 'CB-LN-002', 'Corbata de lana espigada', 420, 16, 'Para el invierno y los trajes de tweed.', '#2A2620', ['entalledeunsaco.png']),
    product(3, 2, 'PN-SD-003', 'Pañuelo de bolsillo marfil', 260, 40, 'Dobladillo cosido a mano, 33 × 33 cm.', '#3A352A', ['tuprimertrajebienconfeccionado.png']),
    product(4, 2, 'PN-LI-004', 'Pañuelo de lino blanco', 210, 52, 'El que siempre funciona, con doblez recto.', '#3D3A31', ['telaazulconocinta.png']),
    product(5, 3, 'CM-AL-005', 'Camisa de algodón egipcio', 890, 18, 'Popelín de dos cabos, cuello semiitaliano.', '#26282C', ['fotodeueño.png']),
    product(6, 3, 'CM-OX-006', 'Camisa Oxford azul', 760, 22, 'Tejido rústico, cuello con botones.', '#1E2735', ['fotodueño3.png']),
    product(7, 4, 'CP-GM-007', 'Gemelos de nácar y plata', 640, 9, 'Cierre basculante, presentados en estuche.', '#2C2A24', ['fotodueño2.png']),
    product(8, 4, 'CP-TR-008', 'Tirantes de cuero y algodón', 520, 14, 'Pinzas de botón, ajuste de latón envejecido.', '#241C15', ['coloresdetraje.png']),
];
// ── Cupones ────────────────────────────────────────────────────────────────
export const coupons = [
    {
        id: 1,
        code: 'PRIMERTRAJE',
        type: 'percent',
        value: 10,
        minSubtotal: 3000,
        validUntil: dateOnly(120),
        usageLimit: 100,
        timesUsed: 12,
        isActive: true,
    },
    {
        id: 2,
        code: 'ELEGANCIA500',
        type: 'fixed',
        value: 500,
        minSubtotal: 6000,
        validUntil: dateOnly(45),
        usageLimit: 50,
        timesUsed: 3,
        isActive: true,
    },
    {
        id: 3,
        code: 'VERANO2025',
        type: 'percent',
        value: 15,
        minSubtotal: 2000,
        validUntil: dateOnly(-30),
        usageLimit: 200,
        timesUsed: 187,
        isActive: false,
    },
];
// ── Personas ───────────────────────────────────────────────────────────────
export const staff = [
    {
        id: 1,
        userId: 2,
        firstName: 'Marta',
        lastName: 'Quiñónez',
        email: 'marta@realelegance.com',
        specialty: 'Maestra cortadora',
        isAvailable: true,
        hireDate: '2014-03-01',
    },
    {
        id: 2,
        userId: 3,
        firstName: 'Julián',
        lastName: 'Estrada',
        email: 'julian@realelegance.com',
        specialty: 'Sastre de chaqueta',
        isAvailable: true,
        hireDate: '2018-09-15',
    },
    {
        id: 3,
        userId: 4,
        firstName: 'Rosa',
        lastName: 'Chacón',
        email: 'rosa@realelegance.com',
        specialty: 'Pantalón y chaleco',
        isAvailable: false,
        hireDate: '2021-01-20',
    },
];
export const customers = [
    {
        id: 1,
        userId: 5,
        firstName: 'Henry',
        lastName: 'Tercero',
        email: 'cliente@realelegance.com',
        phone: '+502 5555 1234',
        createdAt: daysFromNow(-210),
    },
    {
        id: 2,
        userId: 6,
        firstName: 'Andrea',
        lastName: 'Solís',
        email: 'andrea@ejemplo.com',
        phone: '+502 5555 8899',
        createdAt: daysFromNow(-95),
    },
    {
        id: 3,
        userId: 7,
        firstName: 'Diego',
        lastName: 'Ramírez',
        email: 'diego@ejemplo.com',
        phone: '+502 5555 4477',
        createdAt: daysFromNow(-40),
    },
];
// ── Direcciones ────────────────────────────────────────────────────────────
/** Se llena en cuanto un cliente hace su primer checkout con entrega. */
export const addresses = [];
// ── Notas de mostrador ─────────────────────────────────────────────────────
export const customerNotes = [
    {
        id: 1,
        customerId: 1,
        authorId: 1,
        authorName: 'Marta Quiñónez',
        note: 'Prefiere hombro natural, sin hombrera — lo pidió expresamente en su primer traje.',
        createdAt: daysFromNow(-140, 11, 40),
    },
    {
        id: 2,
        customerId: 1,
        authorId: 2,
        authorName: 'Julián Estrada',
        note: 'Cliente frecuente, siempre puntual a las pruebas. Buen candidato para telas nuevas de temporada.',
        createdAt: daysFromNow(-20, 9),
    },
    {
        id: 3,
        customerId: 2,
        authorId: 1,
        authorName: 'Marta Quiñónez',
        note: 'Boda en diciembre — confirmar fecha de entrega con holgura de dos semanas.',
        createdAt: daysFromNow(-26, 14, 15),
    },
];
// ── Medidas ────────────────────────────────────────────────────────────────
export const measurementTypes = [
    { id: 1, code: 'pecho', name: 'Contorno de pecho', unit: 'cm', sortOrder: 1 },
    { id: 2, code: 'cintura', name: 'Cintura', unit: 'cm', sortOrder: 2 },
    { id: 3, code: 'cadera', name: 'Cadera', unit: 'cm', sortOrder: 3 },
    { id: 4, code: 'hombro', name: 'Ancho de hombro', unit: 'cm', sortOrder: 4 },
    { id: 5, code: 'manga', name: 'Largo de manga', unit: 'cm', sortOrder: 5 },
    { id: 6, code: 'espalda', name: 'Largo de espalda', unit: 'cm', sortOrder: 6 },
    { id: 7, code: 'cuello', name: 'Cuello', unit: 'cm', sortOrder: 7 },
    { id: 8, code: 'entrepierna', name: 'Entrepierna', unit: 'cm', sortOrder: 8 },
];
export const measurementSets = [
    {
        id: 1,
        customerId: 1,
        takenBy: 1,
        takenByName: 'Marta Quiñónez',
        takenAt: daysFromNow(-38, 11),
        note: 'Hombro derecho ligeramente más bajo — compensar 0.8 cm.',
        values: [
            { id: 1, measurementTypeId: 1, code: 'pecho', name: 'Contorno de pecho', unit: 'cm', valueCm: 102 },
            { id: 2, measurementTypeId: 2, code: 'cintura', name: 'Cintura', unit: 'cm', valueCm: 89 },
            { id: 3, measurementTypeId: 3, code: 'cadera', name: 'Cadera', unit: 'cm', valueCm: 101 },
            { id: 4, measurementTypeId: 4, code: 'hombro', name: 'Ancho de hombro', unit: 'cm', valueCm: 46.5 },
            { id: 5, measurementTypeId: 5, code: 'manga', name: 'Largo de manga', unit: 'cm', valueCm: 64 },
            { id: 6, measurementTypeId: 6, code: 'espalda', name: 'Largo de espalda', unit: 'cm', valueCm: 74.5 },
            { id: 7, measurementTypeId: 7, code: 'cuello', name: 'Cuello', unit: 'cm', valueCm: 40 },
            { id: 8, measurementTypeId: 8, code: 'entrepierna', name: 'Entrepierna', unit: 'cm', valueCm: 82 },
        ],
    },
];
// ── Pedidos ────────────────────────────────────────────────────────────────
export const orders = [
    {
        id: 1,
        customerId: 1,
        customerName: 'Henry Tercero',
        orderNumber: 'RE-2026-01024',
        statusCode: 'in_production',
        statusName: 'En confección',
        quoteId: null,
        couponCode: 'PRIMERTRAJE',
        deliveryAddress: null,
        subtotal: 7830,
        discountAmount: 783,
        tax: 845.64,
        total: 7892.64,
        depositPaid: 3946.32,
        balanceDue: 3946.32,
        // (7830 - 783) / 10 = 704.7 → floor
        pointsEarned: 704,
        pointsRedeemed: 0,
        pointsDiscount: 0,
        promisedDate: dateOnly(18),
        createdAt: daysFromNow(-32, 16, 20),
        updatedAt: daysFromNow(-3, 9, 15),
        items: [
            {
                id: 1,
                orderId: 1,
                itemType: 'made_to_measure',
                suitModelId: 2,
                suitModelName: 'Cruzado Príncipe de Gales',
                fabricId: 4,
                fabricName: 'Príncipe de Gales café',
                productId: null,
                productName: null,
                measurementSetId: 1,
                quantity: 1,
                unitPrice: 7350,
                lineTotal: 7350,
                imageUrl: suitModels[1]?.primaryImage?.url ?? null,
                customizations: [
                    { id: 1, optionValueId: 102, groupName: 'Solapa', optionName: 'De pico', priceDelta: 350 },
                    { id: 2, optionValueId: 202, groupName: 'Forro', optionName: 'Cupro estampado', priceDelta: 420 },
                    { id: 3, optionValueId: 302, groupName: 'Botones', optionName: 'Cuerno pulido', priceDelta: 260 },
                    { id: 4, optionValueId: 401, groupName: 'Aberturas', optionName: 'Dos laterales', priceDelta: 0 },
                    { id: 5, optionValueId: 502, groupName: 'Puños', optionName: 'Ojal funcional', priceDelta: 380 },
                ],
            },
            {
                id: 2,
                orderId: 1,
                itemType: 'ready_to_wear',
                suitModelId: null,
                suitModelName: null,
                fabricId: null,
                fabricName: null,
                productId: 1,
                productName: 'Corbata de seda granadina',
                measurementSetId: null,
                quantity: 1,
                unitPrice: 480,
                lineTotal: 480,
                imageUrl: products[0]?.primaryImage?.url ?? null,
                customizations: [],
            },
        ],
        payments: [
            {
                id: 1,
                orderId: 1,
                paymentMethodId: 2,
                paymentMethodName: 'Tarjeta de crédito',
                amount: 3946.32,
                paymentType: 'anticipo',
                paidAt: daysFromNow(-32, 16, 22),
                reference: 'TRX-8841-2026',
            },
        ],
        history: [
            { id: 1, statusCode: 'confirmed', statusName: 'Confirmado', changedBy: null, changedByName: 'Sistema', changedAt: daysFromNow(-32, 16, 22), note: 'Anticipo del 50 % recibido.' },
            { id: 2, statusCode: 'in_production', statusName: 'En confección', changedBy: 1, changedByName: 'Marta Quiñónez', changedAt: daysFromNow(-24, 8, 40), note: 'Corte terminado, pasa a confección.' },
        ],
    },
    {
        id: 2,
        customerId: 1,
        customerName: 'Henry Tercero',
        orderNumber: 'RE-2025-00871',
        statusCode: 'delivered',
        statusName: 'Entregado',
        quoteId: null,
        couponCode: null,
        deliveryAddress: null,
        subtotal: 5400,
        discountAmount: 0,
        tax: 648,
        total: 6048,
        depositPaid: 6048,
        balanceDue: 0,
        // 5400 / 10 = 540
        pointsEarned: 540,
        pointsRedeemed: 0,
        pointsDiscount: 0,
        promisedDate: dateOnly(-95),
        createdAt: daysFromNow(-140, 11),
        updatedAt: daysFromNow(-94, 17),
        items: [
            {
                id: 3,
                orderId: 2,
                itemType: 'made_to_measure',
                suitModelId: 1,
                suitModelName: 'Traje Windsor',
                fabricId: 1,
                fabricName: 'Súper 110 Negro',
                productId: null,
                productName: null,
                measurementSetId: 1,
                quantity: 1,
                unitPrice: 5400,
                lineTotal: 5400,
                imageUrl: suitModels[0]?.primaryImage?.url ?? null,
                customizations: [
                    { id: 6, optionValueId: 101, groupName: 'Solapa', optionName: 'De muesca', priceDelta: 0 },
                    { id: 7, optionValueId: 201, groupName: 'Forro', optionName: 'Viscosa lisa', priceDelta: 0 },
                ],
            },
        ],
        payments: [
            { id: 2, orderId: 2, paymentMethodId: 1, paymentMethodName: 'Efectivo', amount: 3024, paymentType: 'anticipo', paidAt: daysFromNow(-140, 11, 30), reference: null },
            { id: 3, orderId: 2, paymentMethodId: 2, paymentMethodName: 'Tarjeta de crédito', amount: 3024, paymentType: 'saldo', paidAt: daysFromNow(-94, 17), reference: 'TRX-5510-2025' },
        ],
        history: [
            { id: 3, statusCode: 'confirmed', statusName: 'Confirmado', changedBy: null, changedByName: 'Sistema', changedAt: daysFromNow(-140, 11, 30), note: null },
            { id: 4, statusCode: 'delivered', statusName: 'Entregado', changedBy: 2, changedByName: 'Julián Estrada', changedAt: daysFromNow(-94, 17), note: 'Entregado en taller. Cliente conforme.' },
        ],
    },
    {
        id: 3,
        customerId: 2,
        customerName: 'Andrea Solís',
        orderNumber: 'RE-2026-01031',
        statusCode: 'fitting',
        statusName: 'Prueba y ajustes',
        quoteId: null,
        couponCode: null,
        deliveryAddress: null,
        subtotal: 8900,
        discountAmount: 0,
        tax: 1068,
        total: 9968,
        depositPaid: 4984,
        balanceDue: 4984,
        // 8900 / 10 = 890
        pointsEarned: 890,
        pointsRedeemed: 0,
        pointsDiscount: 0,
        promisedDate: dateOnly(9),
        createdAt: daysFromNow(-26, 14),
        updatedAt: daysFromNow(-1, 10),
        items: [
            {
                id: 4,
                orderId: 3,
                itemType: 'made_to_measure',
                suitModelId: 3,
                suitModelName: 'Esmoquin Medianoche',
                fabricId: 9,
                fabricName: 'Barathea negro seda',
                productId: null,
                productName: null,
                measurementSetId: null,
                quantity: 1,
                unitPrice: 8900,
                lineTotal: 8900,
                imageUrl: suitModels[2]?.primaryImage?.url ?? null,
                customizations: [
                    { id: 8, optionValueId: 103, groupName: 'Solapa', optionName: 'Chal', priceDelta: 480 },
                    { id: 9, optionValueId: 203, groupName: 'Forro', optionName: 'Seda natural', priceDelta: 890 },
                ],
            },
        ],
        payments: [
            { id: 4, orderId: 3, paymentMethodId: 3, paymentMethodName: 'Transferencia bancaria', amount: 4984, paymentType: 'anticipo', paidAt: daysFromNow(-26, 14, 10), reference: 'TRF-2026-0091' },
        ],
        history: [
            { id: 5, statusCode: 'confirmed', statusName: 'Confirmado', changedBy: null, changedByName: 'Sistema', changedAt: daysFromNow(-26, 14, 10), note: null },
            { id: 6, statusCode: 'in_production', statusName: 'En confección', changedBy: 1, changedByName: 'Marta Quiñónez', changedAt: daysFromNow(-18, 9), note: null },
            { id: 7, statusCode: 'fitting', statusName: 'Prueba y ajustes', changedBy: 2, changedByName: 'Julián Estrada', changedAt: daysFromNow(-1, 10), note: 'Primera prueba agendada.' },
        ],
    },
];
// ── Fidelización ───────────────────────────────────────────────────────────
// El valor del punto lo ajusta el administrador desde `/admin/fidelizacion`
// (mutable a propósito, como `workOrders`: el mock API lo modifica en sitio).
export const loyaltySettings = {
    earnRateQuetzalPerPoint: 10,
    redemptionValueQuetzalPerPoint: 0.05,
    isActive: true,
    updatedAt: daysFromNow(-10, 9),
};
export const loyaltyAccounts = [
    {
        customerId: 1,
        customerName: 'Henry Tercero',
        customerEmail: 'cliente@realelegance.com',
        pointsBalance: 844,
        pointsLifetime: 1244,
        updatedAt: daysFromNow(-3, 9, 15),
    },
    {
        customerId: 2,
        customerName: 'Andrea Solís',
        customerEmail: 'andrea@ejemplo.com',
        pointsBalance: 890,
        pointsLifetime: 890,
        updatedAt: daysFromNow(-26, 14, 10),
    },
    {
        customerId: 3,
        customerName: 'Diego Ramírez',
        customerEmail: 'diego@ejemplo.com',
        pointsBalance: 0,
        pointsLifetime: 0,
        updatedAt: daysFromNow(-40),
    },
];
/** `points` va con signo: positivo suma al saldo, negativo resta. */
export const loyaltyMovements = [
    {
        id: 1,
        customerId: 1,
        orderId: 1,
        orderNumber: 'RE-2026-01024',
        type: 'earned',
        points: 704,
        note: null,
        createdAt: daysFromNow(-32, 16, 22),
    },
    {
        id: 2,
        customerId: 1,
        orderId: 2,
        orderNumber: 'RE-2025-00871',
        type: 'earned',
        points: 540,
        note: null,
        createdAt: daysFromNow(-140, 11, 30),
    },
    {
        id: 3,
        customerId: 1,
        orderId: null,
        orderNumber: null,
        type: 'redeemed',
        points: -400,
        note: 'Canjeados como descuento en el mostrador.',
        createdAt: daysFromNow(-60, 12),
    },
    {
        id: 4,
        customerId: 2,
        orderId: 3,
        orderNumber: 'RE-2026-01031',
        type: 'earned',
        points: 890,
        note: null,
        createdAt: daysFromNow(-26, 14, 10),
    },
];
// ── Órdenes de trabajo (tablero del taller) ────────────────────────────────
export const workOrders = [
    {
        id: 1,
        orderId: 1,
        orderNumber: 'RE-2026-01024',
        customerName: 'Henry Tercero',
        assignedTailorId: 2,
        assignedTailorName: 'Julián Estrada',
        stageCode: 'confeccion',
        stageName: 'Confección',
        startedAt: daysFromNow(-24, 8, 40),
        dueAt: daysFromNow(6, 18),
        completedAt: null,
        note: 'Cruzado con puño funcional — reservar 2 h extra de ojal.',
    },
    {
        id: 2,
        orderId: 3,
        orderNumber: 'RE-2026-01031',
        customerName: 'Andrea Solís',
        assignedTailorId: 2,
        assignedTailorName: 'Julián Estrada',
        stageCode: 'prueba',
        stageName: 'Prueba',
        startedAt: daysFromNow(-1, 10),
        dueAt: daysFromNow(3, 18),
        completedAt: null,
        note: 'Solapa chal: revisar caída en la primera prueba.',
    },
    {
        id: 3,
        orderId: 3,
        orderNumber: 'RE-2026-01031',
        customerName: 'Andrea Solís',
        assignedTailorId: null,
        assignedTailorName: null,
        stageCode: 'ajustes',
        stageName: 'Ajustes',
        startedAt: null,
        dueAt: daysFromNow(7, 18),
        completedAt: null,
        note: null,
    },
    {
        id: 4,
        orderId: 1,
        orderNumber: 'RE-2026-01024',
        customerName: 'Henry Tercero',
        assignedTailorId: 1,
        assignedTailorName: 'Marta Quiñónez',
        stageCode: 'corte',
        stageName: 'Corte',
        startedAt: daysFromNow(-30, 8),
        dueAt: daysFromNow(-25, 18),
        completedAt: daysFromNow(-24, 8, 30),
        note: null,
    },
];
// ── Citas ──────────────────────────────────────────────────────────────────
export const appointments = [
    {
        id: 1,
        customerId: 1,
        customerName: 'Henry Tercero',
        staffId: 1,
        staffName: 'Marta Quiñónez',
        appointmentTypeId: 2,
        appointmentTypeCode: 'prueba',
        appointmentTypeName: 'Prueba de traje',
        orderId: 1,
        orderNumber: 'RE-2026-01024',
        scheduledAt: daysFromNow(4, 10, 30),
        durationMin: 45,
        status: 'scheduled',
        note: 'Primera prueba del cruzado.',
    },
    {
        id: 2,
        customerId: 2,
        customerName: 'Andrea Solís',
        staffId: 2,
        staffName: 'Julián Estrada',
        appointmentTypeId: 2,
        appointmentTypeCode: 'prueba',
        appointmentTypeName: 'Prueba de traje',
        orderId: 3,
        orderNumber: 'RE-2026-01031',
        scheduledAt: daysFromNow(1, 16, 0),
        durationMin: 45,
        status: 'scheduled',
        note: null,
    },
    {
        id: 3,
        customerId: 3,
        customerName: 'Diego Ramírez',
        staffId: 1,
        staffName: 'Marta Quiñónez',
        appointmentTypeId: 1,
        appointmentTypeCode: 'medidas',
        appointmentTypeName: 'Toma de medidas',
        orderId: null,
        orderNumber: null,
        scheduledAt: daysFromNow(0, 15, 0),
        durationMin: 60,
        status: 'scheduled',
        note: 'Cliente nuevo — traje de graduación.',
    },
    {
        id: 4,
        customerId: 1,
        customerName: 'Henry Tercero',
        staffId: 1,
        staffName: 'Marta Quiñónez',
        appointmentTypeId: 1,
        appointmentTypeCode: 'medidas',
        appointmentTypeName: 'Toma de medidas',
        orderId: 1,
        orderNumber: 'RE-2026-01024',
        scheduledAt: daysFromNow(-38, 11, 0),
        durationMin: 60,
        status: 'completed',
        note: null,
    },
];
// ── Métricas del back-office ───────────────────────────────────────────────
export const dashboardStats = {
    openOrders: 14,
    ordersInProduction: 8,
    appointmentsToday: 3,
    revenueThisMonth: 68420,
    pendingBalance: 23890,
    lowStockFabrics: 3,
    lowStockProducts: 2,
};
//# sourceMappingURL=data.js.map