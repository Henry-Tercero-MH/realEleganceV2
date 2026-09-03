# Estado del proyecto — Real Elegance

> Bitácora de avance **por sesión**. Se actualiza al final de cada sesión de trabajo.
> Especificación de referencia: [PROMPT_MAESTRO.md](PROMPT_MAESTRO.md)

**Fase actual:** 🎨 Diseño de frontend (con datos simulados, sin backend)

---

## Cómo usar este archivo

1. Al **empezar** una sesión: lee «Estado global» y «Próximos pasos».
2. Al **terminar**: añade una entrada nueva en «Bitácora» (arriba del todo, más reciente primero)
   y actualiza «Estado global» + «Próximos pasos».
3. Si una decisión cambia la especificación, actualízala también en `PROMPT_MAESTRO.md`.

---

## Cómo arrancar

```bash
npm install
cp .env.example .env      # ya trae VITE_USE_MOCKS=true
npm run dev:web           # → http://localhost:5173
```

**Cuentas de demostración** (botón de relleno rápido en `/entrar`):

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@realelegance.com` | `Admin!2026` | Administrador — ve `/admin` |
| `sastre@realelegance.com` | `Sastre!2026` | Sastre — ve el taller |
| `cliente@realelegance.com` | `Cliente!2026` | Cliente — ve `/mi-cuenta` |

Pedido de demostración para el seguimiento público: **`RE-2026-01024`**.

---

## Estado global

| Módulo | Estado | Notas |
|---|---|---|
| Raíz del monorepo | ✅ Hecho | npm workspaces, tsconfig base, ESLint 9 flat, Prettier, `.env.example` |
| `packages/shared` — constantes y tipos | ✅ Hecho | Catálogos cerrados del dominio + DTOs de toda la API |
| `packages/shared` — `tokens.css` | ✅ Hecho | Paleta §3 + escala, motivo de sastre y tema claro «lino» |
| `packages/shared` — esquemas Zod | ⬜ Pendiente | Se escriben en la fase de backend (hoy viven en `features/*/schema.ts`) |
| `apps/web` — design system | ✅ Hecho | 21 componentes en `components/ui`, todos sobre tokens |
| `apps/web` — layouts y router | ✅ Hecho | App/Auth/Account/Admin + React Router v6 con `lazy()` y `<RequireRole>` |
| `apps/web` — datos simulados | ✅ Hecho | `src/mocks` + `src/api` (misma firma que tendrá axios) |
| `apps/web` — páginas públicas | ✅ Hecho | Home, catálogo, detalle, personalizar, telas, accesorios, taller, 404 |
| `apps/web` — carrito y checkout | ✅ Hecho | `CartContext` (`useReducer` + `localStorage`), drawer, `/carrito`, `/checkout`, confirmación |
| `apps/web` — seguimiento | ✅ Hecho | Público por número de pedido, con timeline y bitácora |
| `apps/web` — cuenta del cliente | ✅ Hecho | Resumen, pedidos, detalle, citas, agendar, medidas, `/mi-cuenta/puntos` (fidelización) |
| `apps/web` — fidelización (puntos) | ✅ Hecho | `PointsRedeemBox` en el carrito, `MyLoyaltyPage`, `AdminLoyaltyPage` (reglas de acumulación/canje); tipos `LoyaltySettings`/`LoyaltyAccount` en `packages/shared` |
| `apps/web` — clientela / CRM admin | ✅ Hecho | `/admin/clientes` y `/admin/clientes/:id` (historial, notas de mostrador, medidas, saldo de puntos) |
| `apps/web` — back-office `/admin` | ✅ Hecho | 13 pantallas: panel, trajes, telas, accesorios, cupones, clientes (+ficha), taller, pedidos, pedido nuevo (mostrador), detalle de pedido, citas, fidelización |
| `apps/web` — `<ImageUploader />` | ⬜ Pendiente | Necesita bucket real; las tablas de trajes/accesorios en admin siguen siendo de solo lectura |
| `apps/web` — simulador 2D | ⛔ Fuera de alcance | Tarjeta «Próximamente» en `/personalizar`, según §13 |
| Tests | 🚧 En curso | Lógica pura del carrito (38) + RTL de `Button`/`OptionCard`/flujo «añadir al carrito» (16) — 54 tests. Falta el resto del design system |
| `apps/api` · `db/` · Docker | ⛔ No iniciado | Fuera del alcance de la fase actual |

Leyenda: ✅ hecho · 🚧 en curso · ⬜ pendiente (en alcance) · ⛔ fuera del alcance de la fase actual

---

## Decisiones vigentes

- **Fase de diseño primero.** `apps/web` se construye contra una capa de datos simulados
  (`src/mocks`) que expone exactamente la firma que tendrá el cliente real. Cambiar de mock a API
  es reescribir `src/api/index.ts`, sin tocar features ni páginas.
- **React Query desde el día uno**, aunque los datos vengan de mocks: los estados
  `isLoading / isError / vacío` quedan diseñados de verdad, no añadidos después.
- **Los mocks tienen latencia artificial** (`VITE_MOCK_LATENCY`, 320 ms) a propósito: sin ella los
  esqueletos de carga nunca se ven y se diseñan mal.
- **Cero colores hardcodeados.** Todo componente consume `--color-*` de `tokens.css`.
- **Los filtros del catálogo viven en la URL**, no en `useState`: la búsqueda se comparte por enlace
  y el botón «atrás» funciona.
- **`features/cart/pricing.ts` es una réplica declarada** de `fn_cart_total` /
  `fn_calculate_order_total`. Sirve para pintar; en el checkout manda el servidor. Si cambia la
  regla, cambia en los dos sitios.
- **npm workspaces** como gestor del monorepo; `packages/shared` compila dual (ESM + CJS).
- **Tipografías autoalojadas** con `@fontsource`: sin peticiones a Google Fonts, funciona sin red.
- **Moneda GTQ** (quetzal guatemalteco), impuesto 12 %, anticipo 50 %.

---

## Próximos pasos

**Cerrar la fase de diseño:**

1. ~~Tests de Vitest sobre `cartReducer` y `calculateTotals`~~ — hecho en la Sesión 4: 38 tests entre
   `apps/web/src/features/cart/cartReducer.test.ts` y `pricing.test.ts` (fusión de líneas, tope de
   `maxQuantity`, cupón y puntos topados correctamente, reparto a prorrata del anticipo entre a
   medida y listo-para-llevar, fidelización apagada). `tsc` y `vitest run` en verde.
2. ~~Tests de RTL sobre `Button`, `OptionCard` y el flujo «añadir al carrito»~~ — hecho en la Sesión 4:
   16 tests (`Button.test.tsx`, `OptionCard.test.tsx`, `context/CartContext.test.tsx` con un harness
   mínimo sobre `CartProvider` real, sin montar una página entera). Dos gotchas de jsdom/RTL que
   valen la pena si se sigue escalando al resto del design system: (1) `getByText` normaliza NBSP a
   espacio normal pero no normaliza el string que le pasas — comparar precios formateados con
   `Intl.NumberFormat` necesita una regex con `\s`, no el string exacto de `formatCurrency`; (2) el
   `<input>` real de `OptionCard` tiene `pointer-events: none` (la tarjeta visible es el `<label>`),
   así que `userEvent.click` debe apuntar al label/texto, no al radio, o revienta con «Unable to
   perform pointer interaction». Sigue pendiente el resto del design system (`Card`, `Field`, `Modal`,
   `Stepper`…).
3. ~~Repaso de accesibilidad con teclado en modal, drawer y stepper~~ — cerrado en la Sesión 4.
   `useFocusTrap` ya cubre `Modal`/`Drawer`/menú móvil del `Header`; el `Stepper` (indicador de
   progreso) no lo necesita: no es un diálogo, son `<button>` nativos. En la Sesión 5 se recalculó
   el contraste a mano (no con herramientas) y se corrigieron 4 problemas reales, el más grave un
   `--color-warning` sin remapear en el tema claro (el que ve cualquier cuenta nueva por defecto).
   Pendiente real: pasar axe/Lighthouse y probar con lector de pantalla — la revisión sigue siendo
   lectura de código + cálculo manual, no medición con herramientas.
4. ~~Revisar el responsive real en móvil~~ — hecho en la Sesión 3 (logout oculto en «Mi cuenta»,
   botones táctiles del carrito, contraste del botón primario, hueco del header en tablet/móvil,
   barra fija de pago). En la Sesión 4 se cubrió también `/admin` (sin media queries hasta ahora).
   Pendiente: repetirlo en dispositivo real tras los cambios de fidelización/CRM.

**Fase siguiente (backend):**

5. `packages/shared`: mover los esquemas Zod de `features/*/schema.ts` y compartirlos.
6. `db/`: migraciones Knex en 3FN, los 9 triggers, funciones, procedimientos y vistas — deben
   contemplar ya las reglas de fidelización (`LoyaltySettings`, `LoyaltyAccount`) y el CRM de
   clientes (`CustomerNote`, `CustomerListItem`/`CustomerDetail`) añadidos en la Sesión 3.
7. `apps/api`: capas config/routes/controllers/services/repositories + Swagger.
8. Sustituir `src/api/mock.ts` por la implementación HTTP sobre `src/api/http.ts` (ya configurado).
9. Docker + MinIO y el `<ImageUploader />` del CMS.

---

## Bitácora

### Sesión 5 — 2026-09-03

**Objetivo:** ahora que la sesión de Claude Code sí reconocía los 7 subagentes de `.claude/agents/`
como agentes reales y aislados (en la Sesión 4 se habían corrido «a mano», simulándolos), correr una
segunda pasada de verdad con `calidad-codigo`, `design-tokens`, `controles-interactivos`,
`navegacion` y `accesibilidad` (`responsive-movil` y `catalogo-filtros` ya habían corrido aislados al
final de la Sesión 4). Con contexto fresco y aislado, cada uno encontró cosas que la primera pasada
manual no había visto.

**Hecho:**

- **`calidad-codigo`**: 🔴 `apps/web/vite.config.js`/`.js.map` estaban **committeados en git** —
  mismo patrón recurrente de la Sesión 3 (`tsc -b` genera un `.js` suelto junto al `.ts`), pero el
  `.gitignore` de esa sesión solo cubrió `apps/web/src/**`, no la raíz de `apps/web`. Borrados y
  reforzado `.gitignore`. 🔴 `npm test` de la raíz se cortaba en silencio porque
  `packages/shared` no tiene tests todavía y Vitest 2.x sale con código 1 al no encontrar
  ninguno — **los 54 tests de `web` nunca llegaban a correr vía `npm test`**, solo si alguien
  corría `vitest` directamente dentro de `apps/web`. Arreglado con `packages/shared/vitest.config.ts`
  (`passWithNoTests: true`, a quitar en cuanto haya un primer test ahí). Más un `eslint`
  (`triple-slash-reference` redundante) y un `toLocaleString('es-GT')` hardcodeado en
  `api/mock.ts` reemplazado por `formatCurrency`.
- **`design-tokens`**: sin hallazgos nuevos.
- **`controles-interactivos`**: 🟠 `--color-danger` usado como **texto** (no como fondo/borde)
  caía a ~4.1–4.3:1 en tema oscuro, por debajo de AA. Token nuevo `--color-danger-text` en
  `packages/shared/tokens.css`, aplicado en `Field`, `Checkbox`, `Button.danger`, `Badge.danger`,
  el banner de error de `/entrar` y el botón de quitar cupón del carrito.
- **`navegacion`**: 🟠 en escritorio, dentro de `/admin`, **no había ningún botón de «Cerrar
  sesión» visible** — solo vivía en el menú móvil del `Header` (`display:none` en desktop). Un
  admin/sastre solo podía salir yendo primero a «Mi cuenta». Agregado a `AdminLayout.tsx`, mismo
  patrón que ya usaba `AccountLayout`. También confirmó, revisando a propósito el fix de
  `useFocusTrap.ts` de la Sesión 4, que el cambio a `transitionend` **no afecta** a `Modal`/`Drawer`
  (se montan ya visibles, entran por la rama síncrona de siempre) — sin regresión.
- **`accesibilidad`** (diagnóstico — no edita): recalculó el contraste a mano en vez de confiar en
  los cálculos de otros agentes y encontró 4 problemas, el primero crítico:
  1. 🔴 **`--color-warning` no estaba remapeado para el tema claro** — y claro es el tema por
     defecto (`ThemeContext.tsx`). Heredaba `--re-gold-bright` (`#e6cc86`, pensado para fondo
     oscuro): como texto sobre el badge «Anticipo pendiente» (uno de los estados más comunes de un
     pedido) el contraste real era ~1.35:1, prácticamente invisible.
  2. 🟠 El fix de `--color-danger-text` de `controles-interactivos` no cubría `Badge.danger` dentro
     de `Card variant="raised"` (color translúcido compuesto sobre un fondo ya no puro): caía a
     ~4.31:1. Mismo problema, nunca antes detectado, para `--color-info`/`Badge.info` (~4.27:1).
  3. 🟠 Doble `<h1>` en las ~19 pantallas de `/admin` y `/mi-cuenta`: `SidebarLayout` ponía uno
     genérico («Back-office»/«Mi cuenta») y cada página hija otro con `SectionHeading as="h1"`.
  4. 🟠 Una fila de tabla clicable (`Table.tsx`, usado en `/admin/clientes`) entraba al tabulador y
     respondía a Enter, pero sin `role="button"` ni soporte de tecla Espacio.
- **Arreglados los 4 hallazgos de `accesibilidad`** (ese agente no edita, solo diagnostica):
  `--color-warning` remapeado en `[data-theme='light']` (`#8a5a12`, ≥4.5:1 verificado); aclarado
  `--color-danger-text` (`#dc7359`) y agregado `--color-info-text` (`#86a8c2`), aplicado en
  `Badge.module.css .info`; el `<h1>` de `SidebarLayout.tsx` pasó a `<p>` (cada página conserva su
  propio `<h1>` más descriptivo); `Table.tsx` ganó `role="button"` y la tecla Espacio junto a Enter
  en las filas clicables.

**Verificado:** `npx tsc -p apps/web/tsconfig.app.json --noEmit` limpio tras cada tanda; `npx vitest
run` 54/54 en verde (y confirmado que `npm test` desde la raíz ya los corre, tras el fix de
`calidad-codigo`); `npx eslint` sin errores en los archivos tocados. En navegador real (Playwright):
`data-theme` es `light` por defecto (confirma que el bug del punto 1 sí aplicaba a cualquier cuenta
nueva), el `--color-warning` computado ya resuelve a `#8a5a12`, el botón «Cerrar sesión» es visible
en `/admin` en escritorio, y solo hay un `<h1>` por página.
**No verificado:** el resto de la lista de `accesibilidad` — contraste con axe/Lighthouse en vez de
cálculo manual, comportamiento con lector de pantalla real, y los puntos 🟡 menores que quedaron sin
tocar (ver el informe completo del agente si se retoma esto).

---

### Sesión 4 — 2026-09-03

**Objetivo:** instalar `.claude/agents/` con 7 subagentes de revisión (responsive, controles,
navegación, catálogo/filtros, accesibilidad, design tokens, calidad de código) y correr una pasada
completa sobre `apps/web`. Los subagentes recién creados no los reconoció el `Agent tool` en esta
misma sesión (el registro se lee al arrancar Claude Code), así que la pasada se hizo ejecutando sus
checklists directamente en lugar de despacharlos como subagentes aislados.

**Hecho:**

- **`calidad-codigo`**: sin hallazgos — sin artefactos `.js` sueltos, `tsc` limpio en ambos paquetes,
  sin `any`/`@ts-ignore`/`console.log`, `pricing.ts` ya coherente con IVA/anticipo/puntos.
- **`design-tokens`**: sin hallazgos — cero colores hardcodeados en componentes; los únicos hex
  encontrados son legítimos y fuera de alcance (`mocks/data.ts` son colores de tela/producto,
  `lib/receipt.ts` es un HTML standalone para imprimir).
- **`responsive-movil`**: `apps/web/src/pages/admin/admin.module.css` (13 pantallas de `/admin`) no
  tenía **ninguna** media query. Se añadió una a 640px para que `.formGrid2` (formularios de
  cliente/pedido) y `.lineItem` (pedido de mostrador) colapsen a una columna en vez de apretarse.
- **`controles-interactivos`**: sin hallazgos — objetivos táctiles ≥24px (WCAG AA), labels bien
  asociados incluso en las páginas nuevas de CRM.
- **`navegacion`**: el menú móvil del `Header` no atrapaba foco ni cerraba con Escape. Se añadió
  `useFocusTrap` (activo solo bajo 960px, el breakpoint real del CSS) y cierre con Escape, mismo
  patrón que `Modal.tsx`, más `aria-controls` en el botón hamburguesa. **La verificación en
  navegador destapó un bug real** que `tsc` no podía ver: `useFocusTrap` movía el foco de forma
  síncrona al abrir, pero el nav del `Header` (a diferencia de `Modal`/`Drawer`, que ni existen en
  el DOM mientras están cerrados) sigue siempre montado y solo se hace visible por una transición
  CSS de `visibility` — mientras dura, el navegador no deja enfocar nada de dentro y `.focus()` no
  hacía nada. Se corrigió en el hook compartido (`apps/web/src/hooks/useFocusTrap.ts`): si el
  contenedor está `visibility: hidden` al montarse, espera al evento `transitionend` real (con un
  plazo de respaldo de 400ms) antes de mover el foco, en vez de asumir que ya es enfocable.
- **`catalogo-filtros`**: `FabricsPage.tsx` y `AccessoriesPage.tsx` guardaban su filtro de categoría
  en `useState` en vez de la URL — la decisión vigente del proyecto solo se cumplía en
  `CatalogPage.tsx`. Se movieron ambas a `useSearchParams` (`?categoria=`), mismo patrón que el
  catálogo.
- **`accesibilidad`** (diagnóstico): confirmado que el `Stepper` no necesita `useFocusTrap` (no es
  un diálogo); `Drawer` ya lleva `role="dialog"`/`aria-modal`; skip-link a `<main id="contenido">`
  correcto. Pendiente real: medir contraste con axe/Lighthouse en vez de solo leer `tokens.css`.
- **Desbordamiento horizontal en `/mi-cuenta` y `/admin`** (reportado por el usuario tras probar la
  app de verdad — la primera pasada de esta sesión no había abierto `/mi-cuenta`): `SidebarLayout`
  (compartido por ambos) tiene, en móvil, una tira de pestañas con scroll horizontal propio
  (`.items { overflow-x: auto }`). Pero `.sidebar` es un ítem de grid y por defecto no encoge por
  debajo del ancho mínimo de su contenido: esa tira empujaba **toda la página** a 591px en vez de
  scrollear ella sola, causando scroll horizontal en las cinco pantallas de cuenta y en `/admin`.
  Arreglado con `min-width: 0` en `.sidebar` dentro de `apps/web/src/layouts/SidebarLayout.module.css`
  (`@media max-width: 1024px`). Verificado con Playwright en las 6 pantallas de `/mi-cuenta` y 4 de
  `/admin`: `document.documentElement.scrollWidth` volvió a igualar el viewport en todas. Un barrido
  posterior del mismo patrón (contenedor flex/grid sin `min-width: 0` alrededor de un hijo con
  `overflow-x: auto`) en el resto de `apps/web` no encontró más casos: las tablas de `/admin`, el
  Kanban de `/admin/produccion` y las pestañas de categoría ponen el scroll directamente en el
  elemento raíz del componente, no detrás de un envoltorio no-scrollable.
- **Primeros tests del proyecto**: 38 tests de Vitest en `apps/web/src/features/cart/` —
  `cartReducer.test.ts` (fusión de líneas por modelo/tela/opciones, tope de `maxQuantity`, quitar
  cupón y puntos al vaciar el carrito, `REPLACE`/`CLEAR`) y `pricing.test.ts` (`priceMadeToMeasure`,
  `calculateTotals`: reparto a prorrata del anticipo entre a medida y listo-para-llevar, tope del
  descuento del cupón y de los puntos canjeados al subtotal, fidelización apagada). Hasta ahora el
  repo no tenía ni un solo archivo `*.test.*` pese a tener Vitest y RTL configurados.
- **Primeros tests de RTL**: 16 tests más — `Button.test.tsx` (incluye `ButtonLink` con
  `MemoryRouter`, y el nombre accesible «Procesando» que toma el botón mientras `isLoading` oculta
  el texto con `visibility: hidden`), `OptionCard.test.tsx` (es un `<input type="radio">` real:
  `name`/`value`/`checked`, `onChange`, `disabled`, las tres variantes de `priceDelta`) y
  `context/CartContext.test.tsx` — el flujo «añadir al carrito» de verdad, con un harness mínimo
  sobre `CartProvider` (sin montar página, router ni React Query): añadir suma a los totales y abre
  el drawer, añadir dos veces fusiona la línea, y el carrito sobrevive a un remount vía
  `localStorage`. 54/54 tests en verde, `tsc` y `eslint` limpios.

**Verificado:** `npx tsc -p apps/web/tsconfig.app.json --noEmit` limpio tras cada tanda de cambios,
y además — a diferencia de sesiones anteriores — un recorrido real en navegador con Playwright
(Vite dev server + Chromium headless, viewport 375px) contra los cinco cambios de esta sesión:
menú móvil (foco atrapado + Escape), `/telas` y `/accesorios` (filtro en la URL, sobrevive a
recargar y al botón atrás) y `/admin/pedidos/nuevo` (el grid de dos columnas sí colapsa a una en
móvil). Los cinco pasaron tras corregir el bug de `useFocusTrap` descrito arriba — que **no** se
habría detectado solo con `tsc`. También se confirmó que `Modal` y el `Drawer` del carrito (que se
montan ya visibles) no se vieron afectados por el cambio al hook compartido.
También `npx vitest run` (38/38 verdes) y `npx eslint` sin errores sobre los dos archivos de test
nuevos.
**No verificado:** dispositivo móvil real (solo viewport emulado) y medición de contraste con
axe/Lighthouse.

---

### Sesión 3 — 2026-08-09 a 2026-08-18

**Objetivo:** ampliar el back-office más allá del alcance original de la Sesión 2 (fidelización,
CRM de clientela, pedidos de mostrador) y luego cerrar con una pasada de accesibilidad táctil/móvil
y revisión de código. Esta entrada se reconstruyó a partir de `git log` porque no se dejó registrada
en su momento — los commits de esta sesión traían mensajes genéricos («se ajustó el diseño»).

**Hecho:**

- **Programa de fidelización (puntos):** `LoyaltySettings`/`LoyaltyAccount` en
  `packages/shared/src/types.ts`; `pointsEarned`/`pointsRedeemed`/`pointsDiscount` añadidos a
  `Order` y `CheckoutResult`. `PointsRedeemBox` integrado en `/carrito`; `MyLoyaltyPage`
  (`/mi-cuenta/puntos`) para el cliente y `AdminLoyaltyPage` (`/admin/fidelizacion`) para ajustar
  la tasa de acumulación/canje.
- **CRM de clientela en el back-office:** `CustomerNote`, `CustomerListItem`, `CustomerDetail` en
  `packages/shared`; `AdminCustomersPage` (`/admin/clientes`) y `AdminCustomerDetailPage`
  (`/admin/clientes/:id`) con historial de pedidos, notas de mostrador, medidas y saldo de puntos.
- **Pedidos de mostrador:** `AdminNewOrderPage` (`/admin/pedidos/nuevo`) para que el taller cree
  pedidos manualmente; `Order.deliveryAddress` pasó a `Address | null` (`null` = se recoge en el
  taller, no se envía).
- **Accesibilidad táctil y responsive en móvil** (commit `403178c`): logout oculto en «Mi cuenta»
  corregido, botones de eliminar/stepper del carrito agrandados, CTA de «Crear cuenta» y texto de
  error de formularios más grandes, contraste del botón primario en tema claro corregido, hueco
  vacío del header en tablet/móvil arreglado, barra fija de pago añadida al carrito.
- **Artefactos de compilación sueltos** (commit `ef9338d`): `tsc -b` dejaba `.js`/`.js.map` sueltos
  junto a los `.ts`/`.tsx` fuente sin que estuvieran en `.gitignore`; ya llegaron a colarse en un
  commit anterior y llegaron a tapar código `.tsx` recién editado (Vite resuelve `.js` antes que
  `.tsx`). Se añadió `apps/web/src/**/*.js(.map)` y `packages/shared/src/**/*.js(.map)` a
  `.gitignore`. Sigue habiendo que borrar esos archivos sueltos a mano tras correr `tsc -b`.
- **Revisión de código** (commit `fd8c298`): ajustes menores repartidos en páginas de cuenta y
  admin, `Icon.tsx`, `Button.module.css`, y la tanda grande de tipos nuevos de `packages/shared`
  descrita arriba.

**Verificado:** `npx tsc -p apps/web/tsconfig.app.json --noEmit` limpio al momento de escribir esta
entrada (Sesión 4). **No verificado en su momento:** no quedó registro de una prueba visual en
dispositivo real tras estos cambios — sigue pendiente, ver «Próximos pasos».

---

### Sesión 2 — 2026-08-05

**Objetivo:** arrancar el monorepo y, tras un cambio de alcance a mitad de sesión, entregar el
diseño completo del frontend funcionando.

**Hecho:**

- **Raíz del monorepo:** workspaces, `tsconfig.base.json`, ESLint 9 flat config, Prettier,
  `.gitignore`, `.env.example`.
- **Archivos de control:** `PROMPT_MAESTRO.md` (la especificación) y este `ESTADO.md`.
- **`packages/shared`:** `constants.ts` (catálogos cerrados del dominio), `types.ts` (DTOs de toda
  la API) y `tokens.css` (paleta §3 ampliada con escala, motivo de sastre y tema claro).
- **Design system (21 componentes):** Button/ButtonLink, IconButton, Icon (set propio de 40+
  iconos, con vocabulario de sastrería), Card compuesto, Badge + OrderStatusBadge + StageBadge,
  Field/Input/Textarea/Select/Checkbox, OptionCard, QuantityStepper, Stepper, Modal, Drawer, Toast,
  Tabs, Table, Price, SectionHeading/Rule, Skeleton, EmptyState, Spinner.
- **Capa de datos simulados:** `src/mocks` (fixtures completos + imágenes SVG generadas, sin red) y
  `src/api` (cliente axios con interceptores ya configurado + implementación mock tras la misma
  firma). Incluye el pedido `RE-2026-01024` del prompt maestro.
- **Contextos:** Theme (oscuro/claro), Toast, Auth y Cart (`useReducer` + `localStorage`).
- **Router:** React Router v6 con `lazy()` por página y `<RequireRole>`; 4 layouts.
- **24 páginas** cubriendo el flujo 1→8 del cliente, el área de cuenta y las 8 pantallas del
  back-office.

**Cambio de alcance a mitad de sesión:** el usuario pidió trabajar **solo en el diseño del
frontend**. Se detuvieron las tareas de `db/`, `apps/api` y Docker que estaban planificadas.

**Verificado:** `tsc --noEmit` limpio; `vite dev` arranca sin errores y todos los módulos resuelven
(incluido el alias a `packages/shared`). **No verificado:** el recorrido visual en navegador y en
móvil real — queda para la próxima sesión.

---

### Sesión 1 — anterior

Definición de la especificación del proyecto (el prompt maestro). Sin código.
