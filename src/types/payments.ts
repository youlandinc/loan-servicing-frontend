import { PipelineStatusEnum } from '@/types/enum';

export interface ResponsePaymentsDetails {
  nextDueDate: string;
  loanNumber: string;
  propertyFullAddress: string;
  repaymentStatus: PipelineStatusEnum;
  interestReceived: number;
  reserveBalance: number;
  lateChargesReceived: number;
}
