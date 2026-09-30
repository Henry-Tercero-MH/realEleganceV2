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
