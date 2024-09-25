import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constant';

import { PortfolioGridTypeEnum } from '@/types/enum';
import {
  GridYoulandItem,
  GridYoulandSummaryProps,
  ResponseGridYoulandTable,
} from '@/types/pipeline/youland';
import { HttpError } from '@/types/common';
import { _fetchInvestorData, _fetchYoulandTableData } from '@/request';

import { GridYoulandFooter, YOULAND_COLUMNS } from './index';

const mock: Array<Partial<GridYoulandItem>> = [
  {
    loanId: 1,
    repaymentStatus: null,
    submitDate: null,
    propertyAddress: null,
    estSaleDate: null,
    investor: null,
    prospectiveBuyer: null,
    tradeStatus: null,
    interestRate: null,
    totalLoanAmount: null,
    buyRate: null,
    originatorSpread: null,
    tradeConfirm: null,
  },
];

export const GridYouland: FC = observer(() => {
  const {
    portfolio: { displayType },
  } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { loading } = useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.YOULAND) {
      return;
    }
    await fetchData();
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

  const fetchData = async (page = 0, size = 50) => {
    setFetchLoading(true);
    try {
      const {
        data: {
          content,
          page: innerPage,
          totalItems,
          totalLoanAmount,
          weightedAverageMargin,
          weightedAverageSheet,
        },
      } = await _fetchYoulandTableData({
        page,
        size,
      });
      setTableData(content);
      setPage(innerPage);
      setFooterData({
        totalItems,
        totalLoanAmount,
        weightedAverageMargin,
        weightedAverageSheet,
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const [fetchLoading, setFetchLoading] = useState(false);
  const [tableData, setTableData] =
    useState<Array<Partial<GridYoulandItem>>>(mock);
  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string }>
  >([]);
  const [page, setPage] = useState<ResponseGridYoulandTable['page']>({
    number: 0,
    size: 50,
    totalElements: 1,
    totalPages: 1,
  });
  const [footerData, setFooterData] = useState<GridYoulandSummaryProps>({
    totalItems: 5,
    totalLoanAmount: 50000,
    weightedAverageMargin: 0,
    weightedAverageSheet: 10,
  });

  const onPageSizeChange = async (pageSize: number) => {
    setPage((prev) => ({ ...prev, size: pageSize }));
    await fetchData(page.number, pageSize);
  };

  const onPageChange = async (currentPage: number) => {
    setPage((prev) => ({ ...prev, number: currentPage }));
    await fetchData(currentPage, page.size);
  };

  const table = useMaterialReactTable({
    columns: YOULAND_COLUMNS(fetchData, investorData) as MRT_ColumnDef<any>[],
    data: tableData,
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
      size: 250,
    },

    manualPagination: true,
    state: {
      //isLoading: loading,
      showSkeletons: loading || fetchLoading,
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.loanId,
    rowVirtualizerOptions: { overscan: 5 },
    columnVirtualizerOptions: { overscan: 5 },

    renderEmptyRowsFallback: ({ table }) => {
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
        '& .MuiTableRow-root': {
          boxShadow: 'none !important',
          bgcolor: '#F4F6FA',
        },
        '& .MuiTableCell-root': {
          border: 'none',
          borderBottom: '1px solid #F4F6FA',
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
        '& .MuiDivider-root': {
          borderWidth: '1px',
          height: 16,
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => {
      return {
        async onClick() {
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
          '&:last-of-type': {
            borderRight: 'none',
          },
        },
        '&:hover': {
          '& td:after': {
            background: '#F6F6F6',
          },
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
