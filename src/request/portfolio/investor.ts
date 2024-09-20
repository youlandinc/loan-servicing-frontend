import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { post } from '../axios';

export const _getGroupByInvestor = (param: IAllLoansQueryParam) => {
  return post('/servicing/groupBy/investor', param);
};
