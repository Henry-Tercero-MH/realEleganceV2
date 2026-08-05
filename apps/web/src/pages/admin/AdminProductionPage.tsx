import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  SectionHeading,
  Select,
  Skeleton,
  StageBadge,
} from '@/components/ui';
import { useAdvanceStage, useAssignTailor, useProductionBoard } from '@/features/admin/hooks';
import { useStaff } from '@/features/appointments/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { formatShortDate, formatRelative } from '@/lib/format';
import { cx } from '@/lib/cx';
import s from './admin.module.css';

export default function AdminProductionPage() {
  const { data: board, isLoading, isError } = useProductionBoard();
  const { data: staff } = useStaff();
  const assignTailor = useAssignTailor();
  const advanceStage = useAdvanceStage();
  const toast = useToast();

  async function handleAssign(workOrderId: number, tailorId: number) {
    try {
      await assignTailor.mutateAsync({ workOrderId, tailorId });
      toast.success('Sastre asignado');
    } catch (error) {
      toast.error(
        'No se pudo asignar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  async function handleAdvance(workOrderId: number) {
    try {
      const next = await advanceStage.mutateAsync(workOrderId);
      toast.success('Etapa avanzada', `Ahora está en ${next.stageName}.`);
    } catch (error) {
      toast.error(
        'No se pudo avanzar la etapa',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Taller"
        title="Tablero de producción"
        description="Órdenes de trabajo abiertas por etapa. Equivale a la vista vw_production_board."
      />

      {isError ? <EmptyState tone="error" title="No pudimos cargar el tablero" /> : null}

      {isLoading ? (
        <Skeleton height="380px" radius="var(--radius-md)" />
      ) : (
        <div className={s.board}>
          {board?.map((column) => (
            <section key={column.stageCode} className={s.column} aria-label={column.stageName}>
              <header className={s.columnHead}>
                <h2 className={s.columnTitle}>{column.stageName}</h2>
                <span className={s.columnCount}>{column.workOrders.length}</span>
              </header>

              {column.workOrders.length === 0 ? (
                <p className={s.columnEmpty}>Sin órdenes en esta etapa</p>
              ) : (
                column.workOrders.map((workOrder) => {
                  const overdue =
                    workOrder.dueAt && new Date(workOrder.dueAt).getTime() < Date.now();

                  return (
                    <article
                      key={workOrder.id}
                      className={cx(s.workOrder, overdue && s.workOrderOverdue)}
                    >
                      <div>
                        <span className={s.workOrderNumber}>{workOrder.orderNumber}</span>
                        <p className={s.workOrderCustomer}>{workOrder.customerName}</p>
                      </div>

                      <div className={s.workOrderMeta}>
                        <span>
                          <Icon name="clock" size={13} />{' '}
                          {workOrder.dueAt
                            ? `Vence ${formatRelative(workOrder.dueAt)} (${formatShortDate(workOrder.dueAt)})`
                            : 'Sin fecha límite'}
                        </span>
                        {overdue ? (
                          <Badge tone="danger" size="sm">
                            Fuera de plazo
                          </Badge>
                        ) : null}
                      </div>

                      {workOrder.note ? <p className={s.workOrderNote}>{workOrder.note}</p> : null}

                      <Select
                        label="Sastre asignado"
                        placeholder="Sin asignar"
                        value={workOrder.assignedTailorId ?? ''}
                        onChange={(event) =>
                          event.target.value &&
                          handleAssign(workOrder.id, Number(event.target.value))
                        }
                        options={(staff ?? []).map((member) => ({
                          value: member.id,
                          label: `${member.firstName} ${member.lastName}`,
                          disabled: !member.isAvailable,
                        }))}
                      />

                      <div className={s.workOrderActions}>
                        <StageBadge stage={workOrder.stageCode} />
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAdvance(workOrder.id)}
                          isLoading={advanceStage.isPending && advanceStage.variables === workOrder.id}
                          rightIcon={<Icon name="arrowRight" size={14} />}
                        >
                          Avanzar
                        </Button>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          ))}
        </div>
      )}

      <Card variant="outlined">
        <Card.Body>
          <p className={s.designNote}>
            <Icon name="info" size={15} />
            Asignar sastre y avanzar etapa ya funcionan sobre los datos simulados: replican
            <code> sp_assign_tailor</code> y <code>sp_advance_stage</code>. Al conectar el backend
            pasarán a ser llamadas transaccionales reales.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
