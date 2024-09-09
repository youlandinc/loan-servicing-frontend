import { MaturityDateTypeEnum, PipelineStatusEnum } from '@/types/enum';

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

export interface IGetExtensionPdfParam {
  loanId: number;
  extensionFee: number;
  // extensionFeeAmount: number;
  changeInterestRate: number;
  executionDate: string;
  maturityDate: MaturityDateTypeEnum;
  // extendMonth: MaturityDateTypeEnum;
}
