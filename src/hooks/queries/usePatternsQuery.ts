// hooks/queries/usePatternsQuery.ts
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { Pattern } from '@/types/pattern';

type PatternsError = {
  message: string;
  status: number;
};

export const PATTERNS_QUERY_KEY = ['patterns'] as const;

export const usePatternsQuery = (): UseQueryResult<Pattern[], PatternsError> => {
  return useQuery({
    queryKey: PATTERNS_QUERY_KEY,
    queryFn: () => apiClient.getAllPatterns(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
