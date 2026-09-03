# Agentes de revisión — Real Elegance

Subagentes de Claude Code para revisar y ajustar el frontend (`apps/web`) durante la fase de diseño.
Cada archivo `.md` de esta carpeta es un subagente independiente con su propio contexto y sus
propias herramientas.

## Instalación

Copia esta carpeta a la raíz de tu repositorio:

```
tu-repo/
└── .claude/
    └── agents/
        ├── responsive-movil.md
        ├── controles-interactivos.md
        ├── navegacion.md
        ├── catalogo-filtros.md
        ├── accesibilidad.md
        ├── design-tokens.md
        └── calidad-codigo.md
```

Al abrir Claude Code en el repo, los detecta automáticamente. Compruébalo con `/agents`.

## Los agentes

| Agente | Para qué | Edita |
|---|---|---|
| `responsive-movil` | Layout en móvil/tablet: desbordes, rejillas, header, barra de pago | Sí (bajo riesgo) |
| `controles-interactivos` | Botones, inputs, labels, steppers: tamaño táctil, estados, contraste | Sí (bajo riesgo) |
| `navegacion` | Navbar, menú móvil, Drawer, logout, RequireRole, estados activos | Sí (bajo riesgo) |
| `catalogo-filtros` | Filtros en URL, estados de React Query, filtros colapsables en móvil | Sí (bajo riesgo) |
| `accesibilidad` | Teclado, focus traps, ARIA, contraste — **solo diagnóstico** | No (propone) |
| `design-tokens` | Cero colores hardcodeados, temas oscuro/claro, escala | Sí (reemplazos) |
| `calidad-codigo` | tsc, artefactos `.js` sueltos, pricing, GTQ, React Query, tests | Sí (seguro) |

## Cómo usarlos

Invócalos por nombre en Claude Code, o deja que se deleguen solos por su `description`. Ejemplos:

```
> Usa el agente responsive-movil sobre las páginas de catálogo y checkout.
> Pásale controles-interactivos a src/components/ui y arregla los targets táctiles.
> Corre accesibilidad sobre todo apps/web y dame el informe priorizado.
> Con calidad-codigo, borra los .js sueltos y corre tsc.
```

## Orden recomendado (una pasada completa)

Ejecútalos en este orden para que los cambios no se pisen entre sí:

1. **`calidad-codigo`** — primero limpia artefactos `.js` sueltos y confirma que `tsc` esté verde;
   trabajar sobre `.js` que tapan `.tsx` da resultados falsos.
2. **`design-tokens`** — normaliza colores/escala. Así los demás agentes ya tienen tokens correctos
   con los que trabajar.
3. **`responsive-movil`** — arregla el layout global en móvil/tablet.
4. **`controles-interactivos`** — afina botones/inputs/labels ya dentro del layout correcto.
5. **`navegacion`** — navbar, menú móvil y Drawer.
6. **`catalogo-filtros`** — filtros en URL y estados del listado.
7. **`accesibilidad`** — pasada final de diagnóstico; aplica sus parches propuestos a mano o con el
   agente de edición que corresponda.

## Límites (importante)

- Ninguno puede ver el render real. Los arreglos son estáticos (CSS/JSX/ARIA); **la verificación
  visual en dispositivo real sigue siendo manual** — es justo el pendiente que arrastra tu ESTADO.md.
- No tocan `src/api`/`src/mocks` (la firma se mantiene para la fase de backend) ni la regla de
  precio de `pricing.ts` sin marcarlo como riesgo (debe cambiar también en el servidor).
- Trabajan sobre `tokens.css`: no introducen colores nuevos hardcodeados.

## Ajustes

Cada agente lleva `tools:` en su frontmatter. Si quieres que `accesibilidad` también edite, añade
`Edit`. Si quieres restringir alguno a solo lectura, quita `Edit`. Puedes fijar el modelo con
`model: sonnet` (más barato para barridos) o `model: opus` (más criterio) en el frontmatter.

> Formato de subagentes según la documentación de Claude Code; si algún campo cambia, verifica en
> https://docs.anthropic.com/en/docs/claude-code/claude_code_docs_map.md
