export { supabase } from '@/integrations/supabase/client';

// Re-export commonly used types
export type { Database } from '@/integrations/supabase/types';

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Common error handling
  if (error?.code === 'PGRST301') {
    throw new Error('Resource not found');
  }
  
  if (error?.code === '23505') {
    throw new Error('This item already exists');
  }
  
  if (error?.message) {
    throw new Error(error.message);
  }
  
  throw new Error('An unexpected error occurred');
};

// Helper function for authenticated requests
export const getAuthenticatedUserId = () => {
  // This would typically come from your auth context
  // For now, returning null since we're using Stack Auth
  return null;
};
