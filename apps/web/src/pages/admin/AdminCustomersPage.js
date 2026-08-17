import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Icon, Input, Modal, SectionHeading, Skeleton, Table, } from '@/components/ui';
import { useAdminCustomers, useCreateCustomer } from '@/features/admin/hooks';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import { formatCurrency, formatDate, formatPoints } from '@/lib/format';
import { isValidEmail, isValidName, isValidPhoneGT } from '@/lib/validation';
import s from './admin.module.css';
const COLUMNS = [
    {
        id: 'customer',
        header: 'Cliente',
        cell: (row) => (_jsxs("div", { children: [_jsxs("span", { className: s.cellName, children: [row.firstName, " ", row.lastName] }), _jsx("span", { className: s.cellSub, children: row.email })] })),
    },
    { id: 'phone', header: 'Teléfono', hideOnMobile: true, cell: (row) => row.phone ?? '—' },
    {
        id: 'orders',
        header: 'Pedidos',
        align: 'right',
        cell: (row) => row.totalOrders > 0 ? (_jsx(Badge, { tone: "neutral", size: "sm", children: row.totalOrders })) : ('—'),
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
    async function handleCreate(event) {
        event.preventDefault();
        if (!isValidName(firstName) || !isValidName(lastName)) {
            toast.error('Revisa el nombre', 'Nombre y apellidos deben tener entre 2 y 60 letras.');
            return;
        }
        if (!isValidEmail(email)) {
            toast.error('Revisa el correo', 'Ingresa un correo válido, ej. nombre@dominio.com.');
            return;
        }
        if (phone.trim() && !isValidPhoneGT(phone)) {
            toast.error('Revisa el teléfono', 'Ingresa un teléfono válido de 8 dígitos (ej. 5555-1234).');
            return;
        }
        try {
            const created = await createCustomer.mutateAsync({ firstName, lastName, email, phone });
            toast.success('Cliente registrado', `${created.firstName} ${created.lastName} ya tiene ficha.`);
            setModalOpen(false);
            resetForm();
            navigate(paths.adminCustomer(created.id));
        }
        catch (error) {
            toast.error('No se pudo registrar', error instanceof ApiError ? error.message : 'Inténtalo de nuevo.');
        }
    }
    return (_jsxs("div", { className: s.page, children: [_jsx(SectionHeading, { as: "h1", size: "sm", eyebrow: "Clientela", title: "Clientes", description: "Ficha, medidas, historial de pedidos y notas de cada persona que atiende el taller.", action: _jsx(Button, { variant: "primary", leftIcon: _jsx(Icon, { name: "plus", size: 16 }), onClick: () => setModalOpen(true), children: "Nuevo cliente" }) }), _jsx(Input, { label: "Buscar", placeholder: "Nombre, correo o tel\u00E9fono", value: search, onChange: (event) => setSearch(event.target.value), startAdornment: _jsx(Icon, { name: "search", size: 16 }), fieldClassName: s.search }), isLoading ? (_jsx(Skeleton, { height: "360px", radius: "var(--radius-md)" })) : (_jsx(Table, { columns: COLUMNS, rows: customers ?? [], rowKey: (row) => row.id, onRowClick: (row) => navigate(paths.adminCustomer(row.id)), caption: "Clientes del taller" })), _jsx(Modal, { open: modalOpen, onClose: () => setModalOpen(false), title: "Nuevo cliente", description: "Se puede completar la ficha ahora y tomar sus medidas despu\u00E9s, en su primera cita.", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: () => setModalOpen(false), children: "Cancelar" }), _jsx(Button, { type: "submit", form: "new-customer-form", variant: "primary", isLoading: createCustomer.isPending, children: "Registrar cliente" })] }), children: _jsxs("form", { id: "new-customer-form", onSubmit: handleCreate, className: s.formGrid2, children: [_jsx(Input, { label: "Nombre", required: true, value: firstName, onChange: (event) => setFirstName(event.target.value) }), _jsx(Input, { label: "Apellidos", required: true, value: lastName, onChange: (event) => setLastName(event.target.value) }), _jsx(Input, { label: "Correo electr\u00F3nico", type: "email", required: true, fieldClassName: s.span2, value: email, onChange: (event) => setEmail(event.target.value) }), _jsx(Input, { label: "Tel\u00E9fono", type: "tel", placeholder: "+502 5555 1234", fieldClassName: s.span2, value: phone, onChange: (event) => setPhone(event.target.value) })] }) })] }));
}
//# sourceMappingURL=AdminCustomersPage.js.map