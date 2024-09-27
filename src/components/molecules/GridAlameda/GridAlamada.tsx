import { FC, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import useSWR from 'swr';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { PortfolioGridTypeEnum } from '@/types/enum';
import { _fetchAlamedaTableData, _fetchInvestorData } from '@/request';

import { ALAMEDA_COLUMNS, GridAlamedaFooter } from './index';
import {
  resortColumns,
  transferOrderColumnsKeys,
} from '@/components/molecules';

export const GridAlameda: FC = observer(() => {
  const {
    portfolio: {
      displayType,
      alamedaGridModel: { queryModel, orderColumns },
    },
  } = useMst();

  const router = useRouter();

  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string }>
  >([]);

  const onPageSizeChange = async (pageSize: number) => {
    queryModel.updatePage(page.number, pageSize);
  };

  const onPageChange = async (currentPage: number) => {
    queryModel.updatePage(currentPage, page.size);
  };

  useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.ALAMEDA) {
      return;
    }
    const { data } = await _fetchInvestorData();
    const temp = data.reduce(
      (acc, cur) => {
        acc.push({
          label: cur.investorName,
          value: cur.id,
          key: cur.id,
          bgColor: '',
        });
        return acc;
      },
      [] as Array<Option & { bgColor: string }>,
    );
    setInvestorData(temp);
  }, [displayType]);

  const { data, isLoading, mutate } = useSWR(
    displayType === PortfolioGridTypeEnum.ALAMEDA
      ? [
          {
            ...queryModel,
            searchCondition: {
              ...queryModel.searchCondition,
              investors: [...queryModel.searchCondition.investors],
              repaymentStatusList: [
                ...queryModel.searchCondition.repaymentStatusList,
              ],
            },
            sort: [...queryModel.sort],
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _fetchAlamedaTableData(p);
    },
    {
      revalidateOnFocus: true,
    },
  );

  const footerData = {
    totalItems: data?.data?.totalItems,
    totalLoanAmount: data?.data?.totalLoanAmount,
    weightedAverageMargin: data?.data?.weightedAverageMargin,
    weightedAverageSheet: data?.data?.weightedAverageSheet,
  };

  const page = {
    number: data?.data?.page?.number ?? 0,
    size: data?.data?.page?.size ?? 50,
    totalElements: data?.data?.page?.totalElements ?? 0,
    totalPages: data?.data?.page?.totalPages ?? 0,
  };

  const configColumnsOrderKeysArr = orderColumns?.length
    ? transferOrderColumnsKeys(orderColumns)
    : [];

  const configColumns = useMemo(() => {
    return orderColumns.length
      ? resortColumns(
          orderColumns,
          ALAMEDA_COLUMNS(async () => await mutate(), investorData),
        )
      : ALAMEDA_COLUMNS(async () => await mutate(), investorData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configColumnsOrderKeysArr.join('')]);

  const table = useMaterialReactTable({
    columns: configColumns,
    data: data?.data?.content || [],
    //rowCount: rowsTotal,
    enableExpandAll: false, //hide expand all double arrow in column header
    enableExpanding: false,
    enableSorting: false,
    enableBottomToolbar: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    paginateExpandedRows: true, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    enableTopToolbar: false,
    enableGrouping: false,

    enableRowVirtualization: true,
    enableRowActions: false,
    enableColumnActions: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    enableColumnOrdering: false,
    enableColumnDragging: false,
    enableColumnResizing: true,
    enableColumnVirtualization: true,

    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: 140,
      size: 250,
    },

    manualPagination: true,
    state: {
      columnOrder: configColumnsOrderKeysArr,
      showSkeletons: isLoading,
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.loanId, //default
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 5 }, //optionally customize the column virtualizer

    renderEmptyRowsFallback: () => {
      return (
        <Stack pl={8} pt={4} width={'100%'}>
          <Typography color={'text.secondary'} mt={1.5} variant={'subtitle2'}>
            No recorded transactions
          </Typography>
        </Stack>
      );
    },
    muiTableContainerProps: {
      style: {
        maxHeight: 'calc(100vh - 236px)',
      },
    },
    muiTableHeadProps: {
      sx: {
        opacity: 1,
        '& .MuiTableRow-head': {
          boxShadow: 'none',
        },
        '& .Mui-TableHeadCell-Content-Wrapper': {
          fontWeight: 600,
          fontSize: 12,
          lineHeight: '20px',
          whiteSpace: 'nowrap',
        },
        '& .MuiTableCell-root': {
          border: 'none',
        },
        '& .MuiTableCell-root:last-child': {
          bgcolor: '#F4F6FA',
        },
        '& .MuiTableRow-root': {
          boxShadow: 'none !important',
          bgcolor: '#F4F6FA',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        boxShadow: 'none',
        fontWeight: 600,
        fontSize: 12,
        color: 'text.secondary',
        border: 'none',
        height: 40,
        bgcolor: '#F4F6FA',
        opacity: 1,
        px: 1,
        py: 1.25,
        justifyContent: 'center',
        '& .Mui-TableHeadCell-Content-Labels ': {
          pl: 0,
        },
        '& .Mui-TableHeadCell-Content-Wrapper': {
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          webkitBoxOrient: 'vertical',
          webkitLineClamp: 2,
          display: '-webkit-box',
          whiteSpace: 'normal',
          color: '#636A7C',
        },
        '& .Mui-TableHeadCell-ResizeHandle-Wrapper': {
          mr: '-8px',
        },
        '& .Mui-TableHeadCell-ResizeHandle-Divider': {
          borderWidth: 1,
        },
        '&[data-pinned="true"]:before': {
          bgcolor: 'transparent',
        },
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#ececec',
        },
        '& .MuiDivider-root': {
          borderWidth: '1px',
          height: 16,
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => {
      return {
        async onClick() {
          if (isLoading) {
            return;
          }
          await router.push({
            pathname: '/loan/overview',
            query: { loanId: row.original.loanId },
          });
        },
      };
    },
    muiTableBodyRowProps: {
      sx: {
        boxShadow: 'none',
        '& td': {
          height: 40,
          borderRight: '1px solid',
          borderColor: '#edf1ff',
          py: 0,
          '&:last-of-type': {
            borderRight: 'none',
          },
        },
        '&:hover': {
          '& td:after': {
            background: '#F6F6F6',
          },
        },
        '&:first-of-type': {
          borderTop: '1px solid #edf1ff',
        },
      },
    },
  });

  return (
    <Stack>
      <MRT_TableContainer sx={{ height: '100%' }} table={table} />
      <GridAlamedaFooter
        footerData={footerData}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
      />
    </Stack>
  );
});
