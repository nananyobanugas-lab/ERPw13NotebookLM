export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SCHEMA_DESIGN = 'SCHEMA_DESIGN',
  AUTOMATION = 'AUTOMATION',
  REPORTING = 'REPORTING'
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ExtractedInvoice {
  vendorName: string;
  invoiceId: string;
  totalAmount: number;
  taxAmount: number;
  currency: string;
  itemDescription: string;
  glDebitAccount: string;
  glCreditAccount: string;
  confidenceScore: number;
  requiresReview: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  predicted?: number;
}
