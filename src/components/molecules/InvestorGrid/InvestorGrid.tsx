import {
  AllLoansPagination,
  groupCommonColumns,
  GroupLoans,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupByInvestor } from '@/request/portfolio/investor';
import { PortfolioGridTypeEnum } from '@/types/enum';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo } from 'react';
import useSWR from 'swr';

export const InvestorGrid: FC = observer(() => {
  const {
    portfolio: { investorGridQueryModel, displayType },
  } = useMst();

  const { data, isLoading } = useSWR(
    displayType === PortfolioGridTypeEnum.BY_INVESTOR
      ? [
          {
            ...investorGridQueryModel,
            searchCondition: {
              ...investorGridQueryModel.searchCondition,
              investors: [...investorGridQueryModel.searchCondition.investors],
            },
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupByInvestor(p);
    },
    // { revalidateOnMount: true },
  );

  const columns = useMemo(() => groupCommonColumns, []);

  const rowsTotal = data?.data?.totalItems ?? 0;
  const totalLoanAmount = data?.data?.totalAmount ?? 0;

  return (
    <Stack border={'1px solid'} borderColor={'border.normal'} borderRadius={4}>
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
