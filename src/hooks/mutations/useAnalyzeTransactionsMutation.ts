// hooks/mutations/useAnalyzeTransactionsMutation.ts
import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { 
  AnalyzeTransactionsRequestDto, 
  AnalyzeTransactionsResponseDto 
} from '@/types/transaction';

type AnalyzeTransactionsError = {
  message: string;
  status: number;
};

type AnalyzeTransactionsContext = {
  previousData?: unknown;
};

export const useAnalyzeTransactionsMutation = (): UseMutationResult<
  AnalyzeTransactionsResponseDto,    
  AnalyzeTransactionsError,          
  AnalyzeTransactionsRequestDto,    
  AnalyzeTransactionsContext        
> => {
  return useMutation({
    mutationFn: (data: AnalyzeTransactionsRequestDto) => 
      apiClient.analyzeTransactions(data),

    onError: (error) => {
      console.error('Analysis failed:', error.message);
    },
  });
};
