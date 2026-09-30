/**
 * Interruptor de fase: mientras no exista `apps/api` de verdad, el sitio se
 * lanza como **solo informativo**. Con `SHOP_ENABLED = false`:
 *   - El carrito, checkout, `/mi-cuenta`, `/admin`, `/entrar`, `/crear-cuenta`
 *     y `/seguimiento` quedan fuera de la navegación y redirigen a inicio si
 *     alguien escribe la URL a mano (ver `routes/index.tsx`).
 *   - "Agendar una cita" pasa a ser un enlace de WhatsApp en vez del flujo
 *     interno (que vive detrás de una cuenta).
 * Para reactivar la tienda completa cuando el backend esté listo, basta con
 * volver esto `true` — nada del código de compra se borró, solo se oculta.
 */
export const SHOP_ENABLED = false;

// TODO: reemplazar con el número real (formato internacional, solo dígitos,
// sin "+" ni espacios — el que usa wa.me). Pendiente de que lo confirmen.
export const WHATSAPP_PHONE = '50222345678';

export const WHATSAPP_DEFAULT_MESSAGE = 'Hola, quisiera agendar una cita en Real Elegance.';

/** Enlace de WhatsApp listo para usar en un <a href>, con el mensaje ya cargado. */
export function getWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
