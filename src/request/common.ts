import {
  SetColumnOrderedParam,
  SetColumnPiningParam,
  SetColumnWidthParam,
  SetExpandedParam,
} from '@/types/common';
import { del, post } from './axios';

export const _setColumnWidth = (columnWidth: SetColumnWidthParam) => {
  return post('/servicing/page/exe/his/columnWith', columnWidth);
};

export const _setOrderedColumns = (param: SetColumnOrderedParam) => {
  return post('/servicing/page/exe/his/columnSort', param);
};

export const _setColumnPining = (param: SetColumnPiningParam) => {
  return post('/servicing/page/exe/his/regularColumn', param);
};

export const _setGroupExpanded = (param: SetExpandedParam) => {
  return post('/servicing/page/exe/his/dropDown', param);
};

export const _deleteGridData = (params: { loanId: number | string }) => {
  return del('/servicing/delete', { params });
};
