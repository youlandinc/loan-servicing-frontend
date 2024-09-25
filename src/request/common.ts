import { SetColumnOrderedParam, SetColumnWidthParam } from '@/types/common';
import { post } from './axios';

export const _setColumnWidth = (columnWidth: SetColumnWidthParam) => {
  return post('/servicing/page/exe/his/columnWith', columnWidth);
};

export const _setOrderedColumns = (param: SetColumnOrderedParam) => {
  return post('/servicing/page/exe/his/columnSort', param);
};
