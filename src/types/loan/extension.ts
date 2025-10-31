import {
  ExtensionPaidTypeEnum,
  LoanAnswerEnum,
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
  extensionNumber: number;
  propertyFullAddress: string;
  downloadId: number;
};

export interface IExtensionInfo {
  address: string;
  aptNumber: string;
  borrowerName: string;
  changeInterestRate: number;
  city: string;
  confirmAgreements: ExtensionDocItem[];
  currentBalance: number;
  currentMaturityDate: string;
  defaultRate: number;
  executionDate: string;
  extendMonth: MaturityDateTypeEnum;
  extensionFee: number;
  extensionNumber: number;
  genAgreement: ExtensionDocItem;
  interestRate: number;
  isChangeInterestRate: LoanAnswerEnum;
  loanId: number;
  paymentTiming: ExtensionPaidTypeEnum;
  promissoryNoteDate: string;
  propertyFullAddress: string;
  repaymentStatusEnum: PipelineStatusEnum;
  state: string;
  systemLoanNumber: string;
  totalLoanAmount: number;
  zipCode: string;
}

export interface IGetExtensionPdfParam {
  loanId: number;
  extensionFee: number;
  extensionFeeAmount?: number;
  changeInterestRate?: number;
  executionDate: string;
  maturityDate?: string;
  extendMonth: MaturityDateTypeEnum;
  paidMode?: ExtensionPaidTypeEnum;
  paymentTiming?: ExtensionPaidTypeEnum;
  isChangeInterestRate?: LoanAnswerEnum;
  borrowerName?: string;
  address?: string;
  city?: string;
  state?: string;
  aptNumber?: string;
  zipCode?: string;
  promissoryNoteDate?: string;
  confirm?: string;
}
