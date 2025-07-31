import { useUser } from '@stackframe/stack';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [authError, setAuthError] = useState(false);
  
  try {
    const user = useUser();
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    // If Stack Auth fails, show a fallback
    console.error('Stack Auth error:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Issue</h2>
          <p className="text-muted-foreground mb-4">
            There's an issue with the authentication service.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
}
