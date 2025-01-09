import { del, get, post } from '@/request/axios';
import {
  PaymentMethod,
  PaymentTypeEnum,
  ResponsePaymentsDetails,
  ResponsePaymentsHistory,
} from '@/types/loan/payments';
import { LoanAnswerEnum } from '@/types/enum';
import { OverviewRepaymentTimeLine } from '@/types/loan/overview';

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

export const _updateOrCreatePaymentData = (
  params: Partial<{
    id: string | number | undefined;
    dataReceivedTime: string;
    dateDue: string;
    paymentMethod: PaymentMethod | undefined;
    defaultInterestReceived: number | undefined;
    lateChargesPaid: number | undefined;
    waivedLateCharges: number | undefined;
    nsf: LoanAnswerEnum | undefined;
    loanId: string;
    fundingDate: string | null | Date;
    recommendedDraw: number | undefined;
    inspectionFee: number | undefined;
    wireFee: number | undefined;
    drawNumber: number | undefined;
    paymentType: PaymentTypeEnum;
    reservePmt: number | undefined;
  }>,
) => {
  return post('/servicing/payment/create', params);
};

export const _deletePaymentData = (params: { id: string | number }) => {
  return del('/servicing/payment/delete', { params });
};

export const _fetchCurrentBill = (params: { loanId: string | number }) => {
  return get<OverviewRepaymentTimeLine[]>('/servicing/bill/findByLoanId', {
    params,
  });
};

export const _fetchNumberOfDraw = (loanId: string | number) => {
  return get('/servicing/payment/draw/number', {
    params: { loanId },
  });
};
