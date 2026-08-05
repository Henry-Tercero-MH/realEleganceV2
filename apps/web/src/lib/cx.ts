/**
 * Compone nombres de clase ignorando valores falsos.
 *
 * Reemplaza a `clsx` con las pocas líneas que realmente usamos, para no añadir
 * una dependencia por algo tan pequeño.
 *
 * @example cx(s.button, isActive && s.active, className)
 */
export type ClassValue = string | number | false | null | undefined;

export function cx(...values: ClassValue[]): string {
  let out = '';
  for (const value of values) {
    if (!value && value !== 0) continue;
    out = out ? `${out} ${value}` : String(value);
  }
  return out;
}
