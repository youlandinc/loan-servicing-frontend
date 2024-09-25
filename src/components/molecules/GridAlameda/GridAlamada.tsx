import { FC, useState } from 'react';
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

import {
  GridAlamedaItem,
  GridAlamedaSummaryProps,
  ResponseGridAlamedaTable,
} from '@/types/pipeline/youland';
import { PortfolioGridTypeEnum } from '@/types/enum';
import { HttpError } from '@/types/common';
import { _fetchAlamedaTableData, _fetchInvestorData } from '@/request';

import { ALAMEDA_COLUMNS, GridAlamedaFooter } from './index';
import { useRouter } from 'next/router';

const mock: Array<Partial<GridAlamedaItem>> = [
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

export const GridAlameda: FC = observer(() => {
  const {
    portfolio: { displayType },
  } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { loading } = useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.ALAMEDA) {
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
      } = await _fetchAlamedaTableData({
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
  const [tableData, setTableData] = useState(mock);
  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string }>
  >([]);
  const [page, setPage] = useState<ResponseGridAlamedaTable['page']>({
    number: 0,
    size: 50,
    totalElements: 1,
    totalPages: 1,
  });
  const [footerData, setFooterData] = useState<GridAlamedaSummaryProps>({
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
    columns: ALAMEDA_COLUMNS(fetchData, investorData) as MRT_ColumnDef<any>[],
    data: tableData,
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
    getRowId: (row) => row.loanId, //default
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 5 }, //optionally customize the column virtualizer

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
      <GridAlamedaFooter
        footerData={footerData}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
      />
    </Stack>
  );
});
