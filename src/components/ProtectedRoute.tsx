import { useUser } from '@stackframe/stack';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
