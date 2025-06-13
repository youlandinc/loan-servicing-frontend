import {
  AllLoansPagination,
  commonColumns,
  GroupLoans,
  resortColumns,
  transferFirstColumn,
  transferOrderColumnsKeys,
} from '@/components/molecules';
import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { useMst } from '@/models/Root';
import { _getGroupByInvestor } from '@/request/portfolio/investor';
import { ellipsisStyle } from '@/styles';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';
import { utils } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo } from 'react';
import useSWR from 'swr';

const DEFAULT_SORT = [
  {
    property: 'repaymentStatus',
    direction: SortDirection.DESC,
    ignoreCase: true,
    label: 'Status',
  },
  {
    property: 'maturityDate',
    direction: SortDirection.ASC,
    ignoreCase: true,
    label: 'Maturity date',
  },
];

export const InvestorGrid: FC = observer(() => {
  const {
    portfolio: { investorGridModel, displayType },
  } = useMst();

  const configColumnsOrderKeysArr = investorGridModel.orderColumns?.length
    ? transferOrderColumnsKeys(investorGridModel.orderColumns)
    : [];

  const expandedData =
    investorGridModel.expandedColumns?.reduce(
      (pre, cur) => {
        pre[cur.dropDownId] = true;
        return pre;
      },
      {} as Record<string, boolean>,
    ) || {};

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
              repaymentStatusList: [
                ...investorGridModel.queryModel.searchCondition
                  .repaymentStatusList,
              ],
            },
            sort: investorGridModel.queryModel.sort.length
              ? [...investorGridModel.queryModel.sort]
              : DEFAULT_SORT,
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupByInvestor(p);
    },
    // { revalidateOnMount: true },
  );

  const columns = useMemo(() => {
    const allLoansColumns = commonColumns.concat({
      accessorKey: 'investorRate',
      header: 'Investor rate',
      size: 140,
      minSize: 110,
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
      Cell: ({ renderedCellValue }) => {
        return (
          <Typography
            fontSize={12}
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
          >
            {renderedCellValue === 0
              ? '0%'
              : utils.formatPercent(renderedCellValue as number)}
          </Typography>
        );
      },
    });
    return investorGridModel.orderColumns.length
      ? transferFirstColumn(
          resortColumns(investorGridModel.orderColumns, allLoansColumns),
        )
      : transferFirstColumn(allLoansColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configColumnsOrderKeysArr.join('')]);

  const rowsTotal = data?.data?.totalItems ?? 0;
  const totalLoanAmount = data?.data?.totalAmount ?? 0;

  return (
    <>
      <Stack>
        <GroupLoans
          columns={columns}
          data={data?.data?.contents || []}
          expandedData={expandedData}
          gridType={PortfolioGridTypeEnum.BY_INVESTOR}
          handleSort={(param) => {
            investorGridModel.queryModel.updateSort([
              {
                property: param.property, //.id as string,
                direction: SortDirection.DESC,
                ignoreCase: true,
                label: param.label,
              },
            ] as ISortItemModel[]);
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
          updateTime={data?.data?.dataUpdateTime}
        />
      </Stack>
      {/*<ColumnsHeaderMenus*/}
      {/*  anchorEl={anchorEl}*/}
      {/*  handleSort={() => {*/}
      {/*    investorGridModel.queryModel.updateSort([*/}
      {/*      {*/}
      {/*        property: headerColumnId, //.id as string,*/}
      {/*        label: headerTitle as string,*/}
      {/*        direction: SortDirection.DESC,*/}
      {/*        ignoreCase: true,*/}
      {/*      },*/}
      {/*    ] as ISortItemModel[]);*/}
      {/*  }}*/}
      {/*  onClose={() => setAnchorEl(null)}*/}
      {/*  open={Boolean(anchorEl)}*/}
      {/*  type={'group'}*/}
      {/*/>*/}
    </>
  );
});
