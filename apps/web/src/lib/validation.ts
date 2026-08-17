/**
 * Reglas de validación compartidas por los formularios de la app: nombre,
 * correo, teléfono y código postal (Guatemala), y el rango razonable de cada
 * medida corporal en cm. Centralizado para no repetir el mismo regex con
 * matices distintos en cada formulario (checkout, admin, registro…).
 */

export const NAME_REGEX = /^[A-Za-zÀ-ÿ\s'-]{2,60}$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 8 dígitos, con `+502` o `502` opcional al frente. Admite espacios y guiones. */
export const PHONE_GT_REGEX = /^(?:\+?502[\s-]?)?[2-9]\d{3}[\s-]?\d{4}$/;

export const POSTAL_CODE_GT_REGEX = /^\d{5}$/;

export function isValidName(value: string): boolean {
  return NAME_REGEX.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function isValidPhoneGT(value: string): boolean {
  return PHONE_GT_REGEX.test(value.trim());
}

export function isValidPostalCodeGT(value: string): boolean {
  return POSTAL_CODE_GT_REGEX.test(value.trim());
}

/** Rango razonable, en cm, para cada tipo de medida corporal (por `code`). */
export const MEASUREMENT_RANGES: Record<string, { min: number; max: number }> = {
  pecho: { min: 60, max: 170 },
  cintura: { min: 50, max: 170 },
  cadera: { min: 60, max: 180 },
  hombro: { min: 30, max: 65 },
  manga: { min: 40, max: 95 },
  espalda: { min: 30, max: 60 },
  cuello: { min: 25, max: 60 },
  entrepierna: { min: 55, max: 105 },
};

/** Para un tipo de medida sin rango específico todavía (uno nuevo en el catálogo). */
const DEFAULT_MEASUREMENT_RANGE = { min: 0.1, max: 250 };

export function getMeasurementRange(code: string): { min: number; max: number } {
  return MEASUREMENT_RANGES[code] ?? DEFAULT_MEASUREMENT_RANGE;
}

export function isMeasurementValueValid(code: string, valueCm: number): boolean {
  if (!Number.isFinite(valueCm)) return false;
  const { min, max } = getMeasurementRange(code);
  return valueCm >= min && valueCm <= max;
}
