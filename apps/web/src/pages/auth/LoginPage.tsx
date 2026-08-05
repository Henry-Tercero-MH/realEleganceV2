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

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  /** Destino tras entrar: de donde venía, o la portada. */
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Hola, ${user.firstName ?? 'de nuevo'}`);
      navigate(from ?? (user.role === 'customer' ? paths.account : paths.admin), { replace: true });
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'No pudimos entrar. Inténtalo de nuevo.',
      );
    }
  }

  return (
    <>
      <header className={s.head}>
        <h1 className={s.title}>Entrar</h1>
        <p className={s.subtitle}>
          Accede para ver tus pedidos, tus citas y el avance de tu traje.
        </p>
      </header>

      <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {formError ? (
          <p className={s.alert} role="alert">
            <Icon name="alert" size={16} />
            {formError}
          </p>
        ) : null}

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
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          className={s.submit}
        >
          Entrar
        </Button>
      </form>

      <p className={s.switch}>
        ¿Aún no tienes cuenta? <Link to={paths.register}>Crear una</Link>
      </p>

      {/* Atajo de la fase de diseño: rellena las credenciales de demostración. */}
      <div className={s.demo}>
        <p className={s.demoTitle}>
          <Icon name="info" size={14} /> Cuentas de demostración
        </p>
        <ul role="list" className={s.demoList}>
          {DEMO_CREDENTIALS.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                className={s.demoAccount}
                onClick={() => {
                  setValue('email', account.email);
                  setValue('password', account.password);
                }}
              >
                <span className={s.demoEmail}>{account.email}</span>
                <Badge tone="gold" size="sm">
                  {ROLE_LABELS[account.role]}
                </Badge>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
