import { get } from './axios';

export const _getLoanDetails = (loanId: number) => {
  return get('/servicing/detail', {
    params: {
      loanId,
    },
  });
};
