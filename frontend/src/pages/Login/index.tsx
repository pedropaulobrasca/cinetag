import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch {
      setError('E-mail ou senha inválidos. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-primary px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm glass-panel p-8 rounded-2xl relative z-10"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <Film className="w-12 h-12 text-accent mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Cine<span className="text-accent">Tag</span>
          </h1>
          <p className="mt-2 text-text-secondary text-sm">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            required
            autoComplete="email"
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
            autoComplete="current-password"
          />

          {error ? (
            <p role="alert" className="rounded bg-red-900/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-accent hover:text-white transition-colors font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
