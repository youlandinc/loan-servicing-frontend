import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useMemo } from 'react';
import useSWR from 'swr';

import {
  AllLoansPagination,
  delinquentColumns,
  GroupLoans,
  maturityColumns,
  resortColumns,
  transferFirstColumn,
  transferOrderColumnsKeys,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupMaturity } from '@/request/portfolio/maturity';
import { MaturityTimeRangeEnum, PortfolioGridTypeEnum } from '@/types/enum';

export const MaturityGrid: FC = observer(() => {
  const {
    portfolio: { maturityGridModel, displayType },
  } = useMst();

  const configColumnsOrderKeysArr = maturityGridModel.orderColumns?.length
    ? transferOrderColumnsKeys(maturityGridModel.orderColumns)
    : [];

  const { data, isLoading } = useSWR(
    displayType === PortfolioGridTypeEnum.MATURITY
      ? [
          {
            ...maturityGridModel.queryModel,
            searchCondition: {
              ...maturityGridModel.queryModel.searchCondition,
              investors: [
                ...maturityGridModel.queryModel.searchCondition.investors,
              ],
            },
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupMaturity(p);
    },
  );

  // const columns = useMemo(
  //   () =>
  //     maturityColumns(
  //       maturityGridModel.queryModel.searchCondition
  //         .maturityDays as MaturityTimeRangeEnum,
  //     ),
  //   [maturityGridModel.queryModel.searchCondition.maturityDays],
  // );

  const columns = useMemo(() => {
    const columns = maturityColumns(
      maturityGridModel.queryModel.searchCondition
        .maturityDays as MaturityTimeRangeEnum,
    );
    return maturityGridModel.orderColumns.length
      ? transferFirstColumn(
          resortColumns(maturityGridModel.orderColumns, columns),
        )
      : transferFirstColumn(columns);
  }, [
    configColumnsOrderKeysArr.join(''),
    maturityGridModel.queryModel.searchCondition?.maturityDays,
  ]);

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
