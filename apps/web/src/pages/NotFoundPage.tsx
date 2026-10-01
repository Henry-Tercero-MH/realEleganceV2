import { ButtonLink, EmptyState } from '@/components/ui';
import { paths } from '@/routes/paths';
import { SHOP_ENABLED } from '@/config/features';
import { useTranslation } from '@/context/LanguageContext';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const t = useTranslation();

  return (
    <div className={cx('re-container', 're-container--narrow', l.section)}>
      <EmptyState
        illustration={
          <img src="/images/hilo404.png" alt={t.notFound.illustrationAlt} className={s.photo} />
        }
        title={t.notFound.title}
        description={
          SHOP_ENABLED
            ? 'La dirección que buscas no existe o cambió de sitio. Desde el catálogo llegas a todo lo demás.'
            : t.notFound.description
        }
        action={
          <ButtonLink to={SHOP_ENABLED ? paths.catalog : paths.home} variant="primary">
            {SHOP_ENABLED ? 'Ir al catálogo' : t.notFound.button}
          </ButtonLink>
        }
      />
    </div>
  );
}
