import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { Coupon } from '@real-elegance/shared';
import { useAdminCoupons } from '@/features/admin/hooks';
import { formatCurrency, formatDate } from '@/lib/format';
import s from './admin.module.css';

const COLUMNS: Array<Column<Coupon>> = [
  { id: 'code', header: 'Código', cell: (row) => <span className={s.mono}>{row.code}</span> },
  {
    id: 'value',
    header: 'Descuento',
    cell: (row) => (row.type === 'percent' ? `${row.value}%` : formatCurrency(row.value)),
  },
  {
    id: 'min',
    header: 'Subtotal mínimo',
    align: 'right',
    hideOnMobile: true,
    cell: (row) => formatCurrency(row.minSubtotal),
  },
  {
    id: 'usage',
    header: 'Usos',
    align: 'right',
    cell: (row) => `${row.timesUsed}${row.usageLimit ? ` / ${row.usageLimit}` : ''}`,
  },
  { id: 'validUntil', header: 'Vence', align: 'right', cell: (row) => formatDate(row.validUntil) },
  {
    id: 'status',
    header: 'Estado',
    align: 'right',
    cell: (row) => {
      const expired = new Date(row.validUntil) < new Date();
      const tone = !row.isActive ? 'neutral' : expired ? 'danger' : 'success';
      const label = !row.isActive ? 'Inactivo' : expired ? 'Vencido' : 'Vigente';
      return (
        <Badge tone={tone} size="sm">
          {label}
        </Badge>
      );
    },
  },
];

export default function AdminCouponsPage() {
  const { data: coupons, isLoading } = useAdminCoupons();

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Comercio"
        title="Cupones"
        description="Códigos de descuento con vigencia y límite de usos."
        action={
          <Button variant="primary" leftIcon={<Icon name="plus" size={16} />} disabled>
            Nuevo cupón
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton height="260px" radius="var(--radius-md)" />
      ) : (
        <Table columns={COLUMNS} rows={coupons ?? []} rowKey={(row) => row.id} caption="Cupones" />
      )}

      <p className={s.designNote}>
        <Icon name="info" size={15} />
        La validación real corre en <code>fn_validate_coupon</code>: vigencia, subtotal mínimo y
        límite de usos, tal como se ve en el carrito público.
      </p>
    </div>
  );
}
