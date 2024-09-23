import { allLoansModel } from '@/models/gridModel';
import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { Stack } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo, useState } from 'react';
import useSWR from 'swr';

import {
  AllLoansPagination,
  ColumnsHeaderMenus,
  commonColumns,
  defaultColumnPining,
  groupCommonColumns,
  GroupLoans,
  resortColumns,
  transferFirstColumn,
  transferOrderColumnsKeys,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupByInvestor } from '@/request/portfolio/investor';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

export const InvestorGrid: FC = observer(() => {
  const {
    portfolio: { investorGridModel, displayType },
  } = useMst();

  const [headerColumnId, setHeaderColumnId] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  // const [tableHeaderIndex, setTableHeaderIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

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
            sort: [...investorGridModel.queryModel.sort],
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupByInvestor(p);
    },
    // { revalidateOnMount: true },
  );

  const columns = useMemo(
    () =>
      investorGridModel.orderColumns.length
        ? transferFirstColumn(
            resortColumns(investorGridModel.orderColumns, commonColumns),
          )
        : transferFirstColumn(commonColumns),
    [configColumnsOrderKeysArr.join('')],
  );

  const rowsTotal = data?.data?.totalItems ?? 0;
  const totalLoanAmount = data?.data?.totalAmount ?? 0;

  return (
    <>
      <Stack>
        <GroupLoans
          // columnOrder={['mrt-row-expand', ...configColumnsOrderKeysArr]}
          columns={columns}
          data={data?.data?.contents || []}
          handleHeaderClick={(e, column) => {
            setAnchorEl(e.currentTarget);
            // setTableHeaderIndex(column.getIndex());
            setHeaderColumnId(column.id);
            setHeaderTitle(column.columnDef.header);
          }}
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
      <ColumnsHeaderMenus
        anchorEl={anchorEl}
        handleSort={() => {
          investorGridModel.queryModel.updateSort([
            {
              property: headerColumnId, //.id as string,
              direction: SortDirection.DESC,
              ignoreCase: true,
              label: headerTitle as string,
            },
          ] as ISortItemModel[]);
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        type={'group'}
      />
    </>
  );
});
