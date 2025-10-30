import { ReactNode } from 'react';

import { CheckboxProps, SxProps } from '@mui/material';

export interface StyledCheckboxProps extends CheckboxProps {
  icon?: ReactNode;
  checkedIcon?: ReactNode;
  checkboxSx?: SxProps;
  checked?: boolean;
  label?: ReactNode;
  indeterminateIcon?: ReactNode;
  sxCheckbox?: SxProps;
}
