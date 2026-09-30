/**
 * Interruptor de fase: mientras no exista `apps/api` de verdad, el sitio se
 * lanza como **solo informativo**. Con `SHOP_ENABLED = false`:
 *   - El carrito, checkout, `/mi-cuenta`, `/admin`, `/entrar`, `/crear-cuenta`,
 *     `/seguimiento` y el catálogo de trajes (`/catalogo`, sus fichas y
 *     `/personalizar`) quedan fuera de la navegación y redirigen a inicio si
 *     alguien escribe la URL a mano (ver `routes/index.tsx`).
 *   - "Agendar una cita" pasa a ser un enlace de WhatsApp en vez del flujo
 *     interno (que vive detrás de una cuenta).
 * Para reactivar la tienda completa cuando el backend esté listo, basta con
 * volver esto `true` — nada del código de compra se borró, solo se oculta.
 */
export const SHOP_ENABLED = false;

/** Número real de WhatsApp del negocio, confirmado por el usuario. */
export const WHATSAPP_PHONE = '50230745202';

export const WHATSAPP_DEFAULT_MESSAGE = 'Hola, quisiera agendar una cita en Real Elegance.';

/** Enlace de WhatsApp listo para usar en un <a href>, con el mensaje ya cargado. */
export function getWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** Datos de contacto reales, en un solo sitio (Footer, index.html, etc.). */
export const CONTACT_EMAIL = 'realelegancegt@gmail.com';
/** Mismo número que WHATSAPP_PHONE, formateado como lo escribe una persona. */
export const CONTACT_PHONE_DISPLAY = '3074-5202';
export const CONTACT_PHONE_TEL = `+${WHATSAPP_PHONE}`;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/realelegancegt',
  facebook: 'https://www.facebook.com/share/19aPZF9Avs/?mibextid=wwXIfr',
} as const;
