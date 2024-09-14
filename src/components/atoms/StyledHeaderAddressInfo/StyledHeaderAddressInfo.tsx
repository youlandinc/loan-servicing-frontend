import { FC, ReactNode } from 'react';
import { Stack, SxProps, Tooltip, Typography } from '@mui/material';

import { StyledLoanStatus } from '@/components/atoms/StyledLoanStatus';
import { PipelineStatusEnum } from '@/types/enum';

interface StyledHeaderAddressInfoProps {
  address: ReactNode;
  loanNumber: ReactNode;
  status: PipelineStatusEnum;
  sx?: SxProps;
}

export const StyledHeaderAddressInfo: FC<StyledHeaderAddressInfoProps> = ({
  address,
  loanNumber,
  status,
  sx,
}) => {
  return (
    <Stack sx={sx}>
      <Stack alignItems={'center'} direction={'row'} gap={1.5}>
        <Typography component={'div'} variant={'h6'}>
          {address}
        </Typography>
        <StyledLoanStatus status={status} />
      </Stack>
      <Tooltip title={'Loan number'}>
        <Typography color={'info.main'} component={'div'} width={'fit-content'}>
          {loanNumber}
        </Typography>
      </Tooltip>
    </Stack>
  );
};
