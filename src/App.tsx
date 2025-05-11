import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from 'react';
import WorkspaceInterface from "@/components/WorkspaceInterface";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ShutterstockSettings } from "./components/ShutterstockSettings";
import MediaTest from "./pages/MediaTest";

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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Admin routes */}
            <Route path="/admin">
              <Route path="workspace" element={<WorkspaceInterface />} />
              <Route path="settings" element={<ShutterstockSettings />} />
            </Route>
            <Route path="/media-test" element={<MediaTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
