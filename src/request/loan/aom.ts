import { get, post } from '@/request';
import { CreateAomPdfParam, IAomInfo } from '@/types/loan/aom';

export const _getAOMInfo = (loanId: number) => {
  return get<IAomInfo>('/servicing/mortgage/detail', {
    params: { loanId },
  });
};

export const _creatAomPdf = (param: CreateAomPdfParam) => {
  return post('/servicing/mortgage/create', param);
};

export const _getAomInvestorList = () => {
  return get<{ id: number; investorName: string }[]>('/servicing/investor');
};
