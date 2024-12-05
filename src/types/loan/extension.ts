import {
  ExtensionPaidTypeEnum,
  MaturityDateTypeEnum,
  PipelineStatusEnum,
} from '@/types/enum';

export type ExtensionDocItem = {
  id: number;
  loanId: number;
  // "extendMonth": "EXTEND_THREE",
  currentInterestRate: number;
  totalLoanAmount: number;
  defaultRate: number;
  extensionFee: number;
  extensionFeeAmount: number;
  changeInterestRate: number;
  executionDate: string;
  maturityDate: string;
  // "paidMode": "UPFRONT",
  createdTime: string;
  createdBy: string;
};

export interface IExtensionInfo {
  downloadId: number | null;
  loanId: number;
  systemLoanNumber: string;
  defaultRate: number;
  maturityDate: string;
  totalLoanAmount: number;
  propertyFullAddress: string;
  repaymentStatusEnum: PipelineStatusEnum;
  currentInterestRate: number;
  createdTime: string | null;
  paidMode: ExtensionPaidTypeEnum | null;
  extensionFee: number | null;
  executionDate: string | null;
  confirmAgreements: ExtensionDocItem[];
  genAgreement: ExtensionDocItem;
}

export interface IGetExtensionPdfParam {
  loanId: number;
  extensionFee: number;
  extensionFeeAmount: number;
  changeInterestRate: number;
  executionDate: string;
  maturityDate: string;
  extendMonth: MaturityDateTypeEnum;
  paidMode: ExtensionPaidTypeEnum;
}
