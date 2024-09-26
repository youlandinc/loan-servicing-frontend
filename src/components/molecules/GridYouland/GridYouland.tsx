import { FC, useState } from 'react';
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
import { _fetchInvestorData, _fetchYoulandTableData } from '@/request';

import { GridYoulandFooter, YOULAND_COLUMNS } from './index';

export const GridYouland: FC = observer(() => {
  const {
    portfolio: {
      displayType,
      youlandGridModel: { queryModel, orderColumns },
    },
  } = useMst();

  const router = useRouter();

  const { data, isLoading, mutate } = useSWR(
    displayType === PortfolioGridTypeEnum.YOULAND
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
      return await _fetchYoulandTableData(p);
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

  useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.YOULAND) {
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

  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string }>
  >([]);

  const onPageSizeChange = async (pageSize: number) => {
    queryModel.updatePage(page.number, pageSize);
  };

  const onPageChange = async (currentPage: number) => {
    queryModel.updatePage(currentPage, page.size);
  };

  const table = useMaterialReactTable({
    columns: YOULAND_COLUMNS(async () => await mutate(), investorData),
    data: data?.data?.content || [],
    enableExpandAll: false,
    enableExpanding: false,
    enableSorting: false,
    enableBottomToolbar: false,
    paginateExpandedRows: false,
    enableTopToolbar: false,
    enableGrouping: false,

    enableRowVirtualization: true,
    enableRowActions: false,
    enableColumnActions: false,
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
      showSkeletons: isLoading,
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.loanId,
    rowVirtualizerOptions: { overscan: 5 },
    columnVirtualizerOptions: { overscan: 5 },

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
          borderColor: '#D2D6E1',
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
          borderTop: '1px solid #D2D6E1',
        },
      },
    },
  });

  return (
    <Stack>
      <MRT_TableContainer sx={{ height: '100%' }} table={table} />
      <GridYoulandFooter
        footerData={footerData}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
      />
    </Stack>
  );
});
