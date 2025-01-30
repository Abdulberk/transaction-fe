// hooks/queries/useTransactionQuery.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { Transaction } from '@/types/transaction';

export const TRANSACTION_QUERY_KEY = 'transaction' as const;
export const useTransactionQuery = (id: string) => {
  return useQuery<Transaction>({
    queryKey: [TRANSACTION_QUERY_KEY, id],
    queryFn: () => apiClient.getTransaction(id),
    enabled: !!id,
  });
};