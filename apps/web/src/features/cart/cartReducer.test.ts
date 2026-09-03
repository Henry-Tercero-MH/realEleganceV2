import { describe, expect, it } from 'vitest';
import { cartReducer, createEmptyCart } from './cartReducer';
import type { CartLine } from './types';

type NewLine = Omit<CartLine, 'lineId'>;

function madeToMeasureLine(overrides: Partial<NewLine> = {}): NewLine {
  return {
    itemType: 'made_to_measure',
    quantity: 1,
    unitPrice: 3200,
    suitModelId: 1,
    fabricId: 2,
    optionValueIds: [10, 20],
    productId: null,
    displayName: 'Traje azul noche',
    displaySubtitle: 'Súper 130',
    imageUrl: null,
    selectedOptions: [],
    maxQuantity: 5,
    ...overrides,
  };
}

function readyToWearLine(overrides: Partial<NewLine> = {}): NewLine {
  return {
    itemType: 'ready_to_wear',
    quantity: 1,
    unitPrice: 480,
    suitModelId: null,
    fabricId: null,
    optionValueIds: [],
    productId: 7,
    displayName: 'Corbata de seda granadina',
    displaySubtitle: null,
    imageUrl: null,
    selectedOptions: [],
    maxQuantity: 9,
    ...overrides,
  };
}

describe('createEmptyCart', () => {
  it('arranca sin líneas, cupón ni puntos canjeados', () => {
    const cart = createEmptyCart('cart_fijo');
    expect(cart).toEqual({ sessionToken: 'cart_fijo', lines: [], coupon: null, redeemedPoints: 0 });
  });
});

describe('cartReducer — ADD_ITEM', () => {
  it('agrega una línea nueva con un lineId propio', () => {
    const state = createEmptyCart('s1');
    const next = cartReducer(state, { type: 'ADD_ITEM', line: madeToMeasureLine() });

    expect(next.lines).toHaveLength(1);
    expect(next.lines[0]).toMatchObject({ displayName: 'Traje azul noche', quantity: 1 });
    expect(next.lines[0]!.lineId).toBeTruthy();
  });

  it('suma cantidad si el modelo, la tela y el mismo conjunto de opciones ya están en el carrito', () => {
    const state = createEmptyCart('s1');
    const withFirst = cartReducer(state, { type: 'ADD_ITEM', line: madeToMeasureLine({ quantity: 1 }) });
    // Mismas opciones, en otro orden: debe seguir contando como la misma línea.
    const next = cartReducer(withFirst, {
      type: 'ADD_ITEM',
      line: madeToMeasureLine({ quantity: 2, optionValueIds: [20, 10] }),
    });

    expect(next.lines).toHaveLength(1);
    expect(next.lines[0]!.quantity).toBe(3);
  });

  it('no deja que la cantidad sumada supere maxQuantity', () => {
    const state = createEmptyCart('s1');
    const withFirst = cartReducer(state, {
      type: 'ADD_ITEM',
      line: madeToMeasureLine({ quantity: 4, maxQuantity: 5 }),
    });
    const next = cartReducer(withFirst, {
      type: 'ADD_ITEM',
      line: madeToMeasureLine({ quantity: 4, maxQuantity: 5 }),
    });

    expect(next.lines[0]!.quantity).toBe(5);
  });

  it('cambiar una opción crea una línea aparte, no suma cantidad', () => {
    const state = createEmptyCart('s1');
    const withFirst = cartReducer(state, { type: 'ADD_ITEM', line: madeToMeasureLine() });
    const next = cartReducer(withFirst, {
      type: 'ADD_ITEM',
      line: madeToMeasureLine({ optionValueIds: [10, 30] }),
    });

    expect(next.lines).toHaveLength(2);
  });

  it('cambiar la tela crea una línea aparte aunque el modelo sea el mismo', () => {
    const state = createEmptyCart('s1');
    const withFirst = cartReducer(state, { type: 'ADD_ITEM', line: madeToMeasureLine({ fabricId: 2 }) });
    const next = cartReducer(withFirst, {
      type: 'ADD_ITEM',
      line: madeToMeasureLine({ fabricId: 9 }),
    });

    expect(next.lines).toHaveLength(2);
  });

  it('para listo-para-llevar, la misma línea es el mismo productId', () => {
    const state = createEmptyCart('s1');
    const withFirst = cartReducer(state, { type: 'ADD_ITEM', line: readyToWearLine({ quantity: 1 }) });
    const next = cartReducer(withFirst, {
      type: 'ADD_ITEM',
      line: readyToWearLine({ quantity: 2 }),
    });

    expect(next.lines).toHaveLength(1);
    expect(next.lines[0]!.quantity).toBe(3);
  });

  it('un traje a medida y un accesorio nunca se fusionan entre sí', () => {
    const state = createEmptyCart('s1');
    const withMtm = cartReducer(state, { type: 'ADD_ITEM', line: madeToMeasureLine() });
    const next = cartReducer(withMtm, { type: 'ADD_ITEM', line: readyToWearLine() });

    expect(next.lines).toHaveLength(2);
  });
});

describe('cartReducer — UPDATE_QTY', () => {
  it('actualiza la cantidad de la línea indicada', () => {
    const state = createEmptyCart('s1');
    const withLine = cartReducer(state, { type: 'ADD_ITEM', line: readyToWearLine({ quantity: 1 }) });
    const lineId = withLine.lines[0]!.lineId;

    const next = cartReducer(withLine, { type: 'UPDATE_QTY', lineId, quantity: 4 });
    expect(next.lines[0]!.quantity).toBe(4);
  });

  it('no deja subir la cantidad por encima de maxQuantity', () => {
    const state = createEmptyCart('s1');
    const withLine = cartReducer(state, {
      type: 'ADD_ITEM',
      line: readyToWearLine({ quantity: 1, maxQuantity: 3 }),
    });
    const lineId = withLine.lines[0]!.lineId;

    const next = cartReducer(withLine, { type: 'UPDATE_QTY', lineId, quantity: 99 });
    expect(next.lines[0]!.quantity).toBe(3);
  });

  it('bajar la cantidad a 0 quita la línea, como pulsar «−» en el último artículo', () => {
    const state = createEmptyCart('s1');
    const withLine = cartReducer(state, { type: 'ADD_ITEM', line: readyToWearLine() });
    const lineId = withLine.lines[0]!.lineId;

    const next = cartReducer(withLine, { type: 'UPDATE_QTY', lineId, quantity: 0 });
    expect(next.lines).toHaveLength(0);
  });

  it('una cantidad negativa también quita la línea', () => {
    const state = createEmptyCart('s1');
    const withLine = cartReducer(state, { type: 'ADD_ITEM', line: readyToWearLine() });
    const lineId = withLine.lines[0]!.lineId;

    const next = cartReducer(withLine, { type: 'UPDATE_QTY', lineId, quantity: -1 });
    expect(next.lines).toHaveLength(0);
  });
});

describe('cartReducer — REMOVE_ITEM', () => {
  it('quita solo la línea indicada', () => {
    const state = createEmptyCart('s1');
    const withTwo = cartReducer(
      cartReducer(state, { type: 'ADD_ITEM', line: madeToMeasureLine() }),
      { type: 'ADD_ITEM', line: readyToWearLine() },
    );
    const [first, second] = withTwo.lines;

    const next = cartReducer(withTwo, { type: 'REMOVE_ITEM', lineId: first!.lineId });
    expect(next.lines).toEqual([second]);
  });

  it('al quedar el carrito vacío, se limpian el cupón y los puntos canjeados', () => {
    const withLine = cartReducer(createEmptyCart('s1'), { type: 'ADD_ITEM', line: readyToWearLine() });
    const withCoupon = cartReducer(withLine, {
      type: 'APPLY_COUPON',
      coupon: { code: 'BIENVENIDA10', type: 'percent', value: 10, discount: 48 },
    });
    const withPoints = cartReducer(withCoupon, { type: 'REDEEM_POINTS', points: 50 });

    const lineId = withPoints.lines[0]!.lineId;
    const next = cartReducer(withPoints, { type: 'REMOVE_ITEM', lineId });

    expect(next.lines).toHaveLength(0);
    expect(next.coupon).toBeNull();
    expect(next.redeemedPoints).toBe(0);
  });

  it('si quedan otras líneas, el cupón y los puntos se conservan', () => {
    const withTwo = cartReducer(
      cartReducer(createEmptyCart('s1'), { type: 'ADD_ITEM', line: madeToMeasureLine() }),
      { type: 'ADD_ITEM', line: readyToWearLine() },
    );
    const withCoupon = cartReducer(withTwo, {
      type: 'APPLY_COUPON',
      coupon: { code: 'BIENVENIDA10', type: 'percent', value: 10, discount: 48 },
    });

    const next = cartReducer(withCoupon, { type: 'REMOVE_ITEM', lineId: withCoupon.lines[0]!.lineId });
    expect(next.lines).toHaveLength(1);
    expect(next.coupon).not.toBeNull();
  });
});

describe('cartReducer — cupón, puntos, vaciar y reemplazar', () => {
  it('APPLY_COUPON y REMOVE_COUPON', () => {
    const state = createEmptyCart('s1');
    const applied = cartReducer(state, {
      type: 'APPLY_COUPON',
      coupon: { code: 'VERANO', type: 'fixed', value: 100, discount: 100 },
    });
    expect(applied.coupon?.code).toBe('VERANO');

    const removed = cartReducer(applied, { type: 'REMOVE_COUPON' });
    expect(removed.coupon).toBeNull();
  });

  it('REDEEM_POINTS redondea hacia abajo y descarta negativos', () => {
    const state = createEmptyCart('s1');
    expect(cartReducer(state, { type: 'REDEEM_POINTS', points: 42.9 }).redeemedPoints).toBe(42);
    expect(cartReducer(state, { type: 'REDEEM_POINTS', points: -10 }).redeemedPoints).toBe(0);
  });

  it('CLEAR vacía líneas, cupón y puntos, pero conserva el sessionToken', () => {
    const withStuff = cartReducer(
      cartReducer(createEmptyCart('s1'), { type: 'ADD_ITEM', line: readyToWearLine() }),
      { type: 'REDEEM_POINTS', points: 20 },
    );

    const cleared = cartReducer(withStuff, { type: 'CLEAR' });
    expect(cleared).toEqual({ sessionToken: 's1', lines: [], coupon: null, redeemedPoints: 0 });
  });

  it('REPLACE sustituye el estado completo (rehidratación o fusión con el servidor)', () => {
    const state = createEmptyCart('s1');
    const serverState = createEmptyCart('s2');

    const next = cartReducer(state, { type: 'REPLACE', state: serverState });
    expect(next).toBe(serverState);
  });
});
