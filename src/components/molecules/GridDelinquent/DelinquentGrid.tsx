import React, { FC, useMemo } from 'react';

import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';

import useSWR from 'swr';

import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { useMst } from '@/models/Root';

import {
  AllLoansPagination,
  delinquentColumns,
  GroupLoans,
  resortColumns,
  transferFirstColumn,
  transferOrderColumnsKeys,
} from '@/components/molecules';

import { _getGroupDelinquent } from '@/request/portfolio/delinquen';
import {
  DelinquentTimeRangeEnum,
  PortfolioGridTypeEnum,
  SortDirection,
} from '@/types/enum';

const DEFAULT_SORT = [
  {
    property: 'daysDelinquent',
    direction: SortDirection.ASC,
    ignoreCase: true,
    label: 'Days delinquent',
  },
  {
    property: 'repaymentStatus',
    direction: SortDirection.DESC,
    ignoreCase: true,
    label: 'Status',
  },
];

export const DelinquentGrid: FC = observer(() => {
  const {
    portfolio: { delinquentGridModel, displayType },
  } = useMst();

  const configColumnsOrderKeysArr = delinquentGridModel.orderColumns?.length
    ? transferOrderColumnsKeys(delinquentGridModel.orderColumns)
    : [];

  const expandedData =
    delinquentGridModel.expandedColumns?.reduce(
      (pre, cur) => {
        pre[cur.dropDownId] = true;
        return pre;
      },
      {} as Record<string, boolean>,
    ) || {};

  const { data, isLoading } = useSWR(
    displayType === PortfolioGridTypeEnum.DELINQUENT
      ? [
          {
            ...delinquentGridModel.queryModel,
            searchCondition: {
              ...delinquentGridModel.queryModel.searchCondition,
              investors: [
                ...delinquentGridModel.queryModel.searchCondition.investors,
              ],
              delinquentDays:
                delinquentGridModel.queryModel.searchCondition
                  .delinquentDays === DelinquentTimeRangeEnum.ALL
                  ? undefined
                  : delinquentGridModel.queryModel.searchCondition
                      .delinquentDays,
              repaymentStatusList: [
                ...delinquentGridModel.queryModel.searchCondition
                  .repaymentStatusList,
              ],
            },
            sort: delinquentGridModel.queryModel.sort.length
              ? [...delinquentGridModel.queryModel.sort]
              : DEFAULT_SORT,
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupDelinquent(p);
    },
  );

  // const columns = useMemo(() => delinquentColumns, []);

  const columns = useMemo(
    () =>
      delinquentGridModel.orderColumns.length
        ? transferFirstColumn(
            resortColumns(delinquentGridModel.orderColumns, delinquentColumns),
          )
        : transferFirstColumn(delinquentColumns),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configColumnsOrderKeysArr.join('')],
  );

  const rowsTotal = data?.data?.totalItems ?? 0;
  const totalLoanAmount = data?.data?.totalAmount ?? 0;

  return (
    <Stack>
      <GroupLoans
        columns={columns}
        data={data?.data?.contents || []}
        expandedData={expandedData}
        gridType={PortfolioGridTypeEnum.DELINQUENT}
        handleSort={(param) => {
          delinquentGridModel.queryModel.updateSort([
            {
              property: param.property, // .id as string,
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
  );
});
