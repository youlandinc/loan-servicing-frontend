import { get, post } from '@/request/axios';
import {
  ResponsePaymentsDetails,
  ResponsePaymentsHistory,
} from '@/types/payments';

export const _fetchPaymentsDetails = (loanId: string | number) => {
  return get<ResponsePaymentsDetails>('/servicing/payment/detail', {
    params: { loanId },
  });
};

export const _fetchPaymentsHistory = (params: {
  loanId: string | number;
  page: number;
  size: number;
}) => {
  return post<ResponsePaymentsHistory>('/servicing/payment/history', params);
};
