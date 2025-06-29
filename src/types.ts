export interface LoanResult {
  originalAmount: number;
  newAmount: number;
  savings: number;
  savingsPercentage: number;
  interestRate: string;
  tenure: string;
  provider: string;
  product: string;
  processedAt: string;
  fileName: string;
  note?: string;
}

export interface ProcessingStage {
  stage: 'upload' | 'processing' | 'results';
  fileName?: string;
  result?: LoanResult;
}

export interface UserDetails {
  name: string;
  email: string;
  mobile: string;
} 