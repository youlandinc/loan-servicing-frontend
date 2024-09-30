///servicing/delinquent

import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { get, post } from '@/request';

export const _getGroupDelinquent = (param: IAllLoansQueryParam) => {
  return post('/servicing/delinquent', param);
};

export const _getDelinquentRangeOpt = () => {
  return get('/servicing/delinquent/statistics');
};
