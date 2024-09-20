///servicing/delinquent

import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { get, post } from '@/request';

export const _getGroupMaturity = (param: IAllLoansQueryParam) => {
  return post('/servicing/maturity', param);
};

export const _getMaturityRangeOpt = () => {
  return get('/servicing/maturity/statistics');
};
