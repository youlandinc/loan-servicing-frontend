import { get } from '@/request/axios';

export const _fetchInsightsData = () => {
  return get<InsightsResponseItemData[]>('/servicing/insights');
};

export enum InsightsEnum {
  current = 'CURRENT',
  dq_1_30 = 'ONE_THIRTY',
  dq_31_60 = 'THIRTY_ONE_SIXTY',
  dq_61_90 = 'SIXTY_ONE_NINETY',
  dq_91_120 = 'NINETY_ONE_ONE_HUNDRED_TWENTY',
  dq_121_plus = 'ONE_HUNDRED_TWENTY_ADD',
}

export interface InsightsResponseItemData {
  insightsStatus: InsightsEnum;
  numberOfDays: number;
  totalPercentage: number;
  upb: number;
  upbPercentage: number;
}
