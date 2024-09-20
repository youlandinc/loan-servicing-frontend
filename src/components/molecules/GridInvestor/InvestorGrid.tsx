import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo, useState } from 'react';
import useSWR from 'swr';

import {
  AllLoansPagination,
  defaultColumnPining,
  groupCommonColumns,
  GroupLoans,
  transferOrderColumnsKeys,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupByInvestor } from '@/request/portfolio/investor';
import { PortfolioGridTypeEnum } from '@/types/enum';

export const InvestorGrid: FC = observer(() => {
  const {
    portfolio: { investorGridModel, displayType },
  } = useMst();

  const [headerColumnId, setHeaderColumnId] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [tableHeaderIndex, setTableHeaderIndex] = useState(0);

  // const [headerColumn, setHeaderColumn] = useState({} as MRT_Column<any>);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const [columnPiningState, setColumnPiningState] = useState(
    defaultColumnPining(investorGridModel.orderColumns),
  );

  const configColumnsOrderKeysArr = investorGridModel.orderColumns?.length
    ? transferOrderColumnsKeys(investorGridModel.orderColumns)
    : [];

  const { data, isLoading } = useSWR(
    displayType === PortfolioGridTypeEnum.BY_INVESTOR
      ? [
          {
            ...investorGridModel.queryModel,
            searchCondition: {
              ...investorGridModel.queryModel.searchCondition,
              investors: [
                ...investorGridModel.queryModel.searchCondition.investors,
              ],
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
    <Stack>
      <GroupLoans
        columnOrder={[]}
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
