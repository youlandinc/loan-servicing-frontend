import { FC } from 'react';
import { Typography, TypographyProps } from '@mui/material';

import {
  allLoansStatusBgcolor,
  allLoansStatusColor,
} from '@/styles/allLoansGridStyles';
import { PipelineStatusEnum } from '@/types/enum';
import { PIPELINE_STATUS } from '@/constant';
interface StyledLoanStatusProps extends TypographyProps {
  status: PipelineStatusEnum;
}

export const StyledLoanStatus: FC<StyledLoanStatusProps> = ({
  status,
  ...rest
}) => {
  return (
    <Typography
      bgcolor={allLoansStatusBgcolor[status]}
      borderRadius={1}
      color={allLoansStatusColor[status]}
      component={'div'}
      textAlign={'center'}
      variant={'subtitle3'}
      width={120}
      {...rest}
    >
      {PIPELINE_STATUS.find((item) => item.value === status)?.label}
    </Typography>
  );
};
