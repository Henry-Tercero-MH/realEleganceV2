import { useMutation, useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/api';
import { useAuth } from '@/context/AuthContext';

/** Pedidos del cliente en sesión. */
export function useMyOrders() {
  const { user } = useAuth();
  const customerId = user?.customerId ?? null;

  return useQuery({
    queryKey: queryKeys.myOrders(customerId ?? 0),
    queryFn: () => api.orders.listMine(customerId!),
    enabled: customerId !== null,
    staleTime: 60 * 1000,
  });
}

export function useOrder(orderNumber: string | undefined) {
  return useQuery({
    queryKey: queryKeys.order(orderNumber ?? ''),
    queryFn: () => api.orders.getByNumber(orderNumber!),
    enabled: Boolean(orderNumber),
  });
}

/**
 * Seguimiento del pedido. Se refresca solo cada dos minutos: la persona deja la
 * pestaña abierta esperando ver avanzar su traje.
 */
export function useOrderTracking(orderNumber: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tracking(orderNumber ?? ''),
    queryFn: () => api.orders.tracking(orderNumber!),
    enabled: Boolean(orderNumber),
    refetchInterval: 2 * 60 * 1000,
    // Un número inexistente es un 404 legítimo: no tiene sentido reintentar.
    retry: false,
  });
}

/** Reenvía el correo de confirmación de un pedido. */
export function useResendConfirmation() {
  return useMutation({
    mutationFn: (orderNumber: string) => api.orders.resendConfirmation(orderNumber),
  });
}
