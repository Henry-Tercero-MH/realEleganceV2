import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys } from '@/api';
import { useAuth } from '@/context/AuthContext';
/**
 * Reglas vigentes del programa de puntos (las que ajusta el admin).
 * Se usa tanto en el carrito/checkout como en el propio panel de ajuste.
 */
export function useLoyaltySettings() {
    return useQuery({
        queryKey: queryKeys.loyaltySettings,
        queryFn: () => api.loyalty.getSettings(),
        staleTime: 5 * 60 * 1000,
    });
}
/** Saldo de puntos del cliente en sesión. */
export function useMyLoyalty() {
    const { user } = useAuth();
    const customerId = user?.customerId ?? null;
    return useQuery({
        queryKey: queryKeys.myLoyalty(customerId ?? 0),
        queryFn: () => api.loyalty.getMyAccount(customerId),
        enabled: customerId !== null,
        staleTime: 30 * 1000,
    });
}
export function useMyLoyaltyMovements() {
    const { user } = useAuth();
    const customerId = user?.customerId ?? null;
    return useQuery({
        queryKey: queryKeys.myLoyaltyMovements(customerId ?? 0),
        queryFn: () => api.loyalty.getMyMovements(customerId),
        enabled: customerId !== null,
    });
}
export function useAdminLoyaltyAccounts() {
    return useQuery({
        queryKey: queryKeys.adminLoyaltyAccounts,
        queryFn: () => api.loyalty.listAccounts(),
    });
}
export function useAdjustLoyaltyPoints() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => api.loyalty.adjustPoints(input),
        onSuccess: (_account, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.adminLoyaltyAccounts });
            queryClient.invalidateQueries({ queryKey: queryKeys.adminCustomer(variables.customerId) });
            queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.myLoyalty(variables.customerId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.myLoyaltyMovements(variables.customerId) });
        },
    });
}
export function useUpdateLoyaltySettings() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (patch) => api.loyalty.updateSettings(patch),
        onSuccess: () => {
            // El nuevo valor del punto afecta el estimado del carrito y del checkout.
            queryClient.invalidateQueries({ queryKey: queryKeys.loyaltySettings });
        },
    });
}
//# sourceMappingURL=hooks.js.map