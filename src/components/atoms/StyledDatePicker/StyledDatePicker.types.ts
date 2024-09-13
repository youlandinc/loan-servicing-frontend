// import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';

import {
  DatePickerProps,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers';

export interface StyledDatePickerProps extends DatePickerProps<Date> {
  label?: string;
  value: Date | null;
  onChange: (
    value: Date | null,
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
