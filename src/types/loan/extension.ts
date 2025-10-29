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
  extensionFee: number;
  executionDate: string;
  confirmAgreements: ExtensionDocItem[];
  genAgreement: ExtensionDocItem;
  borrowerName: string;
  currentMaturityDate: string;
  promissoryNoteDate: string;
  currentBalance: number;
  extensionNumber: number;
  interestRate: number;
  changeInterestRate: number;
  extendMonth: MaturityDateTypeEnum;
  paymentTiming: ExtensionPaidTypeEnum;
  isChangeInterestRate: LoanAnswerEnum;
  address: string;
  aptNumber: string;
  city: string;
  state: string;
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
