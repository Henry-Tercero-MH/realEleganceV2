import type { AppliedCoupon } from '@real-elegance/shared';
import type { CartLine, CartState } from './types';
import { randomId } from '@/lib/id';

export type CartAction =
  | { type: 'ADD_ITEM'; line: Omit<CartLine, 'lineId'> }
  | { type: 'UPDATE_QTY'; lineId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; lineId: string }
  | { type: 'APPLY_COUPON'; coupon: AppliedCoupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR' }
  /** Sustituye el carrito completo: rehidratación o fusión con el del servidor. */
  | { type: 'REPLACE'; state: CartState };

export function createEmptyCart(sessionToken = randomId('cart')): CartState {
  return { sessionToken, lines: [], coupon: null };
}

/**
 * Dos líneas «a medida» son la misma si coinciden modelo, tela y **el conjunto
 * exacto de opciones**: cambiar el forro crea una línea nueva, no suma cantidad.
 */
function isSameLine(a: Omit<CartLine, 'lineId'>, b: CartLine): boolean {
  if (a.itemType !== b.itemType) return false;

  if (a.itemType === 'ready_to_wear') {
    return a.productId === b.productId;
  }

  if (a.suitModelId !== b.suitModelId || a.fabricId !== b.fabricId) return false;
  if (a.optionValueIds.length !== b.optionValueIds.length) return false;

  const sortedA = [...a.optionValueIds].sort((x, y) => x - y);
  const sortedB = [...b.optionValueIds].sort((x, y) => x - y);
  return sortedA.every((value, index) => value === sortedB[index]);
}

/**
 * Reducer del carrito.
 *
 * Es una función pura y sin dependencias de React a propósito: se puede probar
 * entera con Vitest sin montar un solo componente.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.lines.find((line) => isSameLine(action.line, line));

      if (existing) {
        return {
          ...state,
          lines: state.lines.map((line) =>
            line.lineId === existing.lineId
              ? {
                  ...line,
                  quantity: Math.min(line.maxQuantity, line.quantity + action.line.quantity),
                }
              : line,
          ),
        };
      }

      return {
        ...state,
        lines: [...state.lines, { ...action.line, lineId: randomId('line') }],
      };
    }

    case 'UPDATE_QTY': {
      // Bajar a cero equivale a quitar la línea: es lo que espera la persona
      // que pulsa «−» en el último artículo.
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((line) => line.lineId !== action.lineId) };
      }

      return {
        ...state,
        lines: state.lines.map((line) =>
          line.lineId === action.lineId
            ? { ...line, quantity: Math.min(action.quantity, line.maxQuantity) }
            : line,
        ),
      };
    }

    case 'REMOVE_ITEM': {
      const lines = state.lines.filter((line) => line.lineId !== action.lineId);
      // Sin artículos no hay cupón que aplicar.
      return { ...state, lines, coupon: lines.length === 0 ? null : state.coupon };
    }

    case 'APPLY_COUPON':
      return { ...state, coupon: action.coupon };

    case 'REMOVE_COUPON':
      return { ...state, coupon: null };

    case 'CLEAR':
      // Se conserva el `sessionToken`: sigue siendo el mismo visitante.
      return { ...state, lines: [], coupon: null };

    case 'REPLACE':
      return action.state;

    default:
      return state;
  }
}
