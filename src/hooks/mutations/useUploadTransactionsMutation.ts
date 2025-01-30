// hooks/mutations/useUploadTransactionsMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { UploadTransactionResponseDto } from '@/types/transaction';
import { TRANSACTIONS_QUERY_KEY } from '../queries/useTransactionsQuery';
import { MERCHANTS_QUERY_KEY } from '../queries/useMerchantsQuery';
import { PATTERNS_QUERY_KEY } from '../queries/usePatternsQuery';

type UploadTransactionError = {
  message: string;
  status: number;
};

type UploadTransactionContext = {
  previousData?: unknown;
};

export const useUploadTransactionsMutation = (): UseMutationResult<
  UploadTransactionResponseDto, 
  UploadTransactionError,     
  File,                       
  UploadTransactionContext     
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => apiClient.uploadTransactions(file),
    
    onMutate: async () => {
     
      await queryClient.cancelQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });

   
      const previousData = queryClient.getQueryData([TRANSACTIONS_QUERY_KEY]);

      return { previousData };
    },

    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });


      queryClient.invalidateQueries({ queryKey: [MERCHANTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PATTERNS_QUERY_KEY] });
    },

    onError: (error, variables, context) => {
 
      if (context?.previousData) {
        queryClient.setQueryData([TRANSACTIONS_QUERY_KEY], context.previousData);
      }
    },

    onSettled: () => {
    
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_QUERY_KEY] });
    },
  });
};