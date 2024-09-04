import { get } from '@/request/axios';

export const _fetchOverviewDetails = (loanId: string | number) => {
  return get('/servicing/overview/detail', { params: { loanId } });
};
