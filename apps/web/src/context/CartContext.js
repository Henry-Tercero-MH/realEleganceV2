import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { cartReducer, createEmptyCart } from '@/features/cart/cartReducer';
import { calculateTotals } from '@/features/cart/pricing';
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage';
const CartContext = createContext(null);
/**
 * Carrito de compras.
 *
 * Es el único estado de cliente con verdadera complejidad, y por eso usa
 * `useReducer` en lugar de varios `useState` sueltos: añadir, cambiar cantidad
 * y aplicar cupón son transiciones que deben ocurrir de una pieza.
 *
 * Persiste en `localStorage` para el invitado. Al iniciar sesión, `POST
 * /cart/merge` fusionará estas líneas con las del servidor (fase de backend).
 */
export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, undefined, () => {
        const stored = readStorage(STORAGE_KEYS.cart, null);
        // Un carrito guardado por una versión anterior puede no tener `lines` ni
        // `redeemedPoints` (se añadió después): sin este resguardo, un carrito
        // viejo en localStorage produciría NaN en los totales.
        if (stored && Array.isArray(stored.lines) && stored.sessionToken) {
            return { ...stored, redeemedPoints: stored.redeemedPoints ?? 0 };
        }
        return createEmptyCart();
    });
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    // Persistimos en cada cambio: si la persona cierra la pestaña, su traje sigue ahí.
    useEffect(() => {
        writeStorage(STORAGE_KEYS.cart, cart);
        writeStorage(STORAGE_KEYS.cartSession, cart.sessionToken);
    }, [cart]);
    const totals = useMemo(() => calculateTotals(cart), [cart]);
    const openDrawer = useCallback(() => setDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const addItem = useCallback((line) => {
        dispatch({ type: 'ADD_ITEM', line });
        setDrawerOpen(true);
    }, []);
    const updateQuantity = useCallback((lineId, quantity) => {
        dispatch({ type: 'UPDATE_QTY', lineId, quantity });
    }, []);
    const removeItem = useCallback((lineId) => {
        dispatch({ type: 'REMOVE_ITEM', lineId });
    }, []);
    const applyCoupon = useCallback((coupon) => {
        dispatch({ type: 'APPLY_COUPON', coupon });
    }, []);
    const removeCoupon = useCallback(() => dispatch({ type: 'REMOVE_COUPON' }), []);
    const redeemPoints = useCallback((points) => {
        dispatch({ type: 'REDEEM_POINTS', points });
    }, []);
    const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
    // El value se memoiza: sin esto, cada render del provider volvería a pintar
    // toda la app que lo consume.
    const value = useMemo(() => ({
        cart,
        totals,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        redeemPoints,
        clear,
    }), [
        cart,
        totals,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        redeemPoints,
        clear,
    ]);
    return _jsx(CartContext.Provider, { value: value, children: children });
}
export function useCart() {
    const context = useContext(CartContext);
    if (!context)
        throw new Error('useCart debe usarse dentro de <CartProvider>.');
    return context;
}
//# sourceMappingURL=CartContext.js.map