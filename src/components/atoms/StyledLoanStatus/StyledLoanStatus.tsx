import { FC } from 'react';

import { Box, Typography, TypographyProps } from '@mui/material';

import { PIPELINE_STATUS } from '@/constant';
import {
  allLoansStatusBgcolor,
  allLoansStatusColor,
} from '@/styles/allLoansGridStyles';
import { utils } from '@/utils';

import { PipelineStatusEnum } from '@/types/enum';

interface StyledLoanStatusProps extends TypographyProps {
  status: PipelineStatusEnum | string;
}

export const StyledLoanStatus: FC<StyledLoanStatusProps> = ({
  status,
  ...rest
}) => {
  return (
    <Box>
      <Typography
        bgcolor={allLoansStatusBgcolor[status] || 'rgba(176, 176, 176, 0.20)'}
        borderRadius={1}
        color={allLoansStatusColor[status] || '#4F4F4F'}
        component={'div'}
        py={0.25}
        textAlign={'center'}
        variant={'subtitle3'}
        width={120}
        {...rest}
      >
        {utils.findLabel(PIPELINE_STATUS, status) || status}
      </Typography>
    </Box>
  );
};
