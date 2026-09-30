import { ButtonLink, EmptyState } from '@/components/ui';
import { paths } from '@/routes/paths';
import { SHOP_ENABLED } from '@/config/features';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';

export default function NotFoundPage() {
  return (
    <div className={cx('re-container', 're-container--narrow', l.section)}>
      <EmptyState
        icon="search"
        title="Esta página se descosió"
        description={
          SHOP_ENABLED
            ? 'La dirección que buscas no existe o cambió de sitio. Desde el catálogo llegas a todo lo demás.'
            : 'La dirección que buscas no existe o cambió de sitio.'
        }
        action={
          <ButtonLink to={SHOP_ENABLED ? paths.catalog : paths.home} variant="primary">
            {SHOP_ENABLED ? 'Ir al catálogo' : 'Ir a inicio'}
          </ButtonLink>
        }
      />
    </div>
  );
}
