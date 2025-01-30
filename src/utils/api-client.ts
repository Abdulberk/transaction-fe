// src/services/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from '@/hooks/use-toast';

import type { 
  GetTransactionsQueryDto, 
  Transaction,
  TransactionListResponseDto,
  UploadTransactionResponseDto,
  AnalyzeTransactionsRequestDto,
  AnalyzeTransactionsResponseDto,
} from '@/types/transaction';

import type {
  SearchMerchantsDto,
  SearchMerchantsResponseDto,
  Merchant,
  CreateMerchantDto,
  NormalizeMerchantRequestDto,
  NormalizeMerchantResponseDto,
} from '@/types/merchant';

import type {
  Pattern,
  PatternAnalysisRequestDto,
  PatternAnalysisResponseDto,
} from '@/types/pattern';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_APP_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
        return Promise.reject(error);
      }
    );
  }


  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T, D = unknown>(
    url: string, 
    data: D, 
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T, D = unknown>(
    url: string, 
    data: D, 
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Transactions
  async getTransactions(params: GetTransactionsQueryDto = {}): Promise<TransactionListResponseDto> {
    return this.get<TransactionListResponseDto>('/api/transactions', params);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.get<Transaction>(`/api/transactions/${id}`);
  }

  async uploadTransactions(file: File): Promise<UploadTransactionResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.post<UploadTransactionResponseDto, FormData>(
      '/api/transactions/upload', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  async analyzeTransactions(
    data: AnalyzeTransactionsRequestDto
  ): Promise<AnalyzeTransactionsResponseDto> {
    return this.post<AnalyzeTransactionsResponseDto, AnalyzeTransactionsRequestDto>(
      '/api/transactions/analyze', 
      data
    );
  }


  async getMerchants(params: SearchMerchantsDto = {}): Promise<SearchMerchantsResponseDto> {
    return this.get<SearchMerchantsResponseDto>('/api/merchants', params);
  }

  async getMerchant(id: string): Promise<Merchant> {
    return this.get<Merchant>(`/api/merchants/${id}`);
  }

  async createMerchant(data: CreateMerchantDto): Promise<Merchant> {
    return this.post<Merchant, CreateMerchantDto>('/api/merchants', data);
  }

  async updateMerchant(
    id: string, 
    data: Partial<CreateMerchantDto>
  ): Promise<Merchant> {
    return this.put<Merchant, Partial<CreateMerchantDto>>(`/api/merchants/${id}`, data);
  }

  async deactivateMerchant(id: string): Promise<void> {
    return this.delete<void>(`/api/merchants/${id}`);
  }

  async normalizeMerchant(
    data: NormalizeMerchantRequestDto
  ): Promise<NormalizeMerchantResponseDto> {
    return this.post<NormalizeMerchantResponseDto, NormalizeMerchantRequestDto>(    
      '/api/merchants/normalize', 
      data
    );
  }


  async getPatternsByMerchant(merchantId: string): Promise<Pattern[]> {
    return this.get<Pattern[]>(`/api/patterns/merchant/${merchantId}`);
  }

  async getAllPatterns(): Promise<Pattern[]> {
    return this.get<Pattern[]>('/api/patterns');
  }

  async analyzePatterns(
    data: PatternAnalysisRequestDto
  ): Promise<PatternAnalysisResponseDto> {
    return this.post<PatternAnalysisResponseDto, PatternAnalysisRequestDto>(
      '/api/patterns/analyze', 
      data
    );
  }
}

export const apiClient = new ApiClient();
export default apiClient;


export const fetcher = (url: string) => apiClient.get(url);