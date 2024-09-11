///servicing/delinquent

import { IAllLoansGridModel } from '@/models/gridModel/allLoansGridModel';
import { post } from '@/request';

export const _getGroupMaturity = (param: IAllLoansGridModel) => {
  return post('/servicing/maturity', param);
};
