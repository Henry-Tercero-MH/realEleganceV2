/**
 * Formateo para la interfaz. Toda la app está en español de Guatemala y en
 * quetzales: centralizamos aquí para no repetir `Intl` por todos lados.
 */
import { CURRENCY } from '@real-elegance/shared';
const LOCALE = 'es-GT';
const currencyFormatter = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const compactCurrencyFormatter = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});
const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
});
const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
});
const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
});
const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
/** `1250` → `Q 1,250.00` */
export function formatCurrency(amount) {
    return currencyFormatter.format(amount);
}
/** `1250` → `Q 1,250` — para cifras grandes de tablero, sin decimales. */
export function formatCurrencyCompact(amount) {
    return compactCurrencyFormatter.format(amount);
}
/** `0.5` → `50 %` */
export function formatPercent(ratio) {
    return new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 }).format(ratio);
}
function toDate(value) {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
/** `2026-03-14` → `14 de marzo de 2026` */
export function formatDate(value, fallback = '—') {
    if (!value)
        return fallback;
    const date = toDate(value);
    return date ? dateFormatter.format(date) : fallback;
}
/** `2026-03-14` → `14 mar 2026` */
export function formatShortDate(value, fallback = '—') {
    if (!value)
        return fallback;
    const date = toDate(value);
    return date ? shortDateFormatter.format(date) : fallback;
}
/** `…T15:30` → `14 de marzo de 2026, 3:30 p. m.` */
export function formatDateTime(value, fallback = '—') {
    if (!value)
        return fallback;
    const date = toDate(value);
    return date ? dateTimeFormatter.format(date) : fallback;
}
/** `…T15:30` → `3:30 p. m.` */
export function formatTime(value, fallback = '—') {
    if (!value)
        return fallback;
    const date = toDate(value);
    return date ? timeFormatter.format(date) : fallback;
}
/** `…T15:30` → `sábado, 14 de marzo` */
export function formatWeekday(value, fallback = '—') {
    if (!value)
        return fallback;
    const date = toDate(value);
    return date ? weekdayFormatter.format(date) : fallback;
}
/** `…` → `en 3 días` / `hace 2 horas` */
export function formatRelative(value, fallback = '—') {
    if (!value)
        return fallback;
    const date = toDate(value);
    if (!date)
        return fallback;
    const diffMs = date.getTime() - Date.now();
    const units = [
        ['year', 365 * 24 * 60 * 60 * 1000],
        ['month', 30 * 24 * 60 * 60 * 1000],
        ['day', 24 * 60 * 60 * 1000],
        ['hour', 60 * 60 * 1000],
        ['minute', 60 * 1000],
    ];
    for (const [unit, ms] of units) {
        if (Math.abs(diffMs) >= ms) {
            return relativeFormatter.format(Math.round(diffMs / ms), unit);
        }
    }
    return 'ahora mismo';
}
/** `12.5` → `12.5 cm` */
export function formatMeasurement(valueCm, unit = 'cm') {
    return `${new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 }).format(valueCm)} ${unit}`;
}
/** `'Henry', 'Tercero'` → `HT` — iniciales para el avatar. */
export function initials(first, last) {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || '?';
}
/** Trunca respetando palabras, para descripciones en tarjetas. */
export function truncate(text, maxChars) {
    if (text.length <= maxChars)
        return text;
    const cut = text.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxChars).trimEnd()}…`;
}
const pointsFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
/** `850` → `850 pts` */
export function formatPoints(points) {
    return `${pointsFormatter.format(Math.round(points))} pts`;
}
//# sourceMappingURL=format.js.map