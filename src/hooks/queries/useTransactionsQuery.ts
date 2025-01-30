// hooks/queries/useTransactionsQuery.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { GetTransactionsQueryDto, TransactionListResponseDto } from '@/types/transaction';

export const TRANSACTIONS_QUERY_KEY = 'transactions' as const;
export const useTransactionsQuery = (params: GetTransactionsQueryDto = {}) => {
  return useQuery<TransactionListResponseDto>({
    queryKey: [TRANSACTIONS_QUERY_KEY, params],
    queryFn: () => apiClient.getTransactions(params),
  });
};