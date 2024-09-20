import { GridTradeStatusEnum } from '@/types/pipeline/youland';
import { PipelineStatusEnum } from '@/types/enum';

export const TRADE_STATUS_OPTIONS: Option[] = [
  {
    label: 'In progress',
    value: GridTradeStatusEnum.in_progress,
    key: GridTradeStatusEnum.in_progress,
  },
  {
    label: 'Confirmed',
    value: GridTradeStatusEnum.confirmed,
    key: GridTradeStatusEnum.confirmed,
  },
  {
    label: 'Not in trade',
    value: GridTradeStatusEnum.not_in_trade,
    key: GridTradeStatusEnum.not_in_trade,
  },
];

export const REPAYMENT_STATUS_OPTIONS: Option[] = [
  {
    label: 'Performing',
    key: PipelineStatusEnum.PERFORMING,
    value: PipelineStatusEnum.PERFORMING,
  },
  {
    label: 'Delinquency',
    key: PipelineStatusEnum.DELINQUENCY,
    value: PipelineStatusEnum.DELINQUENCY,
  },

  {
    label: 'Foreclosure',
    key: PipelineStatusEnum.FORECLOSURE,
    value: PipelineStatusEnum.FORECLOSURE,
  },
  {
    label: 'Paid Off',
    key: PipelineStatusEnum.PAID_OFF,
    value: PipelineStatusEnum.PAID_OFF,
  },
];

export const TRADE_STATUS_BGCOLOR_PALETTE = {
  [GridTradeStatusEnum.not_in_trade]: '#D2D6E1',
  [GridTradeStatusEnum.in_progress]: '#96A8D7',
  [GridTradeStatusEnum.confirmed]: '#85CCB6',
};
