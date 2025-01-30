
// types/transaction.ts
import { DetectedPatternDto } from "./pattern";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  analysis: {
    merchant?: {
      id: string;
      name: string;
      category: string;
    };
    category: string;
    subCategory?: string;
    confidence: number;
    isSubscription: boolean;
    flags: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionListItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  merchant?: {
    id: string;
    name: string;
    category: string;
  };
  category: string;
  subCategory?: string;
  isSubscription: boolean;
  flags: string[];
}
export interface TransactionListResponseDto {
  items: TransactionListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface AnalyzeTransactionsResponseDto {
  normalized_transactions: NormalizedTransactionDto[];
  detected_patterns: DetectedPatternDto[];
}

export interface NormalizedTransactionDto {
  original: string;
  normalized: {
    merchant: string;
    category: string;
    sub_category: string;
    confidence: number;
    is_subscription: boolean;
    flags: string[];
  };
}

export interface UploadTransactionResponseDto {
  normalized_transactions: NormalizedTransactionDto[];
  detected_patterns: DetectedPatternDto[];
  processedCount: number;
  failedCount: number;
  errors?: string[];
  savedResources: {
    merchants: Array<{
      id: string;
      normalizedName: string;
    }>;
    transactions: Array<{
      id: string;
      description: string;
    }>;
    patterns: Array<{
      id: string;
      type: string;
      merchant: string;
    }>;
  };
}

export interface AnalyzeTransactionsRequestDto {
  transactions: {
    description: string;
    amount: number;
    date: string;
  }[];
}

export interface GetTransactionsQueryDto extends Record<string, unknown> {
  page?: number;
  limit?: number;
  merchantId?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  search?: string;
  sortBy?: 'date' | 'amount' | 'merchant' | 'category';
  order?: 'asc' | 'desc';
}