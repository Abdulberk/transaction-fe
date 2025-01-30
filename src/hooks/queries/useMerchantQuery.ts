// hooks/queries/useMerchantQuery.ts
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import apiClient from '@/utils/api-client';
import type { Merchant } from '@/types/merchant';

type MerchantError = {
  message: string;
  status: number;
};

export const MERCHANT_QUERY_KEY = 'merchant' as const;

export const useMerchantQuery = (
  id: string
): UseQueryResult<Merchant, MerchantError> => {
  return useQuery({
    queryKey: [MERCHANT_QUERY_KEY, id],
    queryFn: () => apiClient.getMerchant(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, 
  });
};