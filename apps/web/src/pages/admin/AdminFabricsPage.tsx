import { Badge, Button, Icon, SectionHeading, Skeleton, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import type { Fabric } from '@real-elegance/shared';
import { useAdminFabrics } from '@/features/admin/hooks';
import { formatCurrency } from '@/lib/format';
import s from './admin.module.css';

const COLUMNS: Array<Column<Fabric>> = [
  {
    id: 'fabric',
    header: 'Tela',
    cell: (row) => (
      <div className={s.cellMain}>
        <span
          className={s.swatchDot}
          style={{ backgroundColor: row.colorHex ?? undefined }}
          aria-hidden="true"
        />
        <div>
          <span className={s.cellName}>{row.name}</span>
          <span className={s.cellSub}>{row.categoryName}</span>
        </div>
      </div>
    ),
  },
  { id: 'code', header: 'Código', cell: (row) => <span className={s.mono}>{row.code}</span> },
  { id: 'composition', header: 'Composición', hideOnMobile: true, cell: (row) => row.composition },
  {
    id: 'price',
    header: 'Precio / metro',
    align: 'right',
    cell: (row) => formatCurrency(row.pricePerMeter),
  },
  {
    id: 'stock',
    header: 'Existencias',
    align: 'right',
    cell: (row) => (
      <Badge tone={row.stockMeters < 15 ? 'warning' : 'neutral'} size="sm">
        {row.stockMeters} m
      </Badge>
    ),
  },
];

export default function AdminFabricsPage() {
  const { data: fabrics, isLoading } = useAdminFabrics();

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Catálogo"
        title="Telas"
        description="Muestrario, precio por metro y existencias."
        action={
          <Button variant="primary" leftIcon={<Icon name="plus" size={16} />} disabled>
            Nueva tela
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton height="320px" radius="var(--radius-md)" />
      ) : (
        <Table columns={COLUMNS} rows={fabrics ?? []} rowKey={(row) => row.id} caption="Telas del muestrario" />
      )}

      <p className={s.designNote}>
        <Icon name="info" size={15} />
        El descuento de metros al confirmar un pedido lo hará el trigger{' '}
        <code>trg_fabric_stock</code>; aquí solo se lee el nivel actual.
      </p>
    </div>
  );
}
