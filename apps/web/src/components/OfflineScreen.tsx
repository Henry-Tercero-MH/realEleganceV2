import { Icon } from './ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTranslation } from '@/context/LanguageContext';
import s from './OfflineScreen.module.css';

/**
 * Pantalla completa cuando se pierde la conexión — no un aviso chico: tapa
 * todo el sitio para que quede clarísimo que no es que algo se rompió, es
 * que no hay internet. Desaparece sola en cuanto vuelve la señal (no hace
 * falta un botón de «reintentar»: `useOnlineStatus` ya escucha el evento
 * `online` del navegador).
 */
export function OfflineScreen() {
  const isOnline = useOnlineStatus();
  const t = useTranslation();

  if (isOnline) return null;

  return (
    <div className={s.screen} role="alert">
      <span className={s.iconWrap}>
        <Icon name="wifiOff" size={36} />
      </span>
      <h1 className={s.title}>{t.offline.title}</h1>
      <p className={s.text}>{t.offline.text}</p>
      <p className={s.hint}>{t.offline.hint}</p>
    </div>
  );
}
