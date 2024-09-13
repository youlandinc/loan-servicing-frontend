import { SelectProps, SxProps } from '@mui/material';
import * as React from 'react';

export interface StyledSelectProps extends SelectProps {
  validate?: undefined | string[];
  options: Option[];
  sxHelperText?: SxProps;
  sxList?: SxProps;
  onClose?: (event: React.SyntheticEvent) => void;
  open?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
}
