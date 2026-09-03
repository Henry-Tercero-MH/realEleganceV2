import { describe, expect, it } from 'vitest';
import type { Fabric, OptionGroup, SuitModel } from '@real-elegance/shared';
import {
  DEFAULT_LOYALTY_SETTINGS,
  METERS_PER_SUIT,
  calculateTotals,
  describeOptions,
  lineTotal,
  maxRedeemablePoints,
  pointsToCurrency,
  priceMadeToMeasure,
} from './pricing';
import type { CartLine, CartState } from './types';

const model: SuitModel = {
  id: 1,
  styleId: 1,
  styleName: 'Clásico',
  code: 'CL-001',
  name: 'Traje clásico',
  description: null,
  basePrice: 2000,
  isActive: true,
  sortOrder: 1,
  images: [],
  primaryImage: null,
};

const fabric: Fabric = {
  id: 1,
  categoryId: 1,
  categoryName: 'Lana',
  code: 'LN-001',
  name: 'Súper 110 Negro',
  composition: null,
  colorHex: '#14120F',
  pricePerMeter: 100,
  stockMeters: 50,
  isActive: true,
  images: [],
  primaryImage: null,
};

const optionGroups: OptionGroup[] = [
  {
    id: 1,
    name: 'Solapa',
    slug: 'solapa',
    description: null,
    isRequired: true,
    sortOrder: 1,
    values: [
      { id: 10, optionGroupId: 1, name: 'Muesca', description: null, priceDelta: 0, sortOrder: 1, isActive: true },
      { id: 11, optionGroupId: 1, name: 'Pico', description: null, priceDelta: 150, sortOrder: 2, isActive: true },
    ],
  },
  {
    id: 2,
    name: 'Forro',
    slug: 'forro',
    description: null,
    isRequired: true,
    sortOrder: 2,
    values: [
      { id: 20, optionGroupId: 2, name: 'Estándar', description: null, priceDelta: 0, sortOrder: 1, isActive: true },
      { id: 21, optionGroupId: 2, name: 'Estampado', description: null, priceDelta: 80, sortOrder: 2, isActive: true },
    ],
  },
];

describe('priceMadeToMeasure', () => {
  it('suma el precio base, la tela consumida y los deltas de las opciones elegidas', () => {
    const price = priceMadeToMeasure(model, fabric, [11, 21], optionGroups);
    // 2000 base + (100 * 3.5) tela + 150 + 80 opciones
    expect(price).toBe(2000 + fabric.pricePerMeter * METERS_PER_SUIT + 150 + 80);
  });

  it('las opciones sin sobrecosto no cambian el precio', () => {
    const price = priceMadeToMeasure(model, fabric, [10, 20], optionGroups);
    expect(price).toBe(2000 + fabric.pricePerMeter * METERS_PER_SUIT);
  });
});

describe('describeOptions', () => {
  it('devuelve solo las opciones seleccionadas, con el nombre de su grupo', () => {
    const described = describeOptions([11, 20], optionGroups);
    expect(described).toEqual([
      { id: 11, groupName: 'Solapa', name: 'Pico', priceDelta: 150 },
      { id: 20, groupName: 'Forro', name: 'Estándar', priceDelta: 0 },
    ]);
  });

  it('una lista vacía de ids no describe nada', () => {
    expect(describeOptions([], optionGroups)).toEqual([]);
  });
});

describe('lineTotal', () => {
  it('multiplica precio unitario por cantidad, redondeado a centavos', () => {
    const line = { unitPrice: 19.999, quantity: 2 } as CartLine;
    expect(lineTotal(line)).toBe(40);
  });
});

describe('pointsToCurrency', () => {
  it('convierte puntos a quetzales según el valor de canje', () => {
    expect(pointsToCurrency(200, DEFAULT_LOYALTY_SETTINGS)).toBe(10);
  });

  it('nunca da un valor negativo', () => {
    expect(pointsToCurrency(-50, DEFAULT_LOYALTY_SETTINGS)).toBe(0);
  });
});

describe('maxRedeemablePoints', () => {
  it('topa por el saldo del cliente cuando alcanza para cubrir todo el disponible', () => {
    const max = maxRedeemablePoints(800, 1000, DEFAULT_LOYALTY_SETTINGS);
    expect(max).toBe(1000);
  });

  it('topa por lo que hace falta para dejar el pedido en Q0', () => {
    const max = maxRedeemablePoints(10, 1000, DEFAULT_LOYALTY_SETTINGS);
    // 10 / 0.05 = 200 puntos cubren el disponible; el cliente tiene de sobra.
    expect(max).toBe(200);
  });

  it('con el programa apagado no se puede canjear nada', () => {
    const max = maxRedeemablePoints(800, 1000, { ...DEFAULT_LOYALTY_SETTINGS, isActive: false });
    expect(max).toBe(0);
  });

  it('con valor de canje en cero no se puede canjear nada (evita dividir por cero)', () => {
    const max = maxRedeemablePoints(800, 1000, {
      ...DEFAULT_LOYALTY_SETTINGS,
      redemptionValueQuetzalPerPoint: 0,
    });
    expect(max).toBe(0);
  });
});

function cartLine(overrides: Partial<CartLine>): CartLine {
  return {
    lineId: 'line_1',
    itemType: 'ready_to_wear',
    quantity: 1,
    unitPrice: 0,
    suitModelId: null,
    fabricId: null,
    optionValueIds: [],
    productId: 1,
    displayName: 'Artículo',
    displaySubtitle: null,
    imageUrl: null,
    selectedOptions: [],
    maxQuantity: 10,
    ...overrides,
  };
}

function cartState(lines: CartLine[], overrides: Partial<CartState> = {}): CartState {
  return { sessionToken: 's1', lines, coupon: null, redeemedPoints: 0, ...overrides };
}

describe('calculateTotals', () => {
  it('un carrito vacío da todos los totales en cero', () => {
    const totals = calculateTotals(cartState([]));
    expect(totals).toMatchObject({
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      dueNow: 0,
      balanceLater: 0,
      itemCount: 0,
      requiresAppointment: false,
      estimatedPointsEarned: 0,
    });
  });

  it('listo-para-llevar se paga completo de inmediato: dueNow cubre el total', () => {
    const totals = calculateTotals(
      cartState([cartLine({ itemType: 'ready_to_wear', unitPrice: 500, quantity: 2 })]),
    );

    expect(totals.subtotal).toBe(1000);
    expect(totals.tax).toBe(120);
    expect(totals.total).toBe(1120);
    expect(totals.dueNow).toBe(1120);
    expect(totals.balanceLater).toBe(0);
    expect(totals.requiresAppointment).toBe(false);
    expect(totals.estimatedPointsEarned).toBe(100); // floor(1000 / 10)
  });

  it('a medida solo cobra el anticipo ahora; el resto queda para la entrega', () => {
    const totals = calculateTotals(
      cartState([cartLine({ itemType: 'made_to_measure', unitPrice: 3000, quantity: 1 })]),
    );

    expect(totals.total).toBe(3360); // (3000 * 1.12)
    expect(totals.dueNow).toBe(1680); // (3000 * 0.5) * 1.12
    expect(totals.balanceLater).toBe(1680);
    expect(totals.requiresAppointment).toBe(true);
  });

  it('reparte el descuento a prorrata entre a medida y listo-para-llevar', () => {
    const totals = calculateTotals(
      cartState(
        [
          cartLine({ lineId: 'mtm', itemType: 'made_to_measure', unitPrice: 3000, quantity: 1 }),
          cartLine({ lineId: 'rtw', itemType: 'ready_to_wear', unitPrice: 500, quantity: 2 }),
        ],
        { coupon: { code: 'VERANO', type: 'fixed', value: 400, discount: 400 } },
      ),
    );

    expect(totals.subtotal).toBe(4000);
    expect(totals.couponDiscount).toBe(400);
    expect(totals.taxableBase).toBe(3600);
    expect(totals.tax).toBe(432);
    expect(totals.total).toBe(4032);
    // mtmShare = 3000/4000 = 0.75 → mtm paga 3000 - 300 = 2700 antes de IVA
    // rtw paga 1000 - 100 = 900 antes de IVA, completo ahora
    expect(totals.dueNow).toBe(2520); // (2700 * 0.5 + 900) * 1.12
    expect(totals.balanceLater).toBe(1512);
  });

  it('el descuento del cupón no puede superar el subtotal', () => {
    const totals = calculateTotals(
      cartState([cartLine({ itemType: 'ready_to_wear', unitPrice: 500, quantity: 2 })], {
        coupon: { code: 'MEGA', type: 'fixed', value: 1500, discount: 1500 },
      }),
    );

    expect(totals.couponDiscount).toBe(1000);
    expect(totals.taxableBase).toBe(0);
    expect(totals.total).toBe(0);
  });

  it('los puntos canjeados se topan por lo que queda después del cupón', () => {
    const totals = calculateTotals(
      cartState([cartLine({ itemType: 'ready_to_wear', unitPrice: 1000, quantity: 1 })], {
        coupon: { code: 'DIEZ', type: 'fixed', value: 200, discount: 200 },
        redeemedPoints: 20000, // a 0.05/punto, esto valdría Q1000 — más de lo que queda por cubrir
      }),
    );

    expect(totals.couponDiscount).toBe(200);
    expect(totals.pointsDiscount).toBe(800); // 1000 - 200, no los Q1000 que «valdrían» los puntos
    expect(totals.discount).toBe(1000);
    expect(totals.taxableBase).toBe(0);
  });

  it('con el programa de fidelización apagado no se descuentan ni se ganan puntos', () => {
    const totals = calculateTotals(
      cartState([cartLine({ itemType: 'ready_to_wear', unitPrice: 1000, quantity: 1 })], {
        redeemedPoints: 500,
      }),
      { ...DEFAULT_LOYALTY_SETTINGS, isActive: false },
    );

    expect(totals.pointsDiscount).toBe(0);
    expect(totals.estimatedPointsEarned).toBe(0);
    expect(totals.total).toBe(1120);
  });

  it('itemCount suma las cantidades, no el número de líneas', () => {
    const totals = calculateTotals(
      cartState([
        cartLine({ lineId: 'a', quantity: 2 }),
        cartLine({ lineId: 'b', quantity: 3 }),
      ]),
    );
    expect(totals.itemCount).toBe(5);
  });
});
