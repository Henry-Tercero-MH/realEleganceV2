/**
 * Imágenes de relleno para la fase de diseño.
 *
 * Se generan como SVG en un `data:` URI: no hay peticiones de red, funcionan
 * sin conexión y usan la paleta de la marca, así que las pantallas se ven como
 * se verán con fotografía real. Cuando exista el bucket de MinIO, este módulo
 * desaparece y las URLs vienen de `MEDIA_ASSETS`.
 */

const PALETTE = {
  noir: '#0E0C0A',
  onyx: '#14110C',
  onyx2: '#1D1912',
  gold: '#C6A253',
  goldDeep: '#8C6E2E',
  ivory: '#F4EFE4',
} as const;

function encode(svg: string): string {
  // `encodeURIComponent` en lugar de base64: pesa menos y se lee en el inspector.
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

export interface PlaceholderOptions {
  width?: number;
  height?: number;
  /** Texto en versalitas sobre la imagen. */
  label?: string;
  /** Color de fondo dominante (para las telas, su color real). */
  tint?: string;
  /** `suit` dibuja una silueta de saco; `swatch`, una trama de paño. */
  motif?: 'suit' | 'swatch' | 'accessory';
}

/** Silueta de saco cruzado, en trazo dorado fino. */
const SUIT_MOTIF = `
  <g stroke="${PALETTE.gold}" stroke-width="1.2" fill="none" opacity=".55"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 60 L110 82 L92 260 L128 268 L138 150" />
    <path d="M150 60 L190 82 L208 260 L172 268 L162 150" />
    <path d="M150 60 L134 96 L150 120 L166 96 Z" />
    <path d="M138 150 L150 300 L162 150" />
    <circle cx="150" cy="176" r="2.4" />
    <circle cx="150" cy="206" r="2.4" />
    <circle cx="150" cy="236" r="2.4" />
  </g>`;

/** Trama de espiga, el tejido característico. */
const SWATCH_MOTIF = `
  <pattern id="herring" width="16" height="16" patternUnits="userSpaceOnUse">
    <path d="M0 16 L8 0 L16 16" stroke="${PALETTE.gold}" stroke-width="1"
          fill="none" opacity=".22" />
  </pattern>
  <rect width="100%" height="100%" fill="url(#herring)" />`;

/** Corbata/pañuelo doblado, para los accesorios. */
const ACCESSORY_MOTIF = `
  <g stroke="${PALETTE.gold}" stroke-width="1.2" fill="none" opacity=".55"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M136 70 L150 92 L164 70 L150 60 Z" />
    <path d="M150 92 L134 130 L150 300 L166 130 Z" />
    <path d="M134 130 L166 130" />
  </g>`;

export function placeholderImage({
  width = 900,
  height = 1200,
  label,
  tint,
  motif = 'suit',
}: PlaceholderOptions = {}): string {
  const base = tint ?? PALETTE.onyx2;
  const motifSvg =
    motif === 'swatch' ? SWATCH_MOTIF : motif === 'accessory' ? ACCESSORY_MOTIF : SUIT_MOTIF;

  // El motivo va en un lienzo virtual de 300×360 y se escala al tamaño pedido.
  const scale = motif === 'swatch' ? 1 : Math.min(width / 300, height / 360);

  return encode(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"
         viewBox="0 0 ${width} ${height}" role="img">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stop-color="${base}" />
          <stop offset="100%" stop-color="${PALETTE.noir}" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${PALETTE.gold}" stop-opacity=".10" />
          <stop offset="55%" stop-color="${PALETTE.gold}" stop-opacity="0" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />
      ${motif === 'swatch' ? motifSvg : ''}
      <rect width="100%" height="100%" fill="url(#sheen)" />

      ${
        motif !== 'swatch'
          ? `<g transform="translate(${width / 2 - 150 * scale} ${height / 2 - 180 * scale}) scale(${scale})">
               ${motifSvg}
             </g>`
          : ''
      }

      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none"
            stroke="${PALETTE.goldDeep}" stroke-width="1" stroke-dasharray="6 5" opacity=".45" />

      ${
        label
          ? `<text x="50%" y="${height - 34}" text-anchor="middle"
                   font-family="Jost, system-ui, sans-serif" font-size="${Math.round(width / 28)}"
                   letter-spacing="4" fill="${PALETTE.ivory}" opacity=".62">
               ${label.toUpperCase()}
             </text>`
          : ''
      }
    </svg>
  `);
}

/** Avatar circular con iniciales, para el personal del taller. */
export function placeholderAvatar(initials: string): string {
  return encode(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" fill="${PALETTE.onyx2}" />
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
            font-family="Cormorant Garamond, Georgia, serif" font-size="46"
            letter-spacing="2" fill="${PALETTE.gold}">${initials}</text>
    </svg>
  `);
}
