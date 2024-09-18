import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo } from 'react';
import useSWR from 'swr';

import {
  AllLoansPagination,
  delinquentColumns,
  GroupLoans,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupDelinquent } from '@/request/portfolio/delinquen';
import { DelinquentTimeRangeEnum, PortfolioGridTypeEnum } from '@/types/enum';

export const DelinquentGrid: FC = observer(() => {
  const {
    portfolio: { delinquentGridQueryModel, displayType },
  } = useMst();

  const { data, isLoading } = useSWR(
    displayType === PortfolioGridTypeEnum.DELINQUENT
      ? [
          {
            ...delinquentGridQueryModel,
            searchCondition: {
              ...delinquentGridQueryModel.searchCondition,
              investors: [
                ...delinquentGridQueryModel.searchCondition.investors,
              ],
              delinquentDays:
                delinquentGridQueryModel.searchCondition.delinquentDays ===
                DelinquentTimeRangeEnum.ALL
                  ? undefined
                  : delinquentGridQueryModel.searchCondition.delinquentDays,
            },
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupDelinquent(p);
    },
  );

  const columns = useMemo(() => delinquentColumns, []);

  const rowsTotal = data?.data?.totalItems ?? 0;
  const totalLoanAmount = data?.data?.totalAmount ?? 0;

  return (
    <Stack>
      <GroupLoans
        columns={columns}
        data={data?.data?.contents || []}
        loading={isLoading}
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
