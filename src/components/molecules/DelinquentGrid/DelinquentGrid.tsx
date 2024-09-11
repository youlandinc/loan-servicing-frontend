import {
  AllLoansPagination,
  groupCommonColumns,
  GroupLoans,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupDelinquent } from '@/request/portfolio/delinquen';
import { PortfolioGridTypeEnum } from '@/types/enum';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo } from 'react';
import useSWR from 'swr';

export const DelinquentGrid: FC = observer(() => {
  const {
    portfolio: { delinquentGridQueryModel, displayType },
  } = useMst();

  const { data, isLoading, isValidating } = useSWR(
    displayType === PortfolioGridTypeEnum.DELINQUENT
      ? [
          {
            ...delinquentGridQueryModel,
            searchCondition: {
              ...delinquentGridQueryModel.searchCondition,
              investors: [
                ...delinquentGridQueryModel.searchCondition.investors,
              ],
            },
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupDelinquent(p);
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
