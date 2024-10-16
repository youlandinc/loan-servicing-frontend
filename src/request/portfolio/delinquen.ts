///servicing/delinquent

import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { post } from '@/request';

export const _getGroupDelinquent = (param: IAllLoansQueryParam) => {
  return post('/servicing/delinquent', param);
};

export const _getDelinquentRangeOpt = (param: {
  searchCondition: { repaymentStatusList: string[] };
}) => {
  return post('/servicing/delinquent/statistics', param);
};
