import { PipelineStatusEnum } from '@/types/enum';

export interface ResponsePaymentsDetails {
  nextDueDate: string;
  systemLoanNumber: string;
  propertyFullAddress: string;
  repaymentStatus: PipelineStatusEnum;
  interestReceived: number;
  reserveBalance: number;
  lateChargesReceived: number;
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
  content: Partial<PaymentHistoryItem>[];
  page: PageProps;
}

export interface PageProps {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PaymentHistoryItem {
  loanId: number;
  dataReceivedTime: string;
  dataDue: string;
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
  reference: string;
}
