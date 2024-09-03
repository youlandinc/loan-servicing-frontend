import { IAllLoansGridModel } from '@/models/gridModel/allLoansGridModel';
import { ListPaginationReturn } from '@/types/common';
import { get, post } from '../axios';

interface _getAllLoansListReturn extends ListPaginationReturn {
  totalItems: number;
  totalLoanAmount: number;
}
export const _getAllLoansList = (param: IAllLoansGridModel) => {
  return post<_getAllLoansListReturn>('/servicing/list/all', param);
};

export const _getInvestorList = () => {
  return get('/servicing/investors');
};
