import { PipelineStatusEnum } from '@/types/enum';

export enum LoanProductCategoryEnum {
  default = '',
  stabilized_bridge = 'STABILIZED_BRIDGE',
  fix_and_flip = 'FIX_AND_FLIP',
  ground_up_construction = 'GROUND_UP_CONSTRUCTION',
}

export enum LoanPurposeEnum {
  default = '',
  purchase = 'PURCHASE',
  refinance = 'REFINANCE',
}

export enum LoanTimelineStatusEnum {
  delinquent = 'DELINQUENT',
  future = 'FUTURE',
  paid = 'PAID',
  paid_late = 'PAID_LATE',
}

export enum CommentTypeEnum {
  text = 'TEXT',
  notice = 'NOTICE',
}

export interface CommentItemData {
  avatar: string;
  firstName: string;
  lastName: string;
  backgroundColor: string;
  loanId: number | string;
  id: number;
  messageType: CommentTypeEnum;
  createdAt: Date | string | null;
  note: string;
}

export interface OverviewBalanceInformation {
  maturityDate: string;
  currentBalance: number;
  paidToDate: string;
  nextDueDate: string;
  interestRate: number;
  estClosingDate: string;
  monthlyPayment: number;
  loanTerm: number;
  totalLoanAmount: number;
}

export interface OverviewLoanInfo {
  productCategory: LoanProductCategoryEnum;
  loanPurpose: LoanPurposeEnum;
  cashOutAmount: number;
  rehabAmount: number;
  loanValue: number;
  loanCost: number;
  investor: string;
}

export interface OverviewBorrowerInfo {
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
}

export interface OverviewOutstandingPayAble {
  loanId: number | string;
  interestDue: number | null;
  lateChargesDue: number | null;
  paymentAmount: number | null;
  principalDue: number | null;
  description: string | null;
  billStatus: LoanTimelineStatusEnum;
  monthAndYearOfDueDate: string | null;
  paymentModeOn: string | null;
  dueDate: string | null;
  dateReceived: null | string;
}

export type OverviewRepaymentTimeLine = OverviewOutstandingPayAble;

export interface OverviewPaymentHistory {
  loanId: number;
  dataReceivedTime: string;
  dataDue: string;
  pmtDayVariance: number | null;
  isAch: boolean;
  paymentType: string | null;
  totalPmt: number | null;
  lateChargesPaid: number | null;
  totalInterestReceived: number | null;
  defaultInterestReceived: number | null;
  interestRateReceived: number | null;
  principalReceived: number | null;
  accruedLateCharges: number | null;
  waivedLateCharges: number | null;
  reservePmt: number | null;
  reserveRestricted: string | null;
  additionalInformation: string | null;
  reference: string | null;
}

export interface ResponseOverviewDetails {
  loanId: number | string;
  systemLoanNumber: string;
  propertyFullAddress: string;
  repaymentStatus: PipelineStatusEnum;
  balanceInformation: OverviewBalanceInformation;
  loanInfo: OverviewLoanInfo;
  borrowerInfo: OverviewBorrowerInfo;
  outstandingPayAbles: OverviewOutstandingPayAble[];
  paymentHistory: {
    totalItem: number | null;
    accumulateTotalPmt: number | null;
    accumulateTotalInterestReceived: number | null;
    accumulateDefaultInterestReceived: number | null;
    accumulateInterestRateReceived: number | null;
    accumulatePrincipalReceived: number | null;
    accumulateAccruedLateCharges: number | null;
    accumulateWaivedLateCharges: number | null;
    accumulateReservePmt: number | null;
    accumulateReserveRestricted: number | null;
    histories: OverviewPaymentHistory[];
  };
  repaymentTimeLine: OverviewRepaymentTimeLine[];
  brokerDetail: null | any;
}
