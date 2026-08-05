import { z } from 'zod';

/**
 * Esquema del formulario de pago.
 *
 * Vive aquí solo mientras no existe el backend. En la fase de API se mueve a
 * `packages/shared` y pasa a ser **el mismo objeto** que valida Express: un
 * único sitio donde se define qué es un checkout válido.
 */
export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, 'Escribe tu nombre.'),
  lastName: z.string().trim().min(2, 'Escribe tus apellidos.'),
  email: z.string().trim().email('Ese correo no parece válido.'),
  phone: z
    .string()
    .trim()
    .min(8, 'Necesitamos un teléfono para avisarte de las pruebas.')
    .regex(/^[+\d\s()-]+$/, 'El teléfono solo puede llevar números y los signos + ( ) −.'),

  addressLine1: z.string().trim().min(5, 'Escribe la dirección de entrega.'),
  city: z.string().trim().min(2, 'Escribe la ciudad.'),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),

  paymentMethod: z.enum(['card', 'transfer', 'cash'], {
    errorMap: () => ({ message: 'Elige una forma de pago.' }),
  }),
  note: z.string().trim().max(400, 'La nota no puede pasar de 400 caracteres.').optional(),

  acceptsTerms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar las condiciones para continuar.' }),
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'card', label: 'Tarjeta de crédito o débito' },
  { value: 'transfer', label: 'Transferencia bancaria' },
  { value: 'cash', label: 'Efectivo en el taller' },
];
