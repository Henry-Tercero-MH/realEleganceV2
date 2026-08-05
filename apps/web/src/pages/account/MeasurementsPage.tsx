import { ButtonLink, Card, EmptyState, Icon, SectionHeading, Skeleton } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { paths } from '@/routes/paths';
import { formatDate, formatMeasurement } from '@/lib/format';
import s from './account.module.css';

export default function MeasurementsPage() {
  const { user } = useAuth();
  const customerId = user?.customerId ?? null;

  const { data: sets, isLoading } = useQuery({
    queryKey: queryKeys.myMeasurements(customerId ?? 0),
    queryFn: () => api.measurements.listMine(customerId!),
    enabled: customerId !== null,
  });

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Tu ficha"
        title="Mis medidas"
        description="Las tomamos en el taller y quedan guardadas. Para el siguiente traje solo hay que confirmarlas."
      />

      {isLoading ? <Skeleton height="240px" radius="var(--radius-md)" /> : null}

      {!isLoading && (!sets || sets.length === 0) ? (
        <EmptyState
          icon="ruler"
          title="Todavía no tenemos tus medidas"
          description="Se toman en la primera cita, en unos veinte minutos. Es lo único que no se puede hacer a distancia."
          action={
            <ButtonLink to={paths.bookAppointment} variant="primary">
              Agendar la toma de medidas
            </ButtonLink>
          }
        />
      ) : null}

      {sets?.map((set) => (
        <Card key={set.id} variant="raised">
          <Card.Header
            eyebrow={`Tomadas el ${formatDate(set.takenAt)}`}
            title="Ficha de medidas"
            subtitle={set.takenByName ? `Por ${set.takenByName}` : undefined}
          />
          <Card.Body>
            <dl className={s.measureGrid}>
              {set.values.map((value) => (
                <div key={value.id} className={s.measure}>
                  <dt>{value.name}</dt>
                  <dd>{formatMeasurement(value.valueCm, value.unit)}</dd>
                </div>
              ))}
            </dl>

            {set.note ? (
              <p className={s.itemSub} style={{ marginTop: 'var(--space-4)' }}>
                <Icon name="info" size={14} /> {set.note}
              </p>
            ) : null}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
