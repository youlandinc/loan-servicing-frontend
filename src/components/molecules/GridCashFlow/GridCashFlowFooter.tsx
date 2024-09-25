import { FC } from 'react';
import { Pagination, Stack, TablePagination, Typography } from '@mui/material';

import { utils } from '@/utils';
import { GridAlamedaSummaryProps } from '@/types/pipeline/youland';

interface GridCashFlowFooterProps {
  footerData: GridAlamedaSummaryProps;
}

export const GridCashFlowFooter: FC<GridCashFlowFooterProps> = ({
  footerData,
}) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      height={48}
      justifyContent={'space-between'}
      px={4}
    >
      <Stack flexDirection={'row'} gap={3}>
        <Typography variant={'subtitle2'}>
          Total amount: {utils.formatDollar(footerData.totalLoanAmount)}
        </Typography>
        <Typography variant={'subtitle2'}>
          Number of loans: {footerData.totalItems}
        </Typography>
        <Typography variant={'subtitle2'}>
          Weighted average note sheet:{' '}
          {utils.formatPercent(footerData.weightedAverageSheet, 2)}
        </Typography>
        <Typography variant={'subtitle2'}>
          Weighted average margin:{' '}
          {utils.formatPercent(footerData.weightedAverageMargin, 2)}
        </Typography>
      </Stack>
    </Stack>
  );
};
