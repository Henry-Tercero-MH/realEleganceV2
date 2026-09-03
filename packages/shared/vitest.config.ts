import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Este paquete todavía no tiene tests propios (los DTOs se prueban
    // indirectamente vía apps/web). Sin esto, `vitest run` termina con
    // código de salida 1 al no encontrar archivos *.test.ts, lo que rompe
    // el `&&` de `npm test` en la raíz y nunca llega a correr los tests de
    // apps/web. Quitar este flag en cuanto exista el primer test aquí.
    passWithNoTests: true,
  },
});
