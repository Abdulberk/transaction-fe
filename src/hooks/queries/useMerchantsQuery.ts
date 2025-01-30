// hooks/queries/useMerchantsQuery.ts
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { 
  SearchMerchantsDto, 
  SearchMerchantsResponseDto 
} from '@/types/merchant';

type MerchantsError = {
  message: string;
  status: number;
};

export const MERCHANTS_QUERY_KEY = 'merchants' as const;

export const useMerchantsQuery = (
  params: SearchMerchantsDto = {}
): UseQueryResult<SearchMerchantsResponseDto, MerchantsError> => {
  return useQuery({
    queryKey: [MERCHANTS_QUERY_KEY, params],
    queryFn: () => apiClient.getMerchants(params),
    staleTime: 5 * 60 * 1000, 
  });
};