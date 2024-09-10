import { FC } from 'react';
import { CircularProgress } from '@mui/material';

import { StyledLoadingProps, StyledLoadingStyles } from './index';

export const StyledLoading: FC<StyledLoadingProps> = ({ sx, size }) => {
  return (
    <>
      <CircularProgress size={size} sx={{ ...StyledLoadingStyles, ...sx }} />
    </>
  );
};
