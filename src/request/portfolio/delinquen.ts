///servicing/delinquent

import { IAllLoansGridModel } from '@/models/gridModel/allLoansGridModel';
import { post } from '@/request';

export const _getGroupDelinquent = (param: IAllLoansGridModel) => {
  return post('/servicing/delinquent', param);
};
