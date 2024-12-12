import { LoanFicoScoreEnum, PipelineStatusEnum } from '@/types/enum';

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
  normal = 'NORMAL',
  dq_30 = 'OVERDUE_THIRTY',
  dq_60 = 'OVERDUE_SIXTY',
  dq_60_plus = 'OVERDUE_SIXTY_ADD',
  future = 'FUTURE',
}

export enum PaidStatusEnum {
  paid = 'PAID',
  unpaid = 'UNPAID',
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
  nextPaymentDate: string;
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
  ficoScore: LoanFicoScoreEnum;
  fciLoanNumber: null | string;
}

export interface OverviewBorrowerInfo {
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhones: string;
}

export interface OverviewOutstandingPayAble {
  loanId: number | string;
  interestDue: number | null;
  lateChargesDue: number | null;
  paymentAmount: number | null;
  principalDue: number | null;
  description: string | null;
  repaymentStatus: LoanTimelineStatusEnum;
  paidStatus: PaidStatusEnum;
  monthAndYearOfDateDue: string | null;
  paymentModeOn: string | null;
  dateDue: string;
  dateReceived: null | string;
  formatterDateDue: string;
}

export type OverviewRepaymentTimeLine = OverviewOutstandingPayAble;

export interface OverviewPaymentHistory {
  loanId: number;
  dataReceivedTime: string;
  dateDue: string;
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
