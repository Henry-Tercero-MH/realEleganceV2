import { ButtonLink, Card, Icon, SectionHeading } from '@/components/ui';
import { paths } from '@/routes/paths';
import { SHOP_ENABLED, APPOINTMENT_IN_PERSON_URL } from '@/config/features';
import { useTranslation } from '@/context/LanguageContext';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './AboutPage.module.css';

const STEP_ICONS = ['ruler', 'scissors', 'needle', 'hanger'] as const;

export default function AboutPage() {
  const t = useTranslation();
  const steps = t.about.steps.map((step, index) => ({ ...step, icon: STEP_ICONS[index]! }));

  return (
    <div className={cx('re-container', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        description={t.about.description}
      />

      <section className={cx(s.tailor, l.afterHeading)}>
        <div className={s.tailorGallery}>
          <img
            src="/images/fotodueño3.png"
            alt={t.about.tailorImgMainAlt}
            className={s.tailorImgMain}
          />
          <img
            src="/images/fotodeueño.png"
            alt={t.about.tailorImgSmallAlt1}
            className={s.tailorImgSmall}
          />
          <img
            src="/images/fotodueño2.png"
            alt={t.about.tailorImgSmallAlt2}
            className={s.tailorImgSmall}
          />
        </div>
        <div>
          <h2 className={s.tailorTitle}>{t.about.tailorTitle}</h2>
          <p className={s.tailorText}>{t.about.tailorText}</p>
        </div>
      </section>

      <div className={cx(s.grid, l.afterHeading)}>
        {steps.map((step, index) => (
          <Card key={step.title} variant="raised" className={s.card}>
            <Card.Header
              eyebrow={t.about.stageLabel(index + 1)}
              title={
                <span className={s.cardTitle}>
                  <Icon name={step.icon} size={20} />
                  {step.title}
                </span>
              }
            />
            <Card.Body>{step.text}</Card.Body>
          </Card>
        ))}
      </div>

      <section className={cx(s.visit, l.section)}>
        <div>
          <h2 className={s.visitTitle}>{t.about.visitTitle}</h2>
          <p className={s.visitText}>{t.about.visitText}</p>
        </div>
        <ButtonLink
          to={SHOP_ENABLED ? paths.bookAppointment : APPOINTMENT_IN_PERSON_URL}
          external={!SHOP_ENABLED}
          variant="primary"
          size="lg"
        >
          {t.about.visitButton}
        </ButtonLink>
      </section>
    </div>
  );
}
