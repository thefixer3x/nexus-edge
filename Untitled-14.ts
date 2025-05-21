// src/components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Add a loading state if needed
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// In your routes setup
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

