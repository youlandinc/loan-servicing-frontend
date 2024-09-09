import { IExtensionInfo, IGetExtensionPdfParam } from '@/types/loan/extension';
import { get, post } from '../axios';

export const _getExtensionInfo = (loanId: number) => {
  return get<IExtensionInfo>('/servicing/extension/base', {
    params: { loanId },
  });
};

export const _createExtensionPdf = (param: IGetExtensionPdfParam) => {
  return post<number>('/servicing/extension/create', param);
};
