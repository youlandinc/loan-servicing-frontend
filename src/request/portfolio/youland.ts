import { get, post } from '@/request';
import { GridInvestorItem } from '@/types/pipeline/youland';

export const _fetchYoulandTableData = (params: any) => {
  return post('/servicing/list/youland', params);
};

export const _fetchAlamedaTableData = (params: any) => {
  return post('/servicing/list/alameda', params);
};

export const _fetchCashFlowTableData = (params: any) => {
  return post('/servicing/list/cash/flow', params);
};

export const _updateTableData = (params: any) => {
  return post('/servicing/list/custom', params);
};

export const _fetchInvestorData = () => {
  return get<GridInvestorItem[]>('/servicing/investor');
};
