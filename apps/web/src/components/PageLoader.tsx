import { Spinner } from './ui/Spinner';
import s from './PageLoader.module.css';

/**
 * Estado de carga de una ruta perezosa.
 *
 * Reserva la altura de una pantalla para que el pie de página no salte hacia
 * arriba mientras baja el chunk.
 */
export function PageLoader({ label = 'Cargando la página' }: { label?: string }) {
  return (
    <div className={s.loader}>
      <Spinner size={26} label={label} />
      <p className={s.text}>Un momento…</p>
    </div>
  );
}
