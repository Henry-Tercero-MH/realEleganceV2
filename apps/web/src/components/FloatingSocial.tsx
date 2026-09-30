import { Icon } from './ui';
import { SOCIAL_LINKS } from '@/config/features';
import s from './FloatingSocial.module.css';

const LINKS = [
  { href: SOCIAL_LINKS.instagram, icon: 'instagram', label: 'Real Elegance en Instagram' },
  { href: SOCIAL_LINKS.facebook, icon: 'facebook', label: 'Real Elegance en Facebook' },
] as const;

/**
 * Iconos redondos de redes sociales, fijos al lado de la pantalla mientras se
 * hace scroll — el "botón flotante" que suelen llevar los sitios de negocios
 * locales, aparte de cualquier CTA de WhatsApp que ya viva en el contenido.
 */
export function FloatingSocial() {
  return (
    <div className={s.stack} aria-label="Redes sociales">
      {LINKS.map((link) => (
        <a
          key={link.icon}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className={s.bubble}
          aria-label={link.label}
          title={link.label}
        >
          <Icon name={link.icon} size={20} />
        </a>
      ))}
    </div>
  );
}
