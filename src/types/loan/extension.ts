import { MaturityDateTypeEnum, PipelineStatusEnum } from '@/types/enum';

export interface IExtensionInfo {
  downloadId: number | null;
  loanId: number;
  loanNumber: string;
  defaultRate: number;
  maturityDate: string;
  totalLoanAmount: number;
  propertyFullAddress: string;
  repaymentStatusEnum: PipelineStatusEnum;
  currentInterestRate: number;
  createdTime: string | null;
}

export interface IGetExtensionPdfParam {
  loanId: number;
  extensionFee: number;
  extensionFeeAmount: number;
  changeInterestRate: number;
  executionDate: string;
  maturityDate: string;
  extendMonth: MaturityDateTypeEnum;
}
