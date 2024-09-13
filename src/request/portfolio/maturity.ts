///servicing/delinquent

import { IAllLoansGridModel } from '@/models/gridModel/allLoansGridModel';
import { get, post } from '@/request';

export const _getGroupMaturity = (param: IAllLoansGridModel) => {
  return post('/servicing/maturity', param);
};

export const _getMaturityRangeOpt = () => {
  return get('/servicing/maturity/statistics');
};
