import { LoanAnswerEnum, PipelineStatusEnum } from '@/types/enum';

export interface ResponsePaymentsDetails {
  nextPaymentDate: string;
  systemLoanNumber: string;
  propertyFullAddress: string;
  repaymentStatus: PipelineStatusEnum;
  interestReceived: number;
  reserveBalance: number;
  lateChargesReceived: number;
  remainingRehabBudget: number;
  rehabBudget: number;
  amountDrawn: number;
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
  accumulateDrawNumber: number;
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
  totalPmt: number;
  lateChargesPaid: number;
  totalInterestReceived: number;
  defaultInterestReceived: null | number;
  interestRateReceived: null | number;
  accruedLateCharges: number;
  waivedLateCharges: null | number;
  reservePmt: number;
  reserveRestricted: null | number;
  additionalInformation: null | string;
  paymentMethod: PaymentMethod;
  reference: string;
  nsf: LoanAnswerEnum;
  // updated
  paymentType: string;
  principalReceived: number;
  // draw
  drawNumber: number | null;
  fundingDate: string | null | undefined | Date;
  recommendedDraw: number | null;
  inspectionFee: number | null;
  wireFee: number | null;
  netFunding: number | null;
}

export enum PaymentTypeEnum {
  reg_pmt = 'REG_PMT',
  funding = 'FUNDING',
}
