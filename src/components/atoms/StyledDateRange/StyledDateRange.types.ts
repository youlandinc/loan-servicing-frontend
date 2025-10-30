import { ReactDatePickerProps } from 'react-datepicker';

import { SxProps } from '@mui/material';

export interface StyledDateRangeProps
  extends Omit<ReactDatePickerProps, 'onChange'> {
  dateRange?: [Date | null, Date | null];
  date?: Date | null;
  label?: string;
  onChange: (
    date: [Date | null, Date | null],
    event?: React.SyntheticEvent<any> | undefined,
  ) => void;
  sx?: SxProps;
}
