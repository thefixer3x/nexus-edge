import React from "react";
// i18n initialization
import "./i18n";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from 'react';
import AppRoutes from './routes/index.tsx';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackClientApp } from './stack';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
    <div className="text-teal-500">Loading...</div>
  </div>
);

const App = () => (
  <StackProvider app={stackClientApp}>
    <StackTheme>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StackTheme>
  </StackProvider>
);

export default App;
