// types/merchant.ts
export interface Merchant {
  id: string;
  originalName: string;
  normalizedName: string;
  category: string;
  subCategory?: string;
  confidence: number;
  isActive: boolean;
  flags: string[];
  transactionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMerchantDto {
  originalName: string;
  normalizedName: string;
  category: string;
  subCategory?: string;
}

export interface SearchMerchantsDto extends Record<string, unknown> {
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchMerchantsResponseDto {
  items: Merchant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NormalizeMerchantRequestDto {
  transaction: {
    description: string;
    amount: number;
    date: string;
  };
}

export interface NormalizedMerchantDto {
  merchant: string;
  category: string;
  sub_category: string;
  confidence: number;
  is_subscription: boolean;
  flags: string[];
}

export interface NormalizeMerchantResponseDto {
  normalized: NormalizedMerchantDto;
}


export interface MerchantData {
  original: string;
  normalized: string;
  categories: string[];
  tags: string[];
}