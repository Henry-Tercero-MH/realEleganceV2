import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  Input,
  OrderStatusBadge,
  SectionHeading,
  Skeleton,
  Stepper,
} from '@/components/ui';
import type { StepperStep } from '@/components/ui';
import { useOrderTracking } from '@/features/orders/hooks';
import { paths } from '@/routes/paths';
import { formatDate, formatDateTime } from '@/lib/format';
import { cx } from '@/lib/cx';
import l from '@/styles/layout.module.css';
import s from './TrackingPage.module.css';

export default function TrackingPage() {
  const { orderNumber } = useParams<{ orderNumber?: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState(orderNumber ?? '');

  const { data, isLoading, isError, error } = useOrderTracking(orderNumber);

  /**
   * El índice del paso actual es el primero sin `doneAt`. Si están todos
   * cerrados, el traje se entregó y el stepper queda completo.
   */
  const currentIndex = data ? data.steps.findIndex((step) => !step.doneAt) : 0;
  const steps: StepperStep[] =
    data?.steps.map((step) => ({
      id: step.stageCode,
      label: step.stageName,
      description: step.assignedTailor ? `A cargo de ${step.assignedTailor}` : step.note ?? undefined,
      meta: step.doneAt
        ? `Completado el ${formatDate(step.doneAt)}`
        : step.estimatedDate
          ? `Previsto para el ${formatDate(step.estimatedDate)}`
          : undefined,
    })) ?? [];

  return (
    <div className={cx('re-container', 're-container--narrow', l.sectionFirst)}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Seguimiento"
        title="¿Dónde está mi traje?"
        description="Escribe el número que te dimos al confirmar el pedido. No hace falta iniciar sesión."
      />

      <form
        className={cx(s.search, l.afterHeading)}
        onSubmit={(event) => {
          event.preventDefault();
          if (query.trim()) navigate(paths.trackingFor(query.trim().toUpperCase()));
        }}
      >
        <Input
          label="Número de pedido"
          placeholder="RE-2026-01024"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          startAdornment={<Icon name="search" size={17} />}
          fieldClassName={s.searchInput}
          autoComplete="off"
        />
        <Button type="submit" variant="primary" className={s.searchButton}>
          Consultar
        </Button>
      </form>

      {!orderNumber ? (
        <p className={s.hint}>
          <Icon name="info" size={15} />
          ¿Es tu primera vez? Prueba con <code>RE-2026-01024</code>, el pedido de demostración.
        </p>
      ) : null}

      {isLoading ? (
        <div className={s.results}>
          <Skeleton height="120px" radius="var(--radius-md)" />
          <Skeleton height="320px" radius="var(--radius-md)" />
        </div>
      ) : null}

      {isError ? (
        <div className={s.results}>
          <EmptyState
            tone="error"
            title="No encontramos ese pedido"
            description={
              error instanceof Error
                ? `${error.message} Revisa el número: empieza por RE seguido del año.`
                : 'Revisa el número e inténtalo de nuevo.'
            }
          />
        </div>
      ) : null}

      {data ? (
        <div className={s.results}>
          <Card variant="raised">
            <Card.Header
              eyebrow={data.orderNumber}
              title="Estado del pedido"
              aside={<OrderStatusBadge status={data.statusCode} />}
            />
            <Card.Body>
              <dl className={s.facts}>
                <div>
                  <dt>Entrega prevista</dt>
                  <dd>{formatDate(data.promisedDate)}</dd>
                </div>
                <div>
                  <dt>Etapa actual</dt>
                  <dd>
                    {data.currentStage
                      ? (data.steps.find((step) => step.stageCode === data.currentStage)?.stageName ??
                        '—')
                      : 'Finalizado'}
                  </dd>
                </div>
              </dl>
            </Card.Body>
          </Card>

          <Card variant="raised">
            <Card.Header title="Avance en el taller" />
            <Card.Body>
              <Stepper
                steps={steps}
                current={currentIndex === -1 ? steps.length : currentIndex}
                orientation="vertical"
                aria-label="Etapas de confección"
              />
            </Card.Body>
          </Card>

          {data.history.length > 0 ? (
            <Card variant="raised">
              <Card.Header title="Bitácora" subtitle="Cada cambio de estado queda registrado" />
              <Card.Body>
                <ol role="list" className={s.history}>
                  {[...data.history].reverse().map((entry) => (
                    <li key={entry.id}>
                      <div className={s.historyHead}>
                        <strong>{entry.statusName}</strong>
                        <time dateTime={entry.changedAt}>{formatDateTime(entry.changedAt)}</time>
                      </div>
                      {entry.note ? <p className={s.historyNote}>{entry.note}</p> : null}
                      {entry.changedByName ? (
                        <p className={s.historyAuthor}>— {entry.changedByName}</p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </Card.Body>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
