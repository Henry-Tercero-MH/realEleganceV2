import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys } from '@/api';
import { useAuth } from '@/context/AuthContext';
export function useMyAppointments() {
    const { user } = useAuth();
    const customerId = user?.customerId ?? null;
    return useQuery({
        queryKey: queryKeys.myAppointments(customerId ?? 0),
        queryFn: () => api.appointments.listMine(customerId),
        enabled: customerId !== null,
    });
}
export function useStaff() {
    return useQuery({
        queryKey: queryKeys.staff,
        queryFn: () => api.appointments.listStaff(),
        staleTime: 30 * 60 * 1000,
    });
}
/** Huecos libres de un día. `date` en formato `YYYY-MM-DD`. */
export function useAvailability(date, staffId) {
    return useQuery({
        queryKey: queryKeys.availability(date, staffId),
        queryFn: () => api.appointments.availability(date, staffId),
        enabled: Boolean(date),
        // La agenda se mueve: no cacheamos huecos más de un minuto.
        staleTime: 60 * 1000,
    });
}
export function useCreateAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.appointments.create,
        onSuccess: () => {
            // Tras agendar, la agenda y los huecos quedan obsoletos por definición.
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            // La agenda del taller (`/admin/citas`) vive bajo su propia clave.
            queryClient.invalidateQueries({ queryKey: queryKeys.adminAppointments });
        },
    });
}
export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.appointments.updateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.adminAppointments });
        },
    });
}
export function useRescheduleAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.appointments.reschedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.adminAppointments });
        },
    });
}
//# sourceMappingURL=hooks.js.map