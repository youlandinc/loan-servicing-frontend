import { post } from '@/request';

export const _fetchYoulandTableData = (params) => {
  return post('/servicing/list/youland', params);
};

export const _fetchAlamedaTableData = (params) => {
  return post('/servicing/list/alameda', params);
};

export const _fetchCashFlowTableData = (params) => {
  return post('/servicing/list/cash/flow', params);
};

export const _updateTableData = (params) => {
  return post('/servicing/update/youland', params);
};
