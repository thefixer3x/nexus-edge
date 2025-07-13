app.tsx

import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AIChatSupport } from '@/components/AIChatSupport';
import { Toaster } from '@/components/ui/toaster';
import { useCursorAnimation } from '@/hooks/useCursorAnimation';

export function App() {
  // Initialize smooth scroll and snap
  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = 'smooth';
    // Optional: Enable scroll snapping (comment out if not needed)
    // html.style.scrollSnapType = 'y proximity';
    
    // Modern scrollbar styling
    const style = document.createElement('style');
    style.innerHTML = `
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: hsl(var(--background));
      }
      ::-webkit-scrollbar-thumb {
        background: hsl(var(--primary));
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize cursor animation
  useCursorAnimation();

  return (
    <Router>
      {/* Your app layout */}
      <div className="min-h-screen">
        {/* Routes would go here */}
        <AIChatSupport />
        <Toaster />
      </div>
    </Router>
  );
}

import { AuthProvider } from '@/contexts/AuthContext';

export function App() {
  // ... your existing code

  return (
    <AuthProvider>
      <Router>
        {/* Your routes */}
      </Router>
    </AuthProvider>
  );
}

import { ThemeProvider } from '@/contexts/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Rest of your app */}
      </AuthProvider>
    </ThemeProvider>
  );
}