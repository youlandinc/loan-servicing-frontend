import { FC } from 'react';

import { Stack } from '@mui/material';

import { StyledHeaderAddressInfo } from '@/components/atoms';
import {
  LoanDrawsGrid,
  ServicingSide,
  StyledLayout,
} from '@/components/molecules';

import { PipelineStatusEnum } from '@/types/enum';

export const LoanDraws: FC = () => {
  return (
    <StyledLayout sideMenu={<ServicingSide />}>
      <Stack gap={3} p={6}>
        <StyledHeaderAddressInfo
          address={'236 Kingfisher Avenue, Alameda, CA, 94501'}
          loanNumber={'20240807-236C'}
          status={PipelineStatusEnum.PERFORMING}
        />
        <LoanDrawsGrid />
      </Stack>
    </StyledLayout>
  );
};
