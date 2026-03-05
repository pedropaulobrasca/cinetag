import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Spinner } from '../ui/Spinner';

export function ProtectedRoute() {
  const { isAuthenticated, isLoadingSession } = useAuth();

  if (isLoadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-primary">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
