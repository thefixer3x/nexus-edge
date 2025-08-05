import { StackClientApp } from '@stackframe/stack';

// Fallback values if environment variables are not set
const projectId = import.meta.env.VITE_STACK_PROJECT_ID ||
                 process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

const publishableClientKey = import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY ||
                            process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

if (!projectId) {
  throw new Error("Missing required environment variable: VITE_STACK_PROJECT_ID or NEXT_PUBLIC_STACK_PROJECT_ID");
}
if (!publishableClientKey) {
  throw new Error("Missing required environment variable: VITE_STACK_PUBLISHABLE_CLIENT_KEY or NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY");
}
export const stackClientApp = new StackClientApp({
  projectId,
  publishableClientKey,
  tokenStore: "memory",
});
