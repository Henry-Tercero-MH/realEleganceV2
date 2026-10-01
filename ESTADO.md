# Estado del proyecto — Real Elegance

> Bitácora de avance **por sesión**. Se actualiza al final de cada sesión de trabajo.
> Especificación de referencia: [PROMPT_MAESTRO.md](PROMPT_MAESTRO.md)

**Fase actual:** 🎨 Diseño de frontend (con datos simulados, sin backend)

**⚠️ Lanzamiento parcial en curso, ya desplegado en `realelegancegt.com` (desde 2026-09-29):** el
sitio se publica primero **solo informativo**. `apps/web/src/config/features.ts` tiene
`SHOP_ENABLED = false`: carrito, checkout, `/mi-cuenta`, `/admin`, `/entrar`/`/crear-cuenta`,
`/seguimiento` y el catálogo de trajes (`/catalogo`) están **deliberadamente** ocultos de la
navegación y bloqueados por ruta (redirigen a inicio). No es un bug ni algo a revertir — es la
decisión vigente hasta que exista `apps/api`. "Agendar cita/visita/consulta" abre un horario de
**Google Calendar** (`APPOINTMENT_SCHEDULING_URL`), no WhatsApp — eso quedó solo para preguntas
generales. Ver Sesiones 6 y 7 para el detalle completo antes de tocar routing, `Header`/`Footer`,
o cualquier CTA de "agendar cita"/"personalizar".

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
| `apps/web` — fase solo informativa | 🚧 En curso | `config/features.ts` (`SHOP_ENABLED = false`) oculta compra/cuenta/admin/seguimiento/catálogo de trajes; "agendar cita" va a Google Calendar, WhatsApp (`+502 3074-5202`) queda para preguntas; contacto y redes reales en `Footer` + widget flotante `FloatingSocial`. Sitio ya desplegado en `realelegancegt.com`. Falta: `APPOINTMENT_VIRTUAL_URL` sigue apuntando al horario presencial (placeholder) hasta que el usuario cree el horario virtual con Meet en Google Calendar |
| `apps/web` — idioma ES/EN | 🚧 En curso | `LanguageContext.tsx` + `i18n/dictionary.ts` (interfaz tipada, ES por defecto). Traducido: Header, Footer, Home, Telas, Accesorios, El taller, 404, pantalla de sin conexión — el resto sigue oculto por `SHOP_ENABLED`. No traduce el contenido de `src/mocks/data.ts` (nombres/descripciones de telas, trajes, accesorios: es dato, no texto de interfaz) |
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

### Sesión 8 — 2026-09-30

**Objetivo:** el usuario vio el stepper de "Cómo funciona" (Home) en inglés y pidió que al pasar el
cursor por cada paso se abriera "un modal al lado derecho" con más información de ese paso.

**Hecho:**

- Se le aclaró (implícitamente, aplicándolo así) que lo pedido es un **tooltip/popover** disparado
  por hover/foco, no un modal bloqueante — un modal exige cerrarse a mano y este se cierra solo al
  quitar el cursor.
- `components/ui/Stepper.tsx`: nuevo campo opcional `detail?: ReactNode` en `StepperStep`. Cuando un
  paso lo trae, se renderiza un `<span role="tooltip">` fijo en el DOM (no montado/desmontado por
  JS) y se conecta al disparador con `aria-describedby`, para que un lector de pantalla lo anuncie
  al enfocar el paso. Es **opt-in y retrocompatible**: `TrackingPage.tsx` y `CheckoutSuccessPage.tsx`
  usan el mismo `<Stepper>` sin pasar `detail`, así que no cambian en nada (además siguen ocultos
  detrás de `SHOP_ENABLED`).
- Visibilidad resuelta en CSS puro (`:hover`/`:focus-within` sobre el `<li>`), sin estado de React:
  más simple y sin parpadeos por retraso de render.
- Accesible por teclado, no solo con mouse: al paso sin botón (los no completados, que hoy son
  todos en esta vista) se le agregó `tabIndex={0}` para que Tab lo alcance y dispare el mismo
  tooltip que el hover.
- Posicionamiento distinto según el layout real del stepper:
  - **Horizontal (escritorio, 8 pasos en fila)**: el tooltip aparece **arriba** del círculo,
    centrado — "a la derecha" literal habría invadido el paso siguiente, con 8 pasos apretados en
    fila no hay margen para eso.
  - **Vertical / fila colapsada en móvil (`≤720px`, mismo `<Stepper orientation="horizontal">` que
    se apila)**: ahí sí "a la derecha" tiene sentido, pero se descartó por riesgo de desbordar la
    pantalla en un teléfono angosto; en su lugar se despliega **debajo** del texto del paso, con alto
    animado (0 → contenido), sin superponerse a nada.
- Contenido: se agregó `detail` (frase más larga que la `description` corta que ya existía) a los 8
  `journeySteps` de `i18n/dictionary.ts`, en español e inglés — la interfaz `Dictionary` fuerza que
  ambos tengan las mismas claves, así que no se puede dejar uno sin traducir.

**Corregido durante la propia verificación** (dos bugs reales de overflow en móvil, ninguno visible
en escritorio):

1. La regla base `.tooltip { width: max-content }` seguía activa dentro del media query de móvil —
   con el texto largo del `detail`, eso fuerza el ancho a la línea completa sin partir (~670px),
   desbordando un viewport de 390px. Se corrigió fijando `width: 100%` en la variante de móvil.
2. La transición de `:hover`/`:focus-within` de escritorio (`transform: translate(-50%, 0)`, para
   centrar arriba del círculo) seguía aplicando en móvil por especificidad de selector, corriendo el
   bloque 50% de su propio ancho hacia la izquierda y sacándolo de pantalla. Se corrigió con
   `transform: none` explícito en la variante de móvil.

**Verificado** con Playwright en navegador real (no solo `tsc`): a 1280px el tooltip aparece arriba
del paso "Personalizar" sin salirse por ningún lado; a 390px aparece debajo, ocupando el ancho del
`<li>` (342px, sin desbordar los 390px del viewport); enfocar por teclado (Tab) el paso "Cotizar"
también revela el tooltip y `aria-describedby` apunta al `id` correcto del `role="tooltip"`. `tsc`
limpio.

**No verificado:** contraste de color del tooltip en tema oscuro con un lector de pantalla real (solo
inspección visual); no se corrió `vitest` porque no hay test que cubra `Stepper.tsx` hoy.

**Corrección sobre la marcha — de tooltip flotante a panel que empuja (carrusel)**: el usuario vio el
resultado y aclaró su idea real: no quería un tooltip superpuesto, sino un panel al lado derecho del
**disco** (no del paso completo) que se despliega "como desenvolver tela" y **empuja** a los pasos
siguientes (se abre espacio real, no se monta encima) — y que ahí, específicamente en "Explorar" y
"Personalizar", se muestren los estilos de traje del taller a modo de ejemplo.

- `Stepper.module.css`: el panel dejó de ser `position: absolute` y pasó a ser un hijo flex más del
  propio `<li>` (`flex: 0 0 auto; width: 0`, transición de `width`) — al abrirse con
  `:hover`/`:focus-within` gana `320px` de ancho de verdad, lo que empuja a los `<li>` siguientes
  dentro de la fila. Para que esto tuviera adónde crecer sin desbordar la página, `.horizontal` (el
  `<ol>`) ganó `overflow-x: auto` — con un panel abierto la fila mide más que el contenedor y se
  vuelve desplazable, el "carrusel" que pidió el usuario; en reposo (todos los paneles en `width: 0`)
  se ve exactamente igual que antes, sin scroll.
  También cambió `.horizontal .step` de columnas iguales (`flex: 1`, un octavo del ancho cada una) a
  columnas por contenido (`flex: 0 0 auto`) — si no, el panel no tenía forma de empujar nada, porque
  `flex: 1` reparte el ancho fijo del contenedor entre los 8 pasos sin importar cuánto contenido tenga
  cada uno.
  La cintra métrica que conecta los discos (`::before`) asume que el disco está centrado en el ancho
  de su propio `<li>` — deja de ser cierto en el paso que tiene el panel abierto (su caja ahora incluye
  el panel), así que esa única línea se oculta mientras el panel está abierto (`.step:hover::before`);
  el panel mismo ocupa visualmente ese tramo, así que no se nota.
- `Stepper.tsx`: el panel ahora es un `<div>` hermano del `trigger` dentro del `<li>` (antes vivía
  anidado como un `<span>` suelto) — mismo mecanismo de visibilidad por CSS, sin JS.
- **Contenido real para "Explorar"/"Personalizar"**: en vez de texto, un componente `StyleGallery`
  nuevo en `HomePage.tsx` muestra los 5 estilos del taller (`suitStyles`: Clásico, Cruzado, Esmoquín,
  Entallado, Tres piezas) con foto, nombre y precio — un representante por estilo, elegido por
  `styleId` de los primeros 12 `suitModels` que trae `useSuits({ pageSize: 12 })` (mismo hook de
  React Query que ya usaba la sección de destacados, no se inventó una fuente de datos nueva).
  Los otros 6 pasos (Cotizar, Agendar, Medidas, Confirmado, Confección, Entrega) **conservan** el
  panel de texto de la corrección anterior — solo "Explorar" y "Personalizar" muestran la galería,
  a pedido explícito del usuario.
  Nota de datos: dos de las cinco fotos (`entalledeunsaco.png`, `coloresdetraje.png`) son imágenes
  promocionales con texto superpuesto, no fotos de producto limpias — vienen así de la Sesión 3/4 y
  se reutilizan también en la sección de Instagram de esta misma página; no se generaron fotos nuevas,
  queda igual de "mock" que el resto del catálogo simulado.

**Verificado** con Playwright en navegador real: en reposo el stepper se ve igual que antes de este
cambio (sin regresión); al pasar el cursor por "Explorar" el panel se abre con `width: 320px` real
(confirmado con `getBoundingClientRect`) y empuja visualmente a "Personalizar", "Cotizar", etc. hacia
la derecha; la fila del stepper pasa de `scrollWidth === clientWidth` (sin scroll) a
`scrollWidth > clientWidth` (con scroll) exactamente cuando el panel se abre. En móvil (390px) el
mismo panel se despliega hacia abajo (alto en vez de ancho) sin desbordar el viewport
(`document.documentElement.scrollWidth` se mantiene en 390). El foco por teclado (Tab) también abre el
panel. `tsc`, `eslint` y `vitest` (54/54) limpios.

**Segunda corrección — de "empuja y hace scroll" a superpuesto**: viendo el carrusel en uso, el usuario
pidió lo contrario a nivel visual: que no se vea ningún scroll y que el panel se muestre **encima**
del diseño en vez de empujarlo, "para evitar que se dañe el diseño" (el screenshot que mandó mostraba
la etiqueta "PERSONALIZAR" apretada contra el panel de "Explorar" al empujarse). Se revirtió el
mecanismo de layout manteniendo todo lo demás (galería de estilos, texto de los otros 6 pasos, apertura
por hover/foco):

- `.panel` volvió a `position: absolute` (como el tooltip original de la primera versión), con
  `z-index` y sombra para leerse claramente "por encima" de la página, no integrado en el flujo. Ya no
  empuja nada — por eso se le quitó a `.horizontal` el `overflow-x: auto` y a `.horizontal .step` el
  `flex: 0 0 auto` (vuelven a ser 8 columnas iguales, como antes de este trabajo). El "desenvolver"
  sigue ahí: el ancho anima de `0` a `320px`, revelando el contenido de izquierda a derecha.
- **Bug encontrado al verificar el propio cambio**: con el panel superpuesto, el último paso
  ("Entrega") y el penúltimo ("Confección") no tienen 320px libres antes del borde de la página — abrir
  hacia la derecha ahí desbordaba la página entera (`document.documentElement.scrollWidth` pasaba de
  1280 a 1580px), el mismo problema de scroll que se quería evitar, ahora a nivel de página en vez del
  stepper. Se corrigió con `.horizontal .step:nth-last-child(-n+2) .panel` — los últimos dos pasos
  abren el panel hacia la **izquierda** (`right: calc(100% + space-3)` en vez de `left`) en lugar de
  hacia la derecha.
- Móvil no cambió de mecanismo (ya empujaba hacia abajo dentro de la columna, sin scroll horizontal,
  que es justo lo que no se quería arriba) — solo se le agregó `position: static` explícito al panel
  para anular el `position: absolute` del caso de escritorio.

**Verificado** con Playwright: en reposo y con cualquier panel abierto, `stepper.scrollWidth ===
stepper.clientWidth` (nunca aparece scrollbar en la fila) y `document.documentElement.scrollWidth ===
window.innerWidth` (tampoco en la página), probado explícitamente en "Explorar" (primero) y "Entrega"
(último, el caso que se rompía antes del fix de `nth-last-child`). En móvil (390px) sigue sin
desbordar. Foco por teclado sigue abriendo el panel. `tsc`, `eslint` y `vitest` (54/54) limpios.

**Ajuste final — título dentro del panel**: el usuario mandó una captura del panel de "Explorar" (que
ya traía su propio título "EXPLORAR" porque `StyleGallery` lo agregaba a mano) pidiendo que fuera
"como este, con su título, para no confundir" — es decir, que **todos** los paneles lo tuvieran, no
solo los dos con galería de estilos. Como el título repite la etiqueta del paso (`step.label`), que
ya es un dato que `Stepper` conoce, se movió ahí en vez de dejarlo como responsabilidad de cada
contenido: `Stepper.tsx` ahora antepone un `<p class="panelTitle">{step.label}</p>` dentro de
`.panelInner`, antes de `step.detail`, para los 8 pasos por igual. `StyleGallery` en `HomePage.tsx` se
quedó solo con la grilla (se le quitó el `title` que traía duplicado). Tiene sentido estando el panel
superpuesto: al no estar pegado al layout del paso, puede quedar flotando lejos de su disco (sobre todo
los dos de la derecha, que abren hacia la izquierda) y sin título sería fácil confundirlo con el del
paso vecino.

Verificado visualmente en navegador real: los 8 pasos muestran su etiqueta en mayúsculas como
encabezado del panel ("EXPLORAR", "COTIZAR", etc.), con el mismo estilo tipográfico que ya usaba
`StyleGallery`. `tsc`, `eslint` y `vitest` (54/54) limpios.

---

### Sesión 7 — 2026-09-30

**Objetivo:** dos cosas del lanzamiento real (no de código per se, pero que sí tocaron código):
configurar Google Search Console para `realelegancegt.com`, e integrar un horario de citas de
Google Calendar para reemplazar el "agenda por WhatsApp y ya veremos hora" de la Sesión 6.

**Hecho:**

- **Google Search Console**: el usuario verificó el dominio por DNS (registro TXT) en vez de por
  etiqueta HTML — esa parte no toca el repo. Al enviar `sitemap.xml` dio "No se ha podido obtener";
  se verificó con `WebFetch` que tanto `/` como `/sitemap.xml` sí responden bien en
  `realelegancegt.com` (el sitio **ya está desplegado**), así que el error fue casi seguro un tema
  de tiempo (DNS recién propagado) — se le indicó reintentar el envío. De paso: como es una SPA de
  React sin SSR/prerender, el HTML crudo que ve un fetcher sin JS está casi vacío (`<div id="root">`);
  Google sí ejecuta JS para indexar pero más lento que un sitio estático — anotado como algo a
  vigilar si la indexación tarda mucho, no como bug.
- **Horario de citas de Google Calendar** (Google Calendar Appointment Schedules — la persona elige
  día/hora ella misma, virtual o presencial): `APPOINTMENT_SCHEDULING_URL` nuevo en
  `config/features.ts` (URL que dio el usuario, limpiada de un `fbclid` de rastreo de Meta que
  traía). **Decisión del usuario** (preguntada explícitamente): Calendar **reemplaza** a WhatsApp en
  todos los botones de "Agendar cita/visita/consulta" — `Header.tsx` (escritorio y menú móvil,
  antes decía "Agendar por WhatsApp"), `HomePage.tsx` (hero y CTA final), `Footer.tsx`,
  `FabricsPage.tsx` ("Ver el muestrario en persona"), `AboutPage.tsx` ("Agendar una visita") y
  `CatalogPage.tsx` ("Agendar una consulta", aunque hoy está detrás de `/catalogo`, que sigue
  oculto). WhatsApp no desapareció: se dejó como canal para preguntas generales — nuevo enlace
  "Escríbenos por WhatsApp" en el `Footer` (mensaje genérico, no el de "agendar cita" de antes), y
  `SuitDetailPage.tsx` ("Cotizar este traje por WhatsApp") se dejó igual a propósito, porque es una
  consulta sobre un modelo, no agendar una hora.

**Verificado:** `tsc`, `eslint` y `vitest` (54/54) limpios. En navegador real (Playwright) en `/`,
`/telas` y `/el-taller`: todos los botones "Agendar…" apuntan a la URL limpia de Google Calendar
(sin `fbclid`); el único `wa.me` que queda es "Escríbenos por WhatsApp" con el mensaje genérico. Con
`WebFetch` se confirmó que el sitio en `realelegancegt.com` está desplegado y sirviendo el `index.html`
y el `sitemap.xml` actuales.

**Corrección sobre la marcha — "Agendar una cita" repetido, y virtual vs. presencial**: el usuario
señaló que el botón se repetía igual en todos lados y que el hero de inicio debía ofrecer **dos
horarios distintos** de Google Calendar — presencial y virtual (este último con videollamada de
Meet generada automáticamente, que se configura en el propio horario de Google Calendar, no aquí).
Un solo horario de Calendar no puede ofrecer ambas modalidades a la vez; hacen falta dos horarios
(dos URLs) distintos. Se renombró `APPOINTMENT_SCHEDULING_URL` → `APPOINTMENT_IN_PERSON_URL` y se
agregó `APPOINTMENT_VIRTUAL_URL` en `config/features.ts` (por ahora apunta al mismo horario
presencial como placeholder — **el usuario todavía tiene que crear el horario virtual en Google
Calendar con Meet activado y pasar esa URL**; buscar `APPOINTMENT_VIRTUAL_URL` cuando la tenga). Se
agregaron los íconos `video` y `mapPin` a `Icon.tsx` (no existían). Solo el **hero de inicio**
cambió a dos botones — "Cita presencial" / "Cita virtual" — porque fue lo único que pidió el
usuario; Header, CTA final de Home, Footer, Telas y El taller se quedaron con un solo botón
genérico apuntando a `APPOINTMENT_IN_PERSON_URL`, sin tocar.
**Al corregir esto se rompió el build una vez**: se renombraron los usos en cada archivo (`sed`)
antes de renombrar el `export const` real en `config/features.ts`, así que el módulo no exportaba
`APPOINTMENT_IN_PERSON_URL` todavía — el usuario lo vio como un `SyntaxError` en consola del
navegador y lo reportó; se corrigió en el siguiente turno y se verificó `tsc` limpio. Lección: al
renombrar un export con `sed` sobre los *usos*, tocar primero (o a la vez) la declaración real.

**No verificado:** que Search Console termine aceptando el sitemap tras el reintento, y la URL real
del horario virtual (sigue pendiente de que el usuario la cree y la pase).

**Pulido de UX — barra de carga en vez de círculo**: `PageLoader.tsx` (el fallback de `<Suspense>`
entre páginas, usado en `AppLayout`/`AccountLayout`/`AdminLayout`/`AuthLayout`) cambió el `Spinner`
circular por una barra horizontal que se llena. Como no hay un porcentaje real (es la descarga de un
chunk, no una subida medible), simula un "trickle" clásico: avanza rápido al principio y cada vez
más despacio hacia 92 %, sin llegar nunca al 100 % — la página real la reemplaza antes de notarse el
tope. Respeta `prefers-reduced-motion` (arranca directo en 92 %, sin el intervalo). El `Spinner`
circular **no se tocó** en `Button.tsx` (loading de botones de formulario) — ese caso es distinto
(indeterminado, espacio chico dentro de un botón) y hoy no es visible de todas formas porque las
páginas con formularios siguen detrás de `SHOP_ENABLED`. Verificado en navegador real con la red
estrangulada por CDP (Playwright) para poder ver la barra a medio llenar antes de que el chunk
terminara de bajar.

**"Sin conexión" — de aviso chico a pantalla completa**: el usuario preguntó si el sitio funcionaba
sin internet — no, es una SPA normal sin ningún manejo de offline. Se le dieron tres niveles (aviso
ligero / PWA instalable que funciona offline / ambos); eligió el ligero primero, pero en el siguiente
mensaje pidió que en realidad ocupara toda la pantalla, no una barra. Quedó así:

- `hooks/useOnlineStatus.ts` — mismo patrón `useSyncExternalStore` que `useMediaQuery`, escuchando
  los eventos `online`/`offline` del navegador.
- `components/OfflineScreen.tsx` (reemplaza al primer intento, `ConnectionBanner.tsx`, que se borró):
  pantalla completa (`position: fixed; inset: 0`) que tapa **todo** el sitio —header, footer, todo—
  mientras `navigator.onLine` sea `false`. Ícono nuevo `wifiOff` en `Icon.tsx` (señal de wifi
  tachada). Sin botón de "reintentar": desaparece sola en cuanto `useOnlineStatus` detecta el evento
  `online`, no hace falta simularlo.
- Sigue sin intentar que el sitio sea navegable sin internet (eso sería el nivel "PWA completo", no
  elegido) — solo dejarlo clarísimo cuando pasa, en vez de que algo falle en silencio.

Verificado en navegador real alternando `context.setOffline(true/false)` con Playwright: aparece,
desaparece, sin quedarse pegado.

**De paso, un carrete de hilo roto para el 404**: al describir la idea de "sin conexión" el usuario
pensó en un carrete con el hilo roto, pero decidió que encajaba mejor en el 404 ("esta página se
descosió" — la copy ya usaba lenguaje de costura). `EmptyState.tsx` ganó una prop
`illustration?: ReactNode` (si se pasa, reemplaza al `icon` chico y al círculo que lo envuelve) para
poder usarla sin tocar las otras ~19 pantallas que ya usan `EmptyState` con `icon`; `NotFoundPage.tsx`
la usa en vez de `icon="search"`. Tres versiones en la misma sesión:
1. Ilustración SVG propia a mano (`components/SpoolBrokenThread.tsx`) — reemplazada enseguida.
2. Una foto que el usuario generó/consiguió (`icono404.png`, 1536×1024, **RGB sin canal alfa** —
   fondo negro pegado). En tema claro se habría visto como un rectángulo negro suelto, así que se
   enmarcó en `.frame` con fondo fijo `var(--re-noir)` (el token crudo, no `--color-surface`, que
   cambia con el tema) y borde/sombra dorada.
3. **Versión final**: el usuario pasó otra imagen, `hilo404.png` (1774×887, **RGBA de verdad**, con
   transparencia). Con canal alfa real no hace falta marco ni fondo propio — se ve bien tal cual
   sobre el tema claro y el oscuro. Se simplificó `NotFoundPage.module.css` a un solo `.photo`
   (`max-width: 320px`, sin fondo/borde) y se borraron `icono404.png` y `SpoolBrokenThread.tsx`, ya
   sin uso.

Verificado visualmente en navegador en tema claro y oscuro con la versión final.

**Bug real: apagar el wifi no mostraba la pantalla de sin conexión.** El usuario lo probó en la
práctica (no en Playwright) y nada pasaba. Causa: `navigator.onLine` y los eventos
`online`/`offline` del navegador **no son confiables** — es un problema conocido, sobre todo en
escritorio: reflejan si el adaptador de red sigue "activo" a ojos del sistema operativo, no si hay
internet de verdad, y muchas veces ni siquiera se actualizan al apagar el wifi. Ahí es donde fallaba
la primera versión de `useOnlineStatus.ts` (solo escuchaba esos eventos).

Se reescribió para comprobar la conexión de verdad: cada 6s (si está en línea) o cada 3s (si se cree
sin conexión), hace `fetch('/', { method: 'HEAD', cache: 'no-store' })` con un timeout de 4s — si el
navegador no puede completar esa petición, no hay internet, sin importar lo que diga
`navigator.onLine`. Los eventos del navegador se siguen escuchando (cuando sí disparan, como en modo
avión de un celular, reacciona al instante en vez de esperar al siguiente ciclo), pero ya no son la
única señal. Verificado reproduciendo el bug real: se bloquearon las peticiones de red con Playwright
**sin** usar `context.setOffline` (que sí dispara el evento `offline` y habría ocultado el problema)
— con las peticiones fallando de verdad pero sin el evento, la pantalla de sin conexión igual
apareció a los ~8s, y desapareció al restaurar la red.

**🔴 Bug de producción encontrado: cualquier página interior daba 404 de Vercel, no la nuestra.** El
usuario mandó una captura del 404 genérico de Vercel ("This page doesn't exist" / `404 NOT_FOUND`).
Se confirmó con `WebFetch` contra `https://realelegancegt.com/telas` (una ruta real, no un typo):
**HTTP 404 de verdad**, la app de React nunca llega a cargar. Causa raíz: es una SPA con
`createBrowserRouter` (rutas reales tipo `/telas`, no hash-routing); sin una regla de *rewrite* en
el hosting, Vercel busca un archivo literal en esa ruta, no lo encuentra, y sirve su propio 404
**sin pasarle la petición a `index.html`** — React Router nunca llega a decidir nada, así que ni
nuestro `NotFoundPage` ni ninguna otra página interior cargan si se entra por URL directa (enlace
compartido, marcador, o simplemente refrescar en `/telas`, `/accesorios`, `/el-taller`, etc.).

El usuario no recordaba qué "Root Directory" tiene configurado el proyecto en Vercel (`apps/web` vs.
la raíz del monorepo), y como el sitio ya está desplegado y sirviendo `/` y `/sitemap.xml`
correctamente, **no se tocó nada del build** (arriesgar `buildCommand`/`outputDirectory` a ciegas
podría romper un despliegue que ya funciona). Se agregó un `vercel.json` mínimo — solo la regla de
*rewrite*, nada de build — en **los dos sitios posibles**: `/vercel.json` (raíz del repo) y
`/apps/web/vercel.json`. Solo uno de los dos es el que Vercel realmente lee según su Root Directory;
el otro queda inerte y no estorba. Contenido de ambos:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
**Pendiente de verdad**: esto no toma efecto hasta que el usuario lo despliegue (commit + push, o
como sea su flujo con Vercel). Después de ese despliegue, volver a probar
`https://realelegancegt.com/telas` — si sigue dando 404 de Vercel, hay que revisar a mano el Root
Directory real en el dashboard de Vercel (Project Settings → General) para saber cuál de los dos
`vercel.json` hay que editar o si hace falta otro ajuste.

**Corrección: la pantalla de "sin conexión" daba falsos positivos.** Tras el fix anterior, el
usuario reportó que aparecía **con internet de verdad**, cada vez que iba a inicio. Causa: la
comprobación activa (`fetch('/')`) se declaraba offline con un solo intento fallido — y un intento
suelto puede fallar por razones que no son "no hay internet" (compitiendo por ancho de banda con la
carga inicial de la página, una respuesta que tarda más de los 4s de margen que tenía, etc.), sobre
todo justo al navegar a inicio. `useOnlineStatus.ts` ahora exige **dos fallos seguidos**
(`FAILURES_BEFORE_OFFLINE`) antes de dar por offline — el primer fallo dispara un reintento rápido
(2.5s) en vez de mostrar la pantalla de inmediato; un solo éxito, en cambio, restaura "en línea" al
instante. De paso: `HEAD` → `GET` (algunos hosts/CDN, Vercel con *rewrites* incluido, no tratan
`HEAD` igual en todas las rutas) y el timeout subió de 4s a 6s. Verificado con Playwright en los dos
sentidos: (1) un solo intento retrasado más allá del timeout **ya no** dispara la pantalla; (2) una
caída real y sostenida (peticiones bloqueadas de verdad) sigue mostrándola, ahora a los ~10-13s en
vez de ~8s — el precio de dejar de tener falsos positivos.

**Logo real**: el usuario dio `apps/web/public/images/logore.png` (PNG transparente, 1254×1254, el
monograma "RE" dorado con relieve 3D) para reemplazar el monograma en texto plano que tenía
`Logo.tsx` (un cuadro con filete dorado y las letras "RE"). Se conectó directo (`<img>`, `alt=""`
porque es decorativo — el nombre completo ya va en texto al lado para lectores de pantalla) y se
quitó el recuadro con borde que llevaba la versión en texto, porque la imagen ya tiene peso visual
propio. **Detalle que se le señaló al usuario y decidió dejar así**: el PNG trae un halo
rojo/amarillo tenue alrededor de las letras (recorte de fondo imperfecto, visible sobre todo en la
imagen a tamaño completo) — al tamaño real del header casi no se nota, confirmado visualmente con
una captura ampliada (`deviceScaleFactor: 4`). Tamaño: 34px → 42px (+25%, a pedido) → **50px**
(el usuario dijo que el primer aumento "aún no se notaba más grande" corriendo local con
`npm run dev`; el código sí tenía 42px — probablemente caché del navegador/HMR, no se investigó más
a fondo porque pidió directamente subirlo a 50 — si vuelve a pasar con futuros cambios de tamaño,
sospechar primero de la caché antes que del código).

**Efecto metálico en el botón primario**: el usuario pasó una paleta dorada y un degradado sugeridos
(generados por otra IA, con hex nuevos sin relación con `tokens.css`) y pidió "agrega este efecto y
color metálico a la paleta o solo botones, como consideres". Se decidió **no** tocar la paleta
(`--color-primary` y el resto de semánticos ya pasaron por el trabajo de contraste de la Sesión 5,
usado en decenas de componentes — cambiarlos sin volver a validar contraste es alto riesgo para un
pedido que ni siquiera lo pedía con claridad) y aplicar el efecto **solo al botón `.primary`** de
`Button.module.css`/`ButtonLink` (comparten las mismas clases): un `background-image` con
`linear-gradient(135deg, …)` en vez de `background-color` plano, usando los tonos **ya existentes**
de la paleta (`--re-gold-deep`, `--re-gold`, `--re-gold-bright`) para que el contraste con
`--color-on-primary` siga siendo el mismo que ya se validó. Se agregó un único token nuevo,
`--re-gold-glint` (`#fff3d6`, casi blanco) en `tokens.css`, para el punto más luminoso del degradado
del estado `:hover` — es el único hex nuevo que entró al proyecto, y solo se usa ahí (documentado en
el propio token para que no se reutilice como color de texto/fondo, donde el contraste no está
pensado para eso). Verificado visualmente en navegador: se ve el barrido metálico diagonal en reposo,
más brillante en `:hover`, y se sostiene bien en los dos temas. `vitest` (54/54) sigue en verde —
el cambio es solo CSS, no toca el DOM que prueban los tests de `Button.test.tsx`.

**Ajuste**: el usuario vio el botón ya desplegado y dijo que el reposo se sentía "un poco más
oscuro" de lo esperado — las puntas del degradado usaban `--re-gold-deep` (el dorado apagado de la
paleta, pensado para bordes, no para superficies grandes). Se subió el rango completo un escalón:
reposo ahora va de `--re-gold` a `--re-gold-bright` con el glint (`--re-gold-glint`) en el centro
(antes el glint solo aparecía en `:hover`); `:hover` subió otro escalón más, de `--re-gold-bright`
al glint y de vuelta — así el hover se siente como un realce real, no el mismo barrido apenas
movido. Verificado visualmente: reposo notablemente más claro, hover un paso más brillante todavía.

**Corrección del ajuste anterior — era al revés**: el usuario aclaró que había pedido lo contrario
("el color debería ser más oscuro el amarillo o dorado"), para los botones. Se bajó toda la escala
un escalón: reposo vuelve a usar `--re-gold-deep` en las puntas (con `--re-gold` de paso y
`--re-gold-bright` como pico central — ya no llega al glint casi blanco), y `:hover` sube un solo
escalón (`--re-gold` → `--re-gold-bright` → `--re-gold`, tampoco toca el glint). `--re-gold-glint`
queda declarado en `tokens.css` pero sin uso por ahora — se deja porque no estorba y puede servir si
se quiere un brillo más fuerte en otro sitio más adelante. Verificado visualmente: reposo oscuro con
buen carácter metálico, hover un paso más claro y perceptible.

**Selector de idioma (ES/EN)**: el usuario pidió un botón para cambiar a inglés en el header, junto
al de tema. Se armó un sistema de i18n propio (sin librería nueva — el proyecto ya usa Context para
Theme/Auth/Cart/Toast, así que `LanguageContext.tsx` sigue exactamente ese mismo patrón, persistido
en `localStorage` igual que el tema, y actualiza `<html lang>`).

- `i18n/dictionary.ts`: diccionario ES/EN con una **interfaz `Dictionary` explícita** (no
  `typeof es`) a propósito — así TypeScript exige que `en` tenga exactamente las mismas claves que
  `es`; si algo queda sin traducir, no compila.
- **Alcance deliberado, igual que con la ocultación de rutas de la Sesión 6**: solo se tradujo lo que
  hoy es visible con `SHOP_ENABLED = false` — Header, Footer, Home, Telas, Accesorios, El taller,
  404 y la pantalla de sin conexión. El resto (carrito, cuenta, back-office…) sigue oculto, así que
  traducirlo ahora sería trabajo perdido. **Tampoco se traduce el CONTENIDO** (nombres/descripciones
  de telas, trajes y accesorios de `src/mocks/data.ts`): es dato de catálogo, no texto de interfaz —
  se confirmó visualmente que `/telas` en inglés traduce el título, la descripción y los botones,
  pero los nombres de tela ("Súper 110 Negro", "100 % lana virgen") siguen en español, como se
  esperaba.
- Botón de idioma: mismo `IconButton` que ya existía para el tema, mostrando el idioma **al que se
  cambiaría** ("EN" en español, "ES" en inglés) — mismo patrón que el ícono de sol/luna del tema.
  Ícono nuevo no hizo falta, es texto (`.langLabel` en `Header.module.css`).

Verificado: `tsc`, `eslint` (solo dos warnings preexistentes de `react-refresh/only-export-components`,
mismo patrón que los otros contextos) y `vitest` (54/54) limpios. En navegador real: el botón
traduce Home/Telas/Accesorios/El taller/404 correctamente, `<html lang>` cambia, el idioma persiste
tras recargar la página (confirmado por error propio al verificar: al comprobar la persistencia
busqué el texto en español del botón sin caer en que, ya en inglés, el botón mismo también se
traduce — no fue un bug real, era el regex de mi propia verificación).

---

### Sesión 6 — 2026-09-29

**Objetivo:** el usuario pidió lanzar ya la parte informativa del sitio (catálogo, telas,
accesorios, el taller) mientras `apps/api`/`db`/Docker se implementan después — "oculta todo lo
referente a backend". El reemplazo de "agendar cita" (que hoy vive detrás de una cuenta) es un
enlace directo de WhatsApp.

**Decisión de diseño:** un solo interruptor, `apps/web/src/config/features.ts`
(`SHOP_ENABLED = false`), en vez de borrar o comentar código. Reactivar la tienda completa cuando
exista el backend real es volver ese valor a `true` — nada de lo que ya se construyó (carrito,
checkout, cuenta, back-office, fidelización, CRM) se tocó ni se perdió.

**Hecho:**

- **`routes/index.tsx`**: un helper `gate(element)` envuelve el `element` de cada ruta de
  compra/cuenta/back-office/sesión (`/carrito`, `/checkout`, `/checkout/confirmado/:orderNumber`,
  `/seguimiento`, `/mi-cuenta/*`, `/admin/*`, `/entrar`, `/crear-cuenta`, y también
  `/catalogo/:code/personalizar` porque termina en "añadir al carrito"). Con `SHOP_ENABLED=false`,
  cualquiera de esas URLs escrita a mano redirige a inicio (`<Navigate to={paths.home} replace />`)
  en vez de renderizar la página real — no solo se quitan los enlaces, la ruta misma no responde.
- **`Header.tsx`**: `NAV_LINKS` sin "Seguimiento"; se quitan el ícono de carrito, el ícono de
  cuenta y el bloque de sesión (Entrar/Crear cuenta/Cerrar sesión) tanto en escritorio como en el
  menú móvil, reemplazados por un botón "Agendar por WhatsApp".
- **`Footer.tsx`**: se quita la columna "Tu pedido" completa (seguimiento, mis pedidos, mis
  medidas, carrito) y "Entrar"/"Crear cuenta" de "La casa"; "Agendar una cita" pasa a WhatsApp; se
  agrega un enlace de WhatsApp junto al teléfono/correo de contacto.
- **`HomePage.tsx`**: la CTA "Agendar una cita" del hero va a WhatsApp; el bloque final
  "¿Ya tienes un pedido en marcha? → Ver el seguimiento" se reemplaza por una CTA de WhatsApp; se
  **elimina** la nota "Entra con las cuentas de prueba" — invitar a un visitante real a loguearse
  con credenciales de demo y ver el back-office no tenía sentido con el sitio ya en producción.
- **`SuitDetailPage.tsx`**: "Personalizar este traje" + "Verlo en el taller" se colapsan en un único
  "Cotizar este traje por WhatsApp", con el nombre y código del modelo ya escritos en el mensaje.
- **`CatalogPage.tsx`/`FabricsPage.tsx`/`AboutPage.tsx`**: sus CTAs de "agendar cita/consulta/visita"
  (antes → `bookAppointment`) pasan a WhatsApp.
- **`AccessoriesPage.tsx`**: el botón "Añadir" de cada `ProductCard` se omite (`onAdd={undefined}`)
  — sin carrito, la tarjeta es solo vitrina.
- **`ProductCards.tsx`** (`SuitCard`): la propia tarjeta ya enlazaba a la ficha del traje, no
  directo a personalizar, así que no había enlace roto — pero el texto "Personalizar" ya no era
  honesto con lo que hay detrás; ahora dice "Ver detalle".
- **Dominio confirmado por el usuario**: `realelegancegt.com`. Se agregó a `apps/web/index.html`
  (`<link rel="canonical">`, Open Graph y Twitter Card con ese dominio; la descripción también se
  actualizó para no prometer "seguimiento en línea", que ahora está oculto) y a los nuevos
  `apps/web/public/robots.txt`/`public/sitemap.xml`.
- **"Diseñar mi traje" (todo el catálogo de modelos) también se oculta, no solo el botón**: se
  gatearon `paths.catalog` y `/catalogo/:code` en `routes/index.tsx` (antes solo `/personalizar` lo
  estaba); se quitó "Trajes" del `Header`, "Catálogo de trajes" del `Footer`, el botón "Diseñar mi
  traje" del hero de `HomePage.tsx` (con el texto del hero reescrito para no describir un flujo que
  ya no existe) y la sección "Destacados" completa (la grilla de `SuitCard` no tenía sentido sin
  poder abrir la ficha de cada modelo). `NotFoundPage.tsx` apunta a inicio en vez de al catálogo.
  Con esto, `robots.txt`/`sitemap.xml` (recién creados en esta misma sesión) tuvieron que corregirse
  para no listar `/catalogo` como página real.
- **Datos de contacto reales, confirmados por el usuario**: WhatsApp/teléfono `+502 3074-5202`
  (`WHATSAPP_PHONE`/`CONTACT_PHONE_*` en `config/features.ts` — ya no es el placeholder), correo
  `realelegancegt@gmail.com` (`CONTACT_EMAIL`, reemplaza `contacto@realelegance.com` en `Footer.tsx`
  e `index.html`), Instagram `instagram.com/realelegancegt` y Facebook (enlace de `share/` que dio
  el usuario, se dejó tal cual). Todo centralizado en `SOCIAL_LINKS`/`CONTACT_*` de
  `config/features.ts` — un solo sitio para cambiarlo si alguno cambia.
- **Widget flotante de redes sociales**: `components/FloatingSocial.tsx` (+ su `.module.css`),
  montado en `AppLayout.tsx` junto al `Header`/`Footer`/`CartDrawer`, así que aparece en todas las
  páginas públicas. Dos círculos (Instagram, Facebook) fijos en la esquina inferior derecha,
  `position: fixed`, por encima del contenido pero debajo del header/drawer/modal
  (`z-index: var(--z-sticky)`). Se agregó el ícono `facebook` nuevo a `Icon.tsx` (no existía; el set
  ya traía `instagram`). No incluye WhatsApp — el usuario pidió específicamente "sus redes"
  (Instagram/Facebook); WhatsApp ya tiene su propio CTA prominente en Header/Home/Footer/fichas.

**Verificado:** `npx tsc -p apps/web/tsconfig.app.json --noEmit`, `npx eslint` y `npx vitest run`
(54/54) limpios. En navegador real (Playwright): las 7 rutas gateadas redirigen a `/` al escribirlas
a mano; el nav principal solo muestra Trajes/Telas/Accesorios/El taller; los 5 enlaces `wa.me` de la
portada resuelven con el mensaje esperado; la ficha de un traje ya no ofrece "Personalizar", solo
"Cotizar por WhatsApp" con el modelo correcto en el texto.
**No verificado:** dispositivo real (solo viewport de escritorio en Playwright esta vez).

**Verificado (tras ocultar "Diseñar mi traje" y confirmar contacto/redes):** de nuevo `tsc`,
`eslint` y `vitest` (54/54) limpios. En navegador: `/catalogo`, `/catalogo/RE-CL-001` y
`/catalogo/RE-CL-001/personalizar` redirigen a `/`; el nav quedó en Telas/Accesorios/El taller;
`/ruta-que-no-existe` ofrece "Ir a inicio"; el footer muestra `3074-5202` y
`realelegancegt@gmail.com`; los dos círculos flotantes apuntan a los Instagram/Facebook reales y
siguen visibles al hacer scroll.
**Sigue sin confirmar:** si el correo de contacto debía coincidir con el dominio
(`@realelegancegt.com`) — el usuario dio `realelegancegt@gmail.com` explícitamente, así que se usó
tal cual; no es un descuido, es lo que pidió.

---

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
