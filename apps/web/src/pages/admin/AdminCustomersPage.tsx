import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Icon,
  Input,
  Modal,
  SectionHeading,
  Skeleton,
  Table,
} from '@/components/ui';
import type { Column } from '@/components/ui';
import type { CustomerListItem } from '@real-elegance/shared';
import { useAdminCustomers, useCreateCustomer } from '@/features/admin/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatPoints } from '@/lib/format';
import { isValidEmail, isValidName, isValidPhoneGT } from '@/lib/validation';
import s from './admin.module.css';

const COLUMNS: Array<Column<CustomerListItem>> = [
  {
    id: 'customer',
    header: 'Cliente',
    cell: (row) => (
      <div>
        <span className={s.cellName}>
          {row.firstName} {row.lastName}
        </span>
        <span className={s.cellSub}>{row.email}</span>
      </div>
    ),
  },
  { id: 'phone', header: 'Teléfono', hideOnMobile: true, cell: (row) => row.phone ?? '—' },
  {
    id: 'orders',
    header: 'Pedidos',
    align: 'right',
    cell: (row) =>
      row.totalOrders > 0 ? (
        <Badge tone="neutral" size="sm">
          {row.totalOrders}
        </Badge>
      ) : (
        '—'
      ),
  },
  {
    id: 'spent',
    header: 'Gastado',
    align: 'right',
    hideOnMobile: true,
    cell: (row) => (row.totalSpent > 0 ? formatCurrency(row.totalSpent) : '—'),
  },
  {
    id: 'lastOrder',
    header: 'Última compra',
    align: 'right',
    hideOnMobile: true,
    cell: (row) => formatDate(row.lastOrderAt),
  },
  {
    id: 'points',
    header: 'Puntos',
    align: 'right',
    cell: (row) => (row.pointsBalance > 0 ? formatPoints(row.pointsBalance) : '—'),
  },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { data: customers, isLoading } = useAdminCustomers({ search });
  const createCustomer = useCreateCustomer();
  const toast = useToast();
  const navigate = useNavigate();

  function resetForm() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();

    if (!isValidName(firstName) || !isValidName(lastName)) {
      toast.error('Revisa el nombre', 'Nombre y apellidos deben tener entre 2 y 60 letras.');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Revisa el correo', 'Ingresa un correo válido. Por ejemplo: nombre@dominio.com.');
      return;
    }
    if (phone.trim() && !isValidPhoneGT(phone)) {
      toast.error('Revisa el teléfono', 'Ingresa un teléfono válido de 8 dígitos. Por ejemplo: 5555-1234.');
      return;
    }

    try {
      const created = await createCustomer.mutateAsync({ firstName, lastName, email, phone });
      toast.success('Cliente registrado', `${created.firstName} ${created.lastName} ya tiene ficha.`);
      setModalOpen(false);
      resetForm();
      navigate(paths.adminCustomer(created.id));
    } catch (error) {
      toast.error(
        'No se pudo registrar',
        error instanceof ApiError ? error.message : 'Inténtalo de nuevo.',
      );
    }
  }

  return (
    <div className={s.page}>
      <SectionHeading
        as="h1"
        size="sm"
        eyebrow="Clientela"
        title="Clientes"
        description="Ficha, medidas, historial de pedidos y notas de cada persona que atiende el taller."
        action={
          <Button
            variant="primary"
            leftIcon={<Icon name="plus" size={16} />}
            onClick={() => setModalOpen(true)}
          >
            Nuevo cliente
          </Button>
        }
      />

      <Input
        label="Buscar"
        placeholder="Nombre, correo o teléfono"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        startAdornment={<Icon name="search" size={16} />}
        fieldClassName={s.search}
      />

      {isLoading ? (
        <Skeleton height="360px" radius="var(--radius-md)" />
      ) : (
        <Table
          columns={COLUMNS}
          rows={customers ?? []}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(paths.adminCustomer(row.id))}
          caption="Clientes del taller"
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo cliente"
        description="Se puede completar la ficha ahora y tomar sus medidas después, en su primera cita."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="new-customer-form"
              variant="primary"
              isLoading={createCustomer.isPending}
            >
              Registrar cliente
            </Button>
          </>
        }
      >
        <form id="new-customer-form" onSubmit={handleCreate} className={s.formGrid2}>
          <Input
            label="Nombre"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <Input
            label="Apellidos"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
          <Input
            label="Correo electrónico"
            type="email"
            required
            fieldClassName={s.span2}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Teléfono"
            type="tel"
            placeholder="+502 5555 1234"
            fieldClassName={s.span2}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
