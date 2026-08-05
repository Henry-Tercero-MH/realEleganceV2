/**
 * El package.json de `@real-elegance/shared` no declara `"type"`, por lo que Node
 * interpreta todo `.js` como CommonJS. Marcamos explícitamente cada carpeta de
 * salida para que la build ESM se resuelva como módulo y la CJS como commonjs.
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

writeFileSync(resolve(root, 'dist/esm/package.json'), JSON.stringify({ type: 'module' }, null, 2));
writeFileSync(
  resolve(root, 'dist/cjs/package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2),
);
