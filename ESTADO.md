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
| `apps/web` — cuenta del cliente | ✅ Hecho | Resumen, pedidos, detalle, citas, agendar, medidas |
| `apps/web` — back-office `/admin` | ✅ Hecho | Panel, trajes, telas, accesorios, cupones, taller, pedidos, citas |
| `apps/web` — `<ImageUploader />` | ⬜ Pendiente | Necesita bucket real; las tablas de admin son de solo lectura por ahora |
| `apps/web` — simulador 2D | ⛔ Fuera de alcance | Tarjeta «Próximamente» en `/personalizar`, según §13 |
| Tests | ⬜ Pendiente | Falta cubrir `cartReducer`, `pricing` y el design system |
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

1. Tests de Vitest sobre `cartReducer` y `calculateTotals` (lógica pura, alto valor).
2. Tests de RTL sobre `Button`, `OptionCard` y el flujo «añadir al carrito».
3. Repaso de accesibilidad con teclado en modal, drawer y stepper.
4. Revisar el responsive real en móvil (hoy validado por media queries, no en dispositivo).

**Fase siguiente (backend):**

5. `packages/shared`: mover los esquemas Zod de `features/*/schema.ts` y compartirlos.
6. `db/`: migraciones Knex en 3FN, los 9 triggers, funciones, procedimientos y vistas.
7. `apps/api`: capas config/routes/controllers/services/repositories + Swagger.
8. Sustituir `src/api/mock.ts` por la implementación HTTP sobre `src/api/http.ts` (ya configurado).
9. Docker + MinIO y el `<ImageUploader />` del CMS.

---

## Bitácora

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
