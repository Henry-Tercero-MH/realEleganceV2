import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Badge, Button, Icon, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError, DEMO_CREDENTIALS } from '@/api';
import { ROLE_LABELS } from '@real-elegance/shared';
import { paths } from '@/routes/paths';
import s from './auth.module.css';
const loginSchema = z.object({
    email: z.string().trim().email('Escribe un correo válido.'),
    password: z.string().min(1, 'Escribe tu contraseña.'),
});
export default function LoginPage() {
    const { login } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [formError, setFormError] = useState(null);
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(loginSchema) });
    /** Destino tras entrar: de donde venía, o la portada. */
    const from = location.state?.from?.pathname;
    async function onSubmit(values) {
        setFormError(null);
        try {
            const user = await login(values.email, values.password);
            toast.success(`Hola, ${user.firstName ?? 'de nuevo'}`);
            navigate(from ?? (user.role === 'customer' ? paths.account : paths.admin), { replace: true });
        }
        catch (error) {
            setFormError(error instanceof ApiError ? error.message : 'No pudimos entrar. Inténtalo de nuevo.');
        }
    }
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: s.head, children: [_jsx("h1", { className: s.title, children: "Entrar" }), _jsx("p", { className: s.subtitle, children: "Accede para ver tus pedidos, tus citas y el avance de tu traje." })] }), _jsxs("form", { className: s.form, onSubmit: handleSubmit(onSubmit), noValidate: true, children: [formError ? (_jsxs("p", { className: s.alert, role: "alert", children: [_jsx(Icon, { name: "alert", size: 16 }), formError] })) : null, _jsx(Input, { label: "Correo electr\u00F3nico", type: "email", autoComplete: "email", required: true, error: errors.email?.message, ...register('email') }), _jsx(Input, { label: "Contrase\u00F1a", type: "password", autoComplete: "current-password", required: true, error: errors.password?.message, ...register('password') }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", fullWidth: true, isLoading: isSubmitting, className: s.submit, children: "Entrar" })] }), _jsxs("p", { className: s.switch, children: ["\u00BFA\u00FAn no tienes cuenta? ", _jsx(Link, { to: paths.register, children: "Crear una" })] }), _jsxs("div", { className: s.demo, children: [_jsxs("p", { className: s.demoTitle, children: [_jsx(Icon, { name: "info", size: 14 }), " Cuentas de demostraci\u00F3n"] }), _jsx("ul", { role: "list", className: s.demoList, children: DEMO_CREDENTIALS.map((account) => (_jsx("li", { children: _jsxs("button", { type: "button", className: s.demoAccount, onClick: () => {
                                    setValue('email', account.email);
                                    setValue('password', account.password);
                                }, children: [_jsx("span", { className: s.demoEmail, children: account.email }), _jsx(Badge, { tone: "gold", size: "sm", children: ROLE_LABELS[account.role] })] }) }, account.email))) })] })] }));
}
//# sourceMappingURL=LoginPage.js.map