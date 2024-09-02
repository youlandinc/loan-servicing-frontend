import { ListPaginationReturn } from '@/types/common';
import { post } from '../axios';

interface _getAllLoansListReturn extends ListPaginationReturn {
  totalItems: number;
  totalLoanAmount: number;
}
export const _getAllLoansList = (param) => {
  return post<_getAllLoansListReturn>('/servicing/list/all', param);
};
