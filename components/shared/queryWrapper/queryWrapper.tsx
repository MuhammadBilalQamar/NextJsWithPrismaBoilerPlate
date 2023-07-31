'use client';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';

export interface IQueryWrapper {
  children: React.ReactNode;
}

const queryClient = new QueryClient();
const QueryWrapper: React.FC<IQueryWrapper> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryWrapper;
