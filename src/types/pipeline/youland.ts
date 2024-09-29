import { PipelineStatusEnum } from '@/types/enum';
import { PageProps } from '@/types/loan/payments';

export enum GridTradeStatusEnum {
  in_progress = 'IN_PROCESS',
  confirmed = 'CONFIRMED',
  not_in_trade = 'NOT_IN_TRADE',
}

export enum GridTradeConfirmEnum {
  completed = 'COMPLETED',
  not_confirmed = 'NOT_CONFIRMED',
}

interface GridItemProps {
  loanId: number | string | null;
  repaymentStatus: PipelineStatusEnum | null;
  submitDate: string | Date | null;
  propertyFullAddress: string | null;
  estSaleDate: string | Date | null;
  investorId: number | string | null;
  investor: string | null;
  prospectiveBuyerId: number | string | null;
  prospectiveBuyer: string | null;
  tradeStatus: GridTradeStatusEnum | null;
  interestRate: number | string | null;
  totalLoanAmount: number | string | null;
  buyRate: number | string | null;
  originatorSpread: number | string | null;
  tradeConfirm: GridTradeConfirmEnum | null;
}

export type GridYoulandItem = GridItemProps;
export type GridAlamedaItem = GridItemProps;
export type GridCashFlowItem = GridItemProps;

export interface GridInvestorItem {
  id: number;
  investorName: string;
}

interface GridSummaryProps {
  totalItems: number | undefined;
  totalLoanAmount: number | undefined;
  weightedAverageSheet: number | undefined;
  weightedAverageMargin: number | undefined;
}

export type GridYoulandSummaryProps = GridSummaryProps;
export type GridAlamedaSummaryProps = GridSummaryProps;
export type GridCashFlowSummaryProps = GridSummaryProps;

interface _ResponseGridYoulandTable {
  content: GridYoulandItem[];
  page: PageProps;
}

interface _ResponseGridAlamedaTable {
  content: GridAlamedaItem[];
  page: PageProps;
}

interface _ResponseGridCashFlowTable {
  content: {
    currentTotalAmount: number | null;
    currentTotalItems: number | null;
    groupById: string;
    groupByName: string | null;
    servicingLoans: GridCashFlowItem[];
  }[];
  page: PageProps;
}

export type ResponseGridYoulandTable = _ResponseGridYoulandTable &
  GridYoulandSummaryProps;

export type ResponseGridAlamedaTable = _ResponseGridAlamedaTable &
  GridAlamedaSummaryProps;

export type ResponseGridCashFlowTable = _ResponseGridCashFlowTable &
  GridCashFlowSummaryProps;
