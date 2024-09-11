import { PipelineStatusEnum } from '@/types/enum';
import { FC, ReactNode } from 'react';
import { Stack, SxProps, Tooltip, Typography } from '@mui/material';

interface StyledHeaderAddressInfoProps {
  address: ReactNode;
  loanNumber: ReactNode;
  status: PipelineStatusEnum;
  sx?: SxProps;
}

const color: Record<string, any> = {
  [PipelineStatusEnum.PERFORMING]: '#5B76BC',
  [PipelineStatusEnum.DELINQUENCY]: '#E38515',
  [PipelineStatusEnum.FORECLOSURE]: '#A10000',
  [PipelineStatusEnum.PAID_OFF]: '#69C0A5',
};

const bgcolor: Record<string, any> = {
  [PipelineStatusEnum.PERFORMING]: 'rgba(17, 52, 227, 0.10)',
  [PipelineStatusEnum.DELINQUENCY]: 'rgba(225, 132, 65, 0.20)',
  [PipelineStatusEnum.FORECLOSURE]: 'rgba(235, 10, 10, 0.15)',
  [PipelineStatusEnum.PAID_OFF]: 'rgba(105, 192, 165, 0.20)',
};

const statusLabel: Record<string, any> = {
  [PipelineStatusEnum.PERFORMING]: 'Performing',
  [PipelineStatusEnum.DELINQUENCY]: 'Delinquent',
  [PipelineStatusEnum.FORECLOSURE]: 'Foreclosure',
  [PipelineStatusEnum.PAID_OFF]: 'Paid off',
};

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
        <Typography
          bgcolor={bgcolor[status]}
          borderRadius={1}
          color={color[status]}
          component={'div'}
          py={0.25}
          textAlign={'center'}
          variant={'subtitle3'}
          width={120}
        >
          {statusLabel[status]}
        </Typography>
      </Stack>
      <Tooltip title={'Loan number'}>
        <Typography color={'info.main'} component={'div'} width={'fit-content'}>
          {loanNumber}
        </Typography>
      </Tooltip>
    </Stack>
  );
};
