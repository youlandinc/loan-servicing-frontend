import { PipelineStatusEnum } from '@/types/enum';

export enum GridTradeStatusEnum {
  in_progress = 'IN_PROCESS',
  confirmed = 'CONFIRMED',
  not_in_trade = 'NOT_IN_TRADE',
}

export enum GridTradeConfirmEnum {
  confirmed = 'CONFIRMED',
  not_confirmed = 'NOT_CONFIRMED',
}

interface GridItemProps {
  loanId: number | string | null;
  repaymentStatus: PipelineStatusEnum | null;
  submitDate: string | Date | null;
  propertyAddress: string | null;
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

export interface GridInvestorItem {
  id: number;
  investorName: string;
}
