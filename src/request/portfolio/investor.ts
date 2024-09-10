///servicing/groupBy/investor

import { IAllLoansGridModel } from '@/models/gridModel/allLoansGridModel';
import { post } from '../axios';

export const _getGroupByInvestor = (param: IAllLoansGridModel) => {
  return post('/servicing/groupBy/investor', param);
};
