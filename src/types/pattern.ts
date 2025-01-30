// types/pattern.ts


export enum PatternType {
    SUBSCRIPTION = 'SUBSCRIPTION',
    RECURRING = 'RECURRING',
    PERIODIC = 'PERIODIC'
}

export enum Frequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    BIWEEKLY = 'BIWEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY',
    IRREGULAR = 'IRREGULAR'

}


  
  export interface PatternAnalysisRequestDto {
    transactions: {
      description: string;
      amount: number;
      date: string;
    }[];
  }
  
  export interface DetectedPatternDto {
    type: string;
    merchant: string;
    amount: number;
    frequency: string;
    confidence: number;
    next_expected: string;
    notes?: string;
  }
  
  export interface PatternAnalysisResponseDto {
    patterns: DetectedPatternDto[];
  }


  export interface Pattern {
    id: string;
    type: string;
    merchantId: string;
    amount: number;
    frequency:  string;
    confidence: number;
    nextExpectedDate: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    merchantName?: string;
  }