import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ReactNode} from 'react';

/**
 * QueryProvider component to provide React Query context.
 * @param {{ children: ReactNode }} props - The component props.
 * @returns {JSX.Element} The QueryProvider component.
 */

const queryClient = new QueryClient();

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};