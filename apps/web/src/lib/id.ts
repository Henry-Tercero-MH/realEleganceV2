/**
 * Identificadores del lado del cliente: token de sesión del carrito de invitado,
 * claves de ítems optimistas, ids de toast.
 */

export function randomId(prefix = 'id'): string {
  const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (cryptoObj?.randomUUID) {
    return `${prefix}_${cryptoObj.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
