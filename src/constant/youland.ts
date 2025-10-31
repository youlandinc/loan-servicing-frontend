import { PipelineStatusEnum } from '@/types/enum';
import { PaymentMethod } from '@/types/loan/payments';
import { GridTradeStatusEnum } from '@/types/pipeline/youland';

export const TRADE_STATUS_OPTIONS: Option[] = [
  {
    label: 'Not in trade',
    value: GridTradeStatusEnum.not_in_trade,
    key: GridTradeStatusEnum.not_in_trade,
  },
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
];

export const REPAYMENT_STATUS_OPTIONS: Option[] = [
  {
    label: 'Performing',
    key: PipelineStatusEnum.PERFORMING,
    value: PipelineStatusEnum.PERFORMING,
  },
  {
    label: 'Delinquent',
    key: PipelineStatusEnum.DELINQUENCY,
    value: PipelineStatusEnum.DELINQUENCY,
  },

  {
    label: 'Foreclosure',
    key: PipelineStatusEnum.FORECLOSURE,
    value: PipelineStatusEnum.FORECLOSURE,
  },
  {
    label: 'Paid off',
    key: PipelineStatusEnum.PAID_OFF,
    value: PipelineStatusEnum.PAID_OFF,
  },
  {
    label: 'REO',
    key: PipelineStatusEnum.REO,
    value: PipelineStatusEnum.REO,
  },
];

export const TRADE_STATUS_BGCOLOR_PALETTE = {
  [GridTradeStatusEnum.not_in_trade]: '#D2D6E1',
  [GridTradeStatusEnum.in_progress]: '#96A8D7',
  [GridTradeStatusEnum.confirmed]: '#85CCB6',
};

export const PAYMENT_METHODS_OPTIONS = [
  {
    label: 'ACH',
    key: PaymentMethod.ach,
    value: PaymentMethod.ach,
  },
  {
    label: 'Check',
    key: PaymentMethod.check,
    value: PaymentMethod.check,
  },
  {
    label: 'Wire transfer',
    key: PaymentMethod.wire_transfer,
    value: PaymentMethod.wire_transfer,
  },
];
