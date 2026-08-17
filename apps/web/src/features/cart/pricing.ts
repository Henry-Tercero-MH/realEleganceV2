/**
 * Cálculo de precios del carrito.
 *
 * ⚠️ Esto es una **réplica** de lo que hacen `fn_cart_total` y
 * `fn_calculate_order_total` en la base de datos. Sirve para pintar el carrito
 * al instante, no para cobrar: en el checkout manda siempre el servidor. Si la
 * regla cambia, cambia en los dos sitios.
 */
import type { Fabric, LoyaltySettings, OptionGroup, SuitModel } from '@real-elegance/shared';
import type { CartLine, CartState, CartTotals } from './types';

/** Impuesto aplicado al subtotal ya descontado. */
export const TAX_RATE = 0.12;
/** Porción del traje a medida que se cobra por adelantado. */
export const DEPOSIT_RATE = 0.5;
/** Metros de tela que consume un traje: entra en el precio de la línea. */
export const METERS_PER_SUIT = 3.5;

/**
 * Reglas de fidelización que usa el carrito **mientras no hay respuesta del
 * servidor**: es una estimación optimista, igual que el resto de esta réplica.
 * El administrador ajusta los valores reales desde `/admin/fidelizacion`
 * (`api.loyalty.getSettings`); el checkout usa siempre esos, no esta constante.
 */
export const DEFAULT_LOYALTY_SETTINGS: LoyaltySettings = {
  earnRateQuetzalPerPoint: 10,
  redemptionValueQuetzalPerPoint: 0.05,
  isActive: true,
  updatedAt: new Date(0).toISOString(),
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Precio de un traje a medida: precio base del modelo + tela consumida +
 * suma de los `price_delta` de las opciones elegidas.
 */
export function priceMadeToMeasure(
  model: SuitModel,
  fabric: Fabric,
  optionValueIds: number[],
  optionGroups: OptionGroup[],
): number {
  const fabricCost = fabric.pricePerMeter * METERS_PER_SUIT;

  const optionsCost = optionGroups
    .flatMap((group) => group.values)
    .filter((value) => optionValueIds.includes(value.id))
    .reduce((sum, value) => sum + value.priceDelta, 0);

  return round(model.basePrice + fabricCost + optionsCost);
}

/** Desglose de las opciones elegidas, para mostrarlo en el carrito y el pedido. */
export function describeOptions(optionValueIds: number[], optionGroups: OptionGroup[]) {
  return optionGroups.flatMap((group) =>
    group.values
      .filter((value) => optionValueIds.includes(value.id))
      .map((value) => ({
        id: value.id,
        groupName: group.name,
        name: value.name,
        priceDelta: value.priceDelta,
      })),
  );
}

export function lineTotal(line: CartLine): number {
  return round(line.unitPrice * line.quantity);
}

/** Cuántos quetzales representan `points` puntos, al valor de canje vigente. */
export function pointsToCurrency(points: number, loyalty: LoyaltySettings): number {
  return round(Math.max(0, points) * loyalty.redemptionValueQuetzalPerPoint);
}

/**
 * Máximo de puntos que tiene sentido canjear: no más de lo que el cliente
 * tiene, y no más de lo que haría falta para dejar el pedido en Q0 (después
 * del cupón). Se usa para acotar el control de canje en la UI.
 */
export function maxRedeemablePoints(
  amountAvailableForPoints: number,
  pointsBalance: number,
  loyalty: LoyaltySettings,
): number {
  if (!loyalty.isActive || loyalty.redemptionValueQuetzalPerPoint <= 0) return 0;
  const pointsToCoverAmount = Math.floor(
    amountAvailableForPoints / loyalty.redemptionValueQuetzalPerPoint,
  );
  return Math.max(0, Math.min(pointsBalance, pointsToCoverAmount));
}

/**
 * Totales del carrito.
 *
 * El orden importa y es el mismo del backend: subtotal → descuentos (cupón y
 * luego puntos) → impuesto sobre la base ya descontada → total. El «a pagar
 * ahora» separa el anticipo de los trajes del cobro completo de los
 * accesorios, y los puntos ganados se calculan sobre lo que realmente queda
 * gravado (no sobre lo que ya se cubrió con puntos).
 */
export function calculateTotals(
  state: CartState,
  loyalty: LoyaltySettings = DEFAULT_LOYALTY_SETTINGS,
): CartTotals {
  const subtotal = round(state.lines.reduce((sum, line) => sum + lineTotal(line), 0));

  const couponDiscount = round(Math.min(state.coupon?.discount ?? 0, subtotal));

  const pointsDiscountRaw = loyalty.isActive
    ? pointsToCurrency(state.redeemedPoints, loyalty)
    : 0;
  const pointsDiscount = round(Math.min(pointsDiscountRaw, subtotal - couponDiscount));

  const discount = round(couponDiscount + pointsDiscount);
  const taxableBase = round(subtotal - discount);
  const tax = round(taxableBase * TAX_RATE);
  const total = round(taxableBase + tax);

  const madeToMeasure = state.lines.filter((line) => line.itemType === 'made_to_measure');
  const readyToWear = state.lines.filter((line) => line.itemType === 'ready_to_wear');

  const mtmSubtotal = madeToMeasure.reduce((sum, line) => sum + lineTotal(line), 0);
  const rtwSubtotal = readyToWear.reduce((sum, line) => sum + lineTotal(line), 0);

  // El descuento (cupón + puntos) se reparte a prorrata para no regalar el
  // anticipo ni cobrarlo de más cuando el carrito mezcla los dos tipos de compra.
  const mtmShare = subtotal > 0 ? mtmSubtotal / subtotal : 0;
  const mtmAfterDiscount = round(mtmSubtotal - discount * mtmShare);
  const rtwAfterDiscount = round(rtwSubtotal - discount * (1 - mtmShare));

  const dueNow = round((mtmAfterDiscount * DEPOSIT_RATE + rtwAfterDiscount) * (1 + TAX_RATE));

  // Se gana sobre la base gravable, es decir, después de descontar cupón y
  // puntos: no se ganan puntos nuevos sobre la parte ya pagada con puntos.
  const estimatedPointsEarned = loyalty.isActive
    ? Math.floor(taxableBase / loyalty.earnRateQuetzalPerPoint)
    : 0;

  return {
    subtotal,
    couponDiscount,
    pointsDiscount,
    discount,
    taxableBase,
    tax,
    total,
    dueNow,
    balanceLater: round(total - dueNow),
    itemCount: state.lines.reduce((sum, line) => sum + line.quantity, 0),
    requiresAppointment: madeToMeasure.length > 0,
    estimatedPointsEarned,
  };
}
