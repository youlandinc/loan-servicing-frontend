import { SetColumnWidthParam } from '@/types/common';
import { post } from './axios';

export const _setColumnWidth = (columnWidth: SetColumnWidthParam) => {
  return post('/servicing/page/exe/his/columnWith', columnWidth);
};
