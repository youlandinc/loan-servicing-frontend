import { IExtensionInfo } from '@/types/loan/extension';
import { get } from '../axios';

export const _getExtensionInfo = (loanId: number) => {
  return get<IExtensionInfo>('/servicing/extension/base', {
    params: { loanId },
  });
};
