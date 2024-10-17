import { LoanAnswerEnum, PipelineStatusEnum } from '@/types/enum';

export interface ResponsePaymentsDetails {
  nextPaymentDate: string;
  systemLoanNumber: string;
  propertyFullAddress: string;
  repaymentStatus: PipelineStatusEnum;
  interestReceived: number;
  reserveBalance: number;
  lateChargesReceived: number;
}

export enum AbutmentSources {
  fci = 'FCI',
  youland = 'YOULAND',
  alameda = 'ALAMEDA',
}

export interface ResponsePaymentsHistory {
  totalItem: number;
  accumulateTotalPmt: number;
  accumulateTotalInterestReceived: number;
  accumulateDefaultInterestReceived: number;
  accumulateInterestRateReceived: number;
  accumulatePrincipalReceived: number;
  accumulateAccruedLateCharges: number;
  accumulateWaivedLateCharges: number;
  accumulateReservePmt: number;
  accumulateReserveRestricted: number;
  abutmentSources: AbutmentSources;
  content: Partial<PaymentHistoryItem>[];
  page: PageProps;
}

export interface PageProps {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export enum PaymentMethod {
  ach = 'ACH',
  check = 'CHECK',
  wire_transfer = 'WIRE_TRANSFER',
}

export interface PaymentHistoryItem {
  id: number | string;
  loanId: number;
  dataReceivedTime: string | null | undefined | Date;
  dateDue: string | null | undefined | Date;
  pmtDayVariance: number;
  isAch: boolean;
  paymentType: string;
  totalPmt: number;
  lateChargesPaid: number;
  totalInterestReceived: number;
  defaultInterestReceived: null | number;
  interestRateReceived: null | number;
  principalReceived: number;
  accruedLateCharges: number;
  waivedLateCharges: null | number;
  reservePmt: number;
  reserveRestricted: null | number;
  additionalInformation: null | string;
  paymentMethod: PaymentMethod;
  reference: string;
  nsf: LoanAnswerEnum;
}
