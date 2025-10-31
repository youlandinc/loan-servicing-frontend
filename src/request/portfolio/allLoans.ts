import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';

import { ListPaginationReturn } from '@/types/common';
import { PortfolioGridTypeEnum } from '@/types/enum';
import { IAllGridConfig } from '@/types/pipeline';

import { get, post } from '../axios';

interface _getAllLoansListReturn extends ListPaginationReturn {
  totalItems: number;
  totalLoanAmount: number;
  dataUpdateTime: string;
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

export const _exportLoans = (loanIds: number[]) => {
  return post(
    '/servicing/list/all/export',
    { loanIds },
    {
      responseType: 'blob',
    },
  );
};
