import { get } from '@/request/axios';
import { ResponsePaymentsDetails } from '@/types/payments';

export const _fetchPaymentsDetails = (loanId: string | number) => {
  return get<ResponsePaymentsDetails>('/servicing/payment/detail', {
    params: { loanId },
  });
};

export const _fetchPaymentsHistory = (loanId: string | number) => {
  return get('/servicing/payment/history', {
    params: { loanId },
  });
};
