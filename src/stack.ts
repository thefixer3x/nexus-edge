import { StackClientApp } from '@stackframe/stack';

// Fallback values if environment variables are not set
const projectId = import.meta.env.VITE_STACK_PROJECT_ID || 
                 process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 
                 'demo-project';

const publishableKey = import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || 
                      process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || 
                      'demo-key';

export const stackClientApp = new StackClientApp({
  projectId,
  publishableClientKey,
  tokenStore: "memory",
});
