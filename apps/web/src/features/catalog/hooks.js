/**
 * Hooks de datos del catálogo.
 *
 * Todo lo remoto pasa por React Query: caché, revalidación y los estados
 * `isLoading / isError` que las pantallas necesitan para no inventarse un
 * spinner propio. Nada de esto vive en Context.
 */
import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/api';
/** El catálogo cambia poco: media hora de frescura evita refetches inútiles. */
const CATALOG_STALE_TIME = 30 * 60 * 1000;
export function useSuitStyles() {
    return useQuery({
        queryKey: queryKeys.styles,
        queryFn: () => api.catalog.listStyles(),
        staleTime: CATALOG_STALE_TIME,
    });
}
export function useSuits(filters) {
    return useQuery({
        queryKey: queryKeys.suits(filters),
        queryFn: () => api.catalog.listSuits(filters),
        staleTime: 5 * 60 * 1000,
        // Al cambiar de página o de filtro mantenemos la rejilla anterior en
        // pantalla: evita el parpadeo a esqueleto en cada pulsación.
        placeholderData: (previous) => previous,
    });
}
export function useSuit(code) {
    return useQuery({
        queryKey: queryKeys.suit(code ?? ''),
        queryFn: () => api.catalog.getSuit(code),
        enabled: Boolean(code),
        staleTime: CATALOG_STALE_TIME,
    });
}
export function useFabricCategories() {
    return useQuery({
        queryKey: queryKeys.fabricCategories,
        queryFn: () => api.catalog.listFabricCategories(),
        staleTime: CATALOG_STALE_TIME,
    });
}
export function useFabrics(filters = {}) {
    return useQuery({
        queryKey: queryKeys.fabrics(filters),
        queryFn: () => api.catalog.listFabrics(filters),
        staleTime: 10 * 60 * 1000,
        placeholderData: (previous) => previous,
    });
}
export function useOptionGroups() {
    return useQuery({
        queryKey: queryKeys.optionGroups,
        queryFn: () => api.catalog.listOptionGroups(),
        staleTime: CATALOG_STALE_TIME,
    });
}
export function useProductCategories() {
    return useQuery({
        queryKey: queryKeys.productCategories,
        queryFn: () => api.catalog.listProductCategories(),
        staleTime: CATALOG_STALE_TIME,
    });
}
export function useProducts(filters = {}) {
    return useQuery({
        queryKey: queryKeys.products(filters),
        queryFn: () => api.catalog.listProducts(filters),
        staleTime: 10 * 60 * 1000,
        placeholderData: (previous) => previous,
    });
}
export function useProduct(sku) {
    return useQuery({
        queryKey: queryKeys.product(sku ?? ''),
        queryFn: () => api.catalog.getProduct(sku),
        enabled: Boolean(sku),
        staleTime: CATALOG_STALE_TIME,
    });
}
//# sourceMappingURL=hooks.js.map