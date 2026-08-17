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

export function useAdminOrder(orderNumber: string | undefined) {
  return useQuery({
    queryKey: queryKeys.adminOrder(orderNumber ?? ''),
    queryFn: () => api.admin.getOrder(orderNumber!),
    enabled: Boolean(orderNumber),
  });
}

function invalidateOrderQueries(queryClient: ReturnType<typeof useQueryClient>, order: { orderNumber: string; customerId: number }) {
  queryClient.invalidateQueries({ queryKey: queryKeys.adminOrder(order.orderNumber) });
  queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders });
  queryClient.invalidateQueries({ queryKey: queryKeys.adminCustomer(order.customerId) });
  queryClient.invalidateQueries({ queryKey: ['orders'] });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.recordPayment,
    onSuccess: (order) => invalidateOrderQueries(queryClient, order),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.updateOrderStatus,
    onSuccess: (order) => invalidateOrderQueries(queryClient, order),
  });
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

export function useMeasurementTypes() {
  return useQuery({
    queryKey: queryKeys.measurementTypes,
    queryFn: () => api.measurements.listTypes(),
    staleTime: 30 * 60 * 1000,
  });
}

// ── Clientela (CRM del taller) ─────────────────────────────────────────────

export function useAdminCustomers(filters: { search?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.adminCustomers(filters),
    queryFn: () => api.admin.listCustomers(filters),
  });
}

export function useAdminCustomer(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.adminCustomer(id ?? 0),
    queryFn: () => api.admin.getCustomer(id!),
    enabled: id !== undefined,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.updateCustomer,
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCustomer(customer.id) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
}

export function useAddCustomerNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.addCustomerNote,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCustomer(variables.customerId) });
    },
  });
}

/** Citas de un cliente puntual, vistas desde su ficha en el back-office. */
export function useCustomerAppointments(customerId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.myAppointments(customerId ?? 0),
    queryFn: () => api.appointments.listMine(customerId!),
    enabled: customerId !== undefined,
  });
}

export function useAddMeasurementSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.addMeasurementSet,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCustomer(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });
}

export function useUpdateMeasurementSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.updateMeasurementSet,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCustomer(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.admin.createOrder,
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCustomer(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionBoard });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'loyalty'] });
    },
  });
}
