import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { ListPaginationReturn } from '@/types/common';
import { get, post } from '../axios';

interface _getAllLoansListReturn extends ListPaginationReturn {
  totalItems: number;
  totalLoanAmount: number;
}
export const _getAllLoansList = (param: IAllLoansQueryParam) => {
  return post<_getAllLoansListReturn>('/servicing/list/all', param);
};

export const _getInvestorList = () => {
  return get('/servicing/investors');
};
