import { del, get, post } from '@/request/axios';
import { RequestBizType } from '@/types/common';
import {
  CommentTypeEnum,
  ResponseOverviewDetails,
} from '@/types/loan/overview';

export const _fetchOverviewDetails = (loanId: string | number) => {
  return get<ResponseOverviewDetails>('/servicing/overview/detail', {
    params: { loanId },
  });
};

export const _fetchOverviewComments = (loanId: string | number) => {
  return post('/servicing/overview/note/page', {
    size: 1000,
    page: 0,
    loanId,
    bizType: RequestBizType.for_servicing,
  });
};

export const _addOverviewComment = (params: {
  messageType: CommentTypeEnum;
  loanId: string | number;
  note: string;
  noticeWay?: string;
  noticeTime?: string;
}) => {
  return post('/servicing/overview/note/add', {
    ...params,
    bizType: RequestBizType.for_servicing,
  });
};

export const _deleteOverviewComment = (noteId: string | number) => {
  return del('/servicing/overview/note/delete', { params: { noteId } });
};

export const _updateOverviewComment = (params: {
  id: string | number;
  note: string;
  noticeWay?: string;
  noticeTime?: string;
}) => {
  return post('/servicing/overview/note/upd', params);
};
