import { PortfolioGridTypeEnum } from '@/types/enum';
import { get, post } from '../axios';

import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { ListPaginationReturn } from '@/types/common';
import { IAllGridConfig } from '@/types/pipeline';

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

export const _getAllGridConfig = () => {
  return get<IAllGridConfig>('/servicing/page/exe/his/');
};

export const setDisplayType = (type: PortfolioGridTypeEnum) => {
  return post(`/servicing/page/exe/his/pageColumn?pageColumn=${type}`);
};

export const _getAllStatus = () => {
  return get<Option[]>('/servicing/repayment/status');
};
