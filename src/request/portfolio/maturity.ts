// /servicing/delinquent
import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';

import { post } from '@/request';

export const _getGroupMaturity = (param: IAllLoansQueryParam) => {
  return post('/servicing/maturity', param);
};

export const _getMaturityRangeOpt = (param: {
  searchCondition: { repaymentStatusList: string[] };
}) => {
  return post('/servicing/maturity/statistics', param);
};
