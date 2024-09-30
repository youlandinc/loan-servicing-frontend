import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { utils } from '@/utils';
import { GridAlamedaSummaryProps } from '@/types/pipeline/youland';
import { useBreakpoints } from '@/hooks';

interface GridCashFlowFooterProps {
  footerData: GridAlamedaSummaryProps;
}

export const GridCashFlowFooter: FC<GridCashFlowFooterProps> = ({
  footerData,
}) => {
  const breakpoint = useBreakpoints();

  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      height={48}
      justifyContent={'space-between'}
      px={4}
    >
      <Stack flexDirection={'row'} gap={3}>
        <Typography
          variant={
            ['xl', 'xxl'].includes(breakpoint) ? 'subtitle2' : 'subtitle3'
          }
        >
          Total amount: {utils.formatDollar(footerData.totalLoanAmount)}
        </Typography>
        <Typography
          variant={
            ['xl', 'xxl'].includes(breakpoint) ? 'subtitle2' : 'subtitle3'
          }
        >
          Number of loans: {footerData.totalItems}
        </Typography>
        <Typography
          variant={
            ['xl', 'xxl'].includes(breakpoint) ? 'subtitle2' : 'subtitle3'
          }
        >
          Weighted average note sheet:{' '}
          {utils.formatPercent(footerData.weightedAverageSheet, 2)}
        </Typography>
        <Typography
          variant={
            ['xl', 'xxl'].includes(breakpoint) ? 'subtitle2' : 'subtitle3'
          }
        >
          Weighted average margin:{' '}
          {utils.formatPercent(footerData.weightedAverageMargin, 2)}
        </Typography>
      </Stack>
    </Stack>
  );
};
