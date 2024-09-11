import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo } from 'react';
import useSWR from 'swr';

import {
  AllLoansPagination,
  groupCommonColumns,
  GroupLoans,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupMaturity } from '@/request/portfolio/maturity';
import { PortfolioGridTypeEnum } from '@/types/enum';

export const MaturityGrid: FC = observer(() => {
  const {
    portfolio: { maturityGridQueryModel, displayType },
  } = useMst();

  const { data, isLoading, isValidating } = useSWR(
    displayType === PortfolioGridTypeEnum.MATURITY
      ? [
          {
            ...maturityGridQueryModel,
            searchCondition: {
              ...maturityGridQueryModel.searchCondition,
              investors: [...maturityGridQueryModel.searchCondition.investors],
            },
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupMaturity(p);
    },
  );

  const columns = useMemo(() => groupCommonColumns, []);

  const rowsTotal = data?.data?.totalItems ?? 0;
  const totalLoanAmount = data?.data?.totalAmount ?? 0;

  return (
    <Stack border={'1px solid'} borderColor={'border.normal'} borderRadius={4}>
      <GroupLoans
        columns={columns}
        data={data?.data?.contents || []}
        loading={isValidating}
      />
      <AllLoansPagination
        currentPage={0}
        rowCount={rowsTotal}
        rowsPerPage={0}
        showPage={false}
        sx={{ borderTop: '1px solid #EDF1FF' }}
        totalLoanAmount={totalLoanAmount}
      />
    </Stack>
  );
});
