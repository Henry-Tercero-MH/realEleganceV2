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

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
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
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'No pudimos crear la cuenta. Inténtalo de nuevo.',
      );
    }
  }

  return (
    <>
      <header className={s.head}>
        <h1 className={s.title}>Crear cuenta</h1>
        <p className={s.subtitle}>
          Guardamos tus medidas para que el siguiente traje sea aún más rápido.
        </p>
      </header>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError ? (
          <p className={s.alert} role="alert">
            <Icon name="alert" size={16} />
            {formError}
          </p>
        ) : null}

        <div className={s.grid2}>
          <Input
            label="Nombre"
            autoComplete="given-name"
            required
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Apellidos"
            autoComplete="family-name"
            required
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          required
          hint="Mínimo 8 caracteres, con letras y números."
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Checkbox
          label="Acepto las condiciones y la política de privacidad."
          error={errors.acceptsTerms?.message}
          {...register('acceptsTerms')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          className={s.submit}
        >
          Crear cuenta
        </Button>
      </form>

      <p className={s.switch}>
        ¿Ya tienes cuenta? <Link to={paths.login}>Entrar</Link>
      </p>
    </>
  );
}
