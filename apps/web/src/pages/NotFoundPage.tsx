import { ButtonLink, EmptyState } from '@/components/ui';
import { paths } from '@/routes/paths';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';

export default function NotFoundPage() {
  return (
    <div className={cx('re-container', 're-container--narrow', l.section)}>
      <EmptyState
        icon="search"
        title="Esta página se descosió"
        description="La dirección que buscas no existe o cambió de sitio. Desde el catálogo llegas a todo lo demás."
        action={
          <ButtonLink to={paths.catalog} variant="primary">
            Ir al catálogo
          </ButtonLink>
        }
      />
    </div>
  );
}
