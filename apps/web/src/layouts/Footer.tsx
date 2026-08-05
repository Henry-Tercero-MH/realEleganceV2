import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Icon } from '@/components/ui';
import { paths } from '@/routes/paths';
import s from './Footer.module.css';

const COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { to: paths.catalog, label: 'Catálogo de trajes' },
      { to: paths.fabrics, label: 'Muestrario de telas' },
      { to: paths.accessories, label: 'Accesorios' },
      { to: paths.bookAppointment, label: 'Agendar una cita' },
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
      { to: paths.about, label: 'El taller' },
      { to: paths.login, label: 'Entrar' },
      { to: paths.register, label: 'Crear cuenta' },
    ],
  },
];

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`re-container ${s.inner}`}>
        <div className={s.brandColumn}>
          <Logo />
          <p className={s.pitch}>
            Trajes cortados a mano, uno cada vez. Desde 1998 en la Ciudad de Guatemala.
          </p>
          <address className={s.contact}>
            <a href="tel:+50222345678">
              <Icon name="clock" size={15} /> Lun a sáb · 9:00 – 18:00
            </a>
            <a href="mailto:contacto@realelegance.com">
              <Icon name="info" size={15} /> contacto@realelegance.com
            </a>
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
        <p>© {new Date().getFullYear()} Real Elegance. Todos los derechos reservados.</p>
        <p className={s.craft}>
          <Icon name="needle" size={14} /> Cosido a mano, también el código.
        </p>
      </div>
    </footer>
  );
}
