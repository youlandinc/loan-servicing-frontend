import { LoanStatus } from '@/types/enum';

export const GRID_STATUS: Option[] = [
  { label: 'Inactive', key: LoanStatus.inactive, value: LoanStatus.inactive },
  {
    label: 'Performing',
    key: LoanStatus.performing,
    value: LoanStatus.performing,
  },
  { label: 'Paid off', key: LoanStatus.paid_off, value: LoanStatus.paid_off },
];
