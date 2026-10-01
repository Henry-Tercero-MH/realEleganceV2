import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { useTranslation } from '@/context/LanguageContext';
import s from './PageLoader.module.css';

/** Cuánto se acerca al final en cada paso: nunca llega, solo se frena. */
const TARGET = 92;
const STEP_MS = 180;

/**
 * Estado de carga de una ruta perezosa.
 *
 * No hay un porcentaje real (es la descarga de un chunk, no una subida con
 * progreso medible), así que se simula uno clásico de "trickle": avanza
 * rápido al principio y cada vez más despacio, sin llegar nunca al 100 % —
 * la página real reemplaza esto antes de que se note el tope.
 *
 * Reserva la altura de una pantalla para que el pie de página no salte hacia
 * arriba mientras baja el chunk.
 */
export function PageLoader({ label }: { label?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const t = useTranslation();
  const [progress, setProgress] = useState(reducedMotion ? TARGET : 12);

  useEffect(() => {
    if (reducedMotion) return;

    const id = setInterval(() => {
      setProgress((current) => {
        const remaining = TARGET - current;
        if (remaining <= 0.5) return current;
        return current + Math.max(remaining * 0.12, 0.4);
      });
    }, STEP_MS);

    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className={s.loader} role="status" aria-live="polite">
      <div className={s.track}>
        <div className={s.fill} style={{ width: `${progress}%` }} />
      </div>
      <p className={s.text} aria-hidden="true">
        {t.pageLoader.text}
      </p>
      <span className="re-sr-only">{label ?? t.pageLoader.label}</span>
    </div>
  );
}
