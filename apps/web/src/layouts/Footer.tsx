import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/ui';
import { paths } from '@/routes/paths';
import {
  SHOP_ENABLED,
  APPOINTMENT_IN_PERSON_URL,
  getWhatsAppUrl,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from '@/config/features';
import { useTranslation } from '@/context/LanguageContext';
import s from './Footer.module.css';

export function Footer() {
  const t = useTranslation();

  /*
   * Fase solo informativa: "Agendar una cita" pasa a ser un enlace externo al
   * horario de Google Calendar (el flujo interno vive detrás de una cuenta), y
   * se quitan las columnas/enlaces que dependen del carrito, la cuenta o la
   * sesión. Ver config/features.ts.
   */
  const COLUMNS = SHOP_ENABLED
    ? [
        {
          title: 'Tienda',
          links: [
            { to: paths.catalog, label: 'Catálogo de trajes' },
            { to: paths.fabrics, label: t.footer.columnFabrics },
            { to: paths.accessories, label: t.footer.columnAccessories },
            { to: paths.bookAppointment, label: t.footer.bookAppointment },
          ],
        },
        {
          title: 'Tu pedido',
          links: [
            { to: paths.tracking, label: 'Seguimiento en línea' },
            { to: paths.orders, label: 'Mis pedidos' },
            { to: paths.measurements, label: 'Mis medidas' },
            { to: paths.cart, label: 'Carrito' },
          ],
        },
        {
          title: 'La casa',
          links: [
            { to: paths.about, label: t.footer.columnAbout },
            { to: paths.login, label: 'Entrar' },
            { to: paths.register, label: 'Crear cuenta' },
          ],
        },
      ]
    : [
        {
          title: t.footer.columnStore,
          links: [
            { to: paths.fabrics, label: t.footer.columnFabrics },
            { to: paths.accessories, label: t.footer.columnAccessories },
          ],
        },
        {
          title: t.footer.columnHouse,
          links: [{ to: paths.about, label: t.footer.columnAbout }],
        },
      ];

  return (
    <footer className={s.footer}>
      <div className={`re-container ${s.inner}`}>
        <div className={s.brandColumn}>
          <Logo />
          <p className={s.pitch}>{t.footer.pitch}</p>
          <address className={s.contact}>
            <p className={s.hours}>
              <Icon name="clock" size={15} /> {t.footer.hours}
            </p>
            <a href={`tel:${CONTACT_PHONE_TEL}`}>
              <Icon name="phone" size={15} /> {CONTACT_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Icon name="info" size={15} /> {CONTACT_EMAIL}
            </a>
            {SHOP_ENABLED ? null : (
              <>
                <a href={APPOINTMENT_IN_PERSON_URL} target="_blank" rel="noreferrer noopener">
                  <Icon name="calendar" size={15} /> {t.footer.bookAppointment}
                </a>
                <a
                  href={getWhatsAppUrl('Hola, tengo una pregunta para Real Elegance.')}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon name="phone" size={15} /> {t.footer.whatsapp}
                </a>
              </>
            )}
          </address>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} className={s.column} aria-label={column.title}>
            <h2 className={s.columnTitle}>{column.title}</h2>
            <ul role="list" className={s.links}>
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={s.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={`re-container ${s.legal}`}>
        <p>{t.footer.legalRights(new Date().getFullYear())}</p>
        <p className={s.craft}>
          <Icon name="needle" size={14} /> {t.footer.legalCraft}
        </p>
      </div>
    </footer>
  );
}
