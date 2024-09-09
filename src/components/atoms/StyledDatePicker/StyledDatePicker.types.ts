// import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';

import { PickerChangeHandlerContext } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

export interface StyledDatePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (
    value: Dayjs | null,
    context: PickerChangeHandlerContext<unknown>,
  ) => void;
  onChangeError?: (error: string | undefined) => void;
  validate?: string[];
  disabled?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate?: Date;
  maxDate?: Date;
}
