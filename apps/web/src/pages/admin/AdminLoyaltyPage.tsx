import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Checkbox, Input, Modal, SectionHeading, Skeleton, Table, Textarea } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { LoyaltyAccount } from '@real-elegance/shared';
import {
  useAdjustLoyaltyPoints,
  useAdminLoyaltyAccounts,
  useLoyaltySettings,
  useUpdateLoyaltySettings,
} from '@/features/loyalty/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDateTime, formatPoints } from '@/lib/format';
import s from './admin.module.css';
import a from './AdminLoyaltyPage.module.css';

function columnsFor(onAdjust: (account: LoyaltyAccount) => void): Array<Column<LoyaltyAccount>> {
  return [
    {
      id: 'customer',
      header: 'Cliente',
      cell: (row) => (
        <Link to={paths.adminCustomer(row.customerId)}>
          <span className={s.cellName}>{row.customerName}</span>
          <span className={s.cellSub}>{row.customerEmail}</span>
        </Link>
      ),
    },
    {
      id: 'balance',
      header: 'Saldo',
      align: 'right',
      cell: (row) => formatPoints(row.pointsBalance),
    },
    {
      id: 'lifetime',
      header: 'Acumulado histórico',
      align: 'right',
      hideOnMobile: true,
      cell: (row) => formatPoints(row.pointsLifetime),
    },
    {
      id: 'updated',
      header: 'Última actividad',
      align: 'right',
      hideOnMobile: true,
      cell: (row) => formatDateTime(row.updatedAt),
    },
    {
      id: 'actions',
      header: 'Acciones',
      align: 'right',
      cell: (row) => (
        <Button variant="ghost" size="sm" onClick={() => onAdjust(row)}>
          Ajustar
        </Button>
      ),
    },
  ];
}

/**
 * Panel de fidelización.
 *
 * Es la única fuente de verdad de «cuánto vale 1 punto»: el carrito y el
 * checkout leen estos valores (`api.loyalty.getSettings`), no un número fijo
 * en el código. Cambiarlos aquí afecta a los pedidos que se confirmen después,
 * no reescribe el historial.
 */
export default function AdminLoyaltyPage() {
  const { data: settings, isLoading: loadingSettings } = useLoyaltySettings();
  const { data: accounts, isLoading: loadingAccounts } = useAdminLoyaltyAccounts();
  const updateSettings = useUpdateLoyaltySettings();
  const toast = useToast();

  const [earnRate, setEarnRate] = useState('');
  const [redemptionValue, setRedemptionValue] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [adjustingAccount, setAdjustingAccount] = useState<LoyaltyAccount | null>(null);

  // Rellena el formulario en cuanto llegan los valores vigentes del servidor.
  useEffect(() => {
    if (!settings) return;
    setEarnRate(String(settings.earnRateQuetzalPerPoint));
    setRedemptionValue(String(settings.redemptionValueQuetzalPerPoint));
    setIsActive(settings.isActive);
  }, [settings]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    const earnRateNum = Number(earnRate);
    const redemptionValueNum = Number(redemptionValue);

    if (!Number.isFinite(earnRateNum) || earnRateNum <= 0) {
      toast.error('Revisa la tasa de acumulación', 'Debe ser un número mayor que cero.');
      return;
    }
    if (!Number.isFinite(redemptionValueNum) || redemptionValueNum < 0) {
      toast.error('Revisa el valor de canje', 'No puede ser negativo.');
      return;
    }
    if (redemptionValueNum > earnRateNum) {
      toast.error(
        'Revisa el valor de canje',
        'No puede ser mayor que los quetzales que cuesta ganar un punto: perderías dinero en cada canje.',
      );
      return;
    }

    try {
      await updateSettings.mutateAsync({
        earnRateQuetzalPerPoint: earnRateNum,
        redemptionValueQuetzalPerPoint: redemptionValueNum,
        isActive,
      });
      toast.success('Reglas actualizadas', 'Los pedidos que se confirmen desde ahora usan este valor.');
    } catch (error) {
      toast.error(
        'No se pudo guardar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Comercio"
        title="Fidelización"
        description="Cuánto vale 1 punto y cuántos gana cada cliente al comprar."
      />

      <Card variant="raised">
        <Card.Header title="Reglas del programa" />
        <Card.Body>
          {loadingSettings ? (
            <Skeleton height="160px" radius="var(--radius-md)" />
          ) : (
            <form onSubmit={handleSave} className={a.form}>
              <div className={a.grid}>
                <Input
                  label="Quetzales por punto ganado"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  hint="Un cliente gana 1 punto por cada esta cantidad gastada."
                  value={earnRate}
                  onChange={(event) => setEarnRate(event.target.value)}
                />
                <Input
                  label="Valor de canje (Q por punto)"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  hint="Cuánto descuento representa 1 punto al usarlo en el carrito."
                  value={redemptionValue}
                  onChange={(event) => setRedemptionValue(event.target.value)}
                />
              </div>

              <Checkbox
                label="Programa activo"
                hint="Si se apaga, nadie gana ni puede canjear puntos, pero el saldo actual no se pierde."
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />

              {settings && earnRate ? (
                <p className={a.preview}>
                  Con estos valores, un pedido de {formatCurrency(1000)} deja{' '}
                  <strong>
                    {formatPoints(Number(earnRate) > 0 ? Math.floor(1000 / Number(earnRate)) : 0)}
                  </strong>
                  , y 100 puntos valen{' '}
                  <strong>{formatCurrency(100 * (Number(redemptionValue) || 0))}</strong> de descuento.
                </p>
              ) : null}

              <Button type="submit" variant="primary" isLoading={updateSettings.isPending}>
                Guardar cambios
              </Button>
            </form>
          )}
        </Card.Body>
      </Card>

      <Card variant="raised">
        <Card.Header title="Saldos por cliente" subtitle="Todas las cuentas de fidelización" />
        <Card.Body>
          {loadingAccounts ? (
            <Skeleton height="240px" radius="var(--radius-md)" />
          ) : (
            <Table
              columns={columnsFor(setAdjustingAccount)}
              rows={accounts ?? []}
              rowKey={(row) => row.customerId}
              caption="Saldos de fidelización por cliente"
            />
          )}
        </Card.Body>
      </Card>

      {adjustingAccount ? (
        <AdjustPointsModal account={adjustingAccount} onClose={() => setAdjustingAccount(null)} />
      ) : null}
    </div>
  );
}

/** Ajuste manual de puntos: una compensación, una corrección. */
function AdjustPointsModal({ account, onClose }: { account: LoyaltyAccount; onClose: () => void }) {
  const adjustPoints = useAdjustLoyaltyPoints();
  const toast = useToast();

  const [points, setPoints] = useState('');
  const [note, setNote] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Math.trunc(Number(points));
    if (!Number.isFinite(value) || value === 0) {
      toast.error('Falta el ajuste', 'Escribe cuántos puntos sumar (o resta con un signo −).');
      return;
    }
    if (!note.trim()) {
      toast.error('Falta el motivo', 'Escribe por qué se hace este ajuste.');
      return;
    }

    try {
      await adjustPoints.mutateAsync({ customerId: account.customerId, points: value, note });
      toast.success('Puntos ajustados', `${value > 0 ? '+' : ''}${value} pts para ${account.customerName}.`);
      onClose();
    } catch (error) {
      toast.error(
        'No se pudo ajustar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Ajustar puntos"
      description={`${account.customerName} tiene ${formatPoints(account.pointsBalance)} ahora mismo.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="adjust-points-form" variant="primary" isLoading={adjustPoints.isPending}>
            Aplicar ajuste
          </Button>
        </>
      }
    >
      <form id="adjust-points-form" onSubmit={handleSubmit} className={a.form}>
        <Input
          label="Puntos a sumar (o restar, con signo −)"
          type="number"
          step="1"
          placeholder="Por ejemplo: 50 o -20"
          value={points}
          onChange={(event) => setPoints(event.target.value)}
        />
        <Textarea
          label="Motivo"
          placeholder="Por ejemplo: compensación por retraso en la entrega."
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </form>
    </Modal>
  );
}
