import type { AppliedCoupon, CartItemType } from '@real-elegance/shared';

/**
 * Línea del carrito **en el cliente**.
 *
 * Es deliberadamente distinta de `CartItem` de `packages/shared` (la fila de
 * `CART_ITEMS`): mientras el carrito es de invitado no hay ids del servidor, así
 * que la línea se identifica con un `lineId` local. Al iniciar sesión, `POST
 * /cart/merge` convertirá estas líneas en filas reales.
 */
export interface CartLine {
  /** Id local estable — nunca el índice del array. */
  lineId: string;
  itemType: CartItemType;
  quantity: number;
  /**
   * Precio unitario **calculado como lo haría el servidor** (base + deltas).
   * Se guarda para poder pintar el carrito sin red; en el checkout se revalida.
   */
  unitPrice: number;

  // A medida
  suitModelId: number | null;
  fabricId: number | null;
  optionValueIds: number[];

  // Listo para llevar
  productId: number | null;

  // Presentación (evita pedir el catálogo entero para pintar el drawer)
  displayName: string;
  displaySubtitle: string | null;
  imageUrl: string | null;
  selectedOptions: Array<{ id: number; groupName: string; name: string; priceDelta: number }>;
  /** Existencias conocidas al añadir, para no dejar subir la cantidad sin tope. */
  maxQuantity: number;
}

export interface CartState {
  /** Token del carrito de invitado; viaja en la cabecera `x-cart-session`. */
  sessionToken: string;
  lines: CartLine[];
  coupon: AppliedCoupon | null;
}

/** Totales derivados. Nunca se guardan en el estado: se calculan. */
export interface CartTotals {
  subtotal: number;
  discount: number;
  taxableBase: number;
  tax: number;
  total: number;
  /** Anticipo de los trajes a medida + total de los accesorios. */
  dueNow: number;
  /** Saldo que queda para la entrega. */
  balanceLater: number;
  itemCount: number;
  requiresAppointment: boolean;
}
