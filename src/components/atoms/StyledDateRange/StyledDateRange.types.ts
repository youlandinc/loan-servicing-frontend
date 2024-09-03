import { SxProps } from '@mui/material';
import { ReactDatePickerProps } from 'react-datepicker';

export interface StyledDateRangeProps
  extends Omit<ReactDatePickerProps, 'onChange'> {
  dateRange: [Date | null, Date | null];
  label?: string;
  onChange: (
    date: [Date | null, Date | null],
    event: React.SyntheticEvent<any> | undefined,
  ) => void;
  sx?: SxProps;
}
