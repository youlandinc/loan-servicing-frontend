import { PipelineStatusEnum } from '@/types/enum';

export interface IExtensionInfo {
  downloadId: number;
  loanId: number;
  loanNumber: string;
  defaultRate: number;
  maturityDate: string;
  totalLoanAmount: number;
  propertyFullAddress: string;
  repaymentStatusEnum: PipelineStatusEnum;
  currentInterestRate: number;
}
