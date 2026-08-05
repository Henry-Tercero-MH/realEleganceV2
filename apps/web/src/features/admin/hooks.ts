import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys } from '@/api';

export function useAdminStats() {
  return useQuery({ queryKey: queryKeys.adminStats, queryFn: () => api.admin.stats() });
}

export function useAdminSuits() {
  return useQuery({ queryKey: queryKeys.adminSuits, queryFn: () => api.admin.listSuits() });
}

export function useAdminFabrics() {
  return useQuery({ queryKey: queryKeys.adminFabrics, queryFn: () => api.admin.listFabrics() });
}

export function useAdminProducts() {
  return useQuery({ queryKey: queryKeys.adminProducts, queryFn: () => api.admin.listProducts() });
}

export function useAdminCoupons() {
  return useQuery({ queryKey: queryKeys.adminCoupons, queryFn: () => api.admin.listCoupons() });
}

export function useAdminOrders() {
  return useQuery({ queryKey: queryKeys.adminOrders, queryFn: () => api.admin.listOrders() });
}

export function useAdminAppointments() {
  return useQuery({
    queryKey: queryKeys.adminAppointments,
    queryFn: () => api.admin.listAppointments(),
  });
}

export function useProductionBoard() {
  return useQuery({
    queryKey: queryKeys.productionBoard,
    queryFn: () => api.admin.productionBoard(),
    // El tablero es una pantalla de taller que se deja abierta todo el día.
    refetchInterval: 60 * 1000,
  });
}

export function useTailorWorkload() {
  return useQuery({
    queryKey: queryKeys.tailorWorkload,
    queryFn: () => api.admin.tailorWorkload(),
  });
}

export function useAssignTailor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workOrderId, tailorId }: { workOrderId: number; tailorId: number }) =>
      api.admin.assignTailor(workOrderId, tailorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionBoard });
      queryClient.invalidateQueries({ queryKey: queryKeys.tailorWorkload });
    },
  });
}

export function useAdvanceStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workOrderId: number) => api.admin.advanceStage(workOrderId),
    onSuccess: () => {
      // Avanzar etapa toca el tablero, la carga de los sastres y el pedido.
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
