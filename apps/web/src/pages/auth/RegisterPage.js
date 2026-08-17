import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Checkbox, Icon, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ApiError } from '@/api';
import { paths } from '@/routes/paths';
import s from './auth.module.css';
const registerSchema = z
    .object({
    firstName: z.string().trim().min(2, 'Escribe tu nombre.'),
    lastName: z.string().trim().min(2, 'Escribe tus apellidos.'),
    email: z.string().trim().email('Escribe un correo válido.'),
    password: z
        .string()
        .min(8, 'Usa al menos 8 caracteres.')
        .regex(/[A-Za-z]/, 'Incluye alguna letra.')
        .regex(/\d/, 'Incluye algún número.'),
    confirmPassword: z.string(),
    acceptsTerms: z.literal(true, {
        errorMap: () => ({ message: 'Debes aceptar las condiciones.' }),
    }),
})
    // La comparación va en `refine` para poder señalar el campo correcto.
    .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
});
export default function RegisterPage() {
    const { register: signUp } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(registerSchema) });
    async function onSubmit(values) {
        setFormError(null);
        try {
            await signUp({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
            });
            toast.success('Cuenta creada', 'Ya puedes encargar tu primer traje.');
            navigate(paths.account, { replace: true });
        }
        catch (error) {
            setFormError(error instanceof ApiError ? error.message : 'No pudimos crear la cuenta. Inténtalo de nuevo.');
        }
    }
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: s.head, children: [_jsx("h1", { className: s.title, children: "Crear cuenta" }), _jsx("p", { className: s.subtitle, children: "Guardamos tus medidas para que el siguiente traje sea a\u00FAn m\u00E1s r\u00E1pido." })] }), _jsxs("form", { className: s.form, onSubmit: handleSubmit(onSubmit), noValidate: true, children: [formError ? (_jsxs("p", { className: s.alert, role: "alert", children: [_jsx(Icon, { name: "alert", size: 16 }), formError] })) : null, _jsxs("div", { className: s.grid2, children: [_jsx(Input, { label: "Nombre", autoComplete: "given-name", required: true, error: errors.firstName?.message, ...register('firstName') }), _jsx(Input, { label: "Apellidos", autoComplete: "family-name", required: true, error: errors.lastName?.message, ...register('lastName') })] }), _jsx(Input, { label: "Correo electr\u00F3nico", type: "email", autoComplete: "email", required: true, error: errors.email?.message, ...register('email') }), _jsx(Input, { label: "Contrase\u00F1a", type: "password", autoComplete: "new-password", required: true, hint: "M\u00EDnimo 8 caracteres, con letras y n\u00FAmeros.", error: errors.password?.message, ...register('password') }), _jsx(Input, { label: "Repite la contrase\u00F1a", type: "password", autoComplete: "new-password", required: true, error: errors.confirmPassword?.message, ...register('confirmPassword') }), _jsx(Checkbox, { label: "Acepto las condiciones y la pol\u00EDtica de privacidad.", error: errors.acceptsTerms?.message, ...register('acceptsTerms') }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", fullWidth: true, isLoading: isSubmitting, className: s.submit, children: "Crear cuenta" })] }), _jsxs("p", { className: s.switch, children: ["\u00BFYa tienes cuenta? ", _jsx(Link, { to: paths.login, children: "Entrar" })] })] }));
}
//# sourceMappingURL=RegisterPage.js.map