///servicing/delinquent

import { IAllLoansGridModel } from '@/models/gridModel/allLoansGridModel';
import { get, post } from '@/request';

export const _getGroupDelinquent = (param: IAllLoansGridModel) => {
  return post('/servicing/delinquent', param);
};

export const _getDelinquentRangeOpt = () => {
  return get('/servicing/delinquent/statistics');
};
