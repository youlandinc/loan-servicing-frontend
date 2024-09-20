import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { Stack, Typography } from '@mui/material';

import { GridYoulandFooter, YOULAND_COLUMNS } from './index';
import { PipelineStatusEnum } from '@/types/enum';
import {
  GridTradeConfirmEnum,
  GridTradeStatusEnum,
  GridYoulandItem,
} from '@/types/pipeline/youland';
import { useAsync, useAsyncFn } from 'react-use';
import { _fetchYoulandTableData } from '@/request';
import { HttpError } from '@/types/common';
import { AUTO_HIDE_DURATION } from '@/constant';
import { useSnackbar } from 'notistack';

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
  {
    loanId: 2,
    repaymentStatus: PipelineStatusEnum.PERFORMING,
    submitDate: '2022-02-01',
    propertyAddress: '123 Main St',
    estSaleDate: '2022-02-01',
    investor: 'Youland',
    prospectiveBuyer: 'Alameda',
    tradeStatus: GridTradeStatusEnum.in_progress,
    interestRate: 0,
    totalLoanAmount: 0,
    buyRate: 0,
    originatorSpread: 0,
    tradeConfirm: GridTradeConfirmEnum.not_confirmed,
  },
  {
    loanId: 3,
    repaymentStatus: PipelineStatusEnum.FORECLOSURE,
    submitDate: '2022-03-01',
    propertyAddress: '123 Main St',
    estSaleDate: '2022-03-01',
    investor: 'Youland',
    prospectiveBuyer: 'Alameda',
    tradeStatus: GridTradeStatusEnum.confirmed,
    interestRate: 1.2,
    totalLoanAmount: 8888.8,
    buyRate: 1.2,
    originatorSpread: 1.2,
    tradeConfirm: GridTradeConfirmEnum.confirmed,
  },
  {
    loanId: 4,
    repaymentStatus: PipelineStatusEnum.PERFORMING,
    submitDate: '2022-04-01',
    propertyAddress: '123 Main St',
    estSaleDate: '2022-04-01',
    investor: 'Youland',
    prospectiveBuyer: 'Alameda',
    tradeStatus: GridTradeStatusEnum.not_in_trade,
    interestRate: 1.02,
    totalLoanAmount: 8888.08,
    buyRate: 1.02,
    originatorSpread: 1.02,
    tradeConfirm: GridTradeConfirmEnum.confirmed,
  },
  {
    loanId: 5,
    repaymentStatus: PipelineStatusEnum.PAID_OFF,
    submitDate: '2022-05-01',
    propertyAddress: '123 Main St',
    estSaleDate: '2022-05-01',
    investor: 'Youland',
    prospectiveBuyer: 'Alameda',
    tradeStatus: GridTradeStatusEnum.confirmed,
    interestRate: 1.23,
    totalLoanAmount: 8888.88,
    buyRate: 1.23,
    originatorSpread: 1.23,
    tradeConfirm: GridTradeConfirmEnum.confirmed,
  },
];

export const GridYouland: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();

  const { loading } = useAsync(async () => await fetchData(), []);

  const fetchData = async () => {
    try {
      const {
        data: { content },
      } = await _fetchYoulandTableData({
        number: 0,
        size: 50,
      });
      setTableData(content);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const [tableData, setTableData] = useState(mock);

  const table = useMaterialReactTable({
    columns: YOULAND_COLUMNS(fetchData) as MRT_ColumnDef<any>[],
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
      isLoading: loading,
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.id, //default
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

  const [page, setPage] = useState({
    number: 1,
    size: 50,
    totalElements: 1000,
    totalPages: 100,
  });

  const onPageSizeChange = async (pageSize: number) => {
    setPage((prev) => ({ ...prev, size: pageSize }));
    //await fetchData(page.number - 1, pageSize);
  };

  const onPageChange = async (currentPage: number) => {
    setPage((prev) => ({ ...prev, number: currentPage }));
    //await fetchData(currentPage - 1, page.size);
  };

  return (
    <Stack
      border={'1px solid'}
      borderColor={'border.normal'}
      pb={3}
      sx={{
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}
    >
      <MRT_TableContainer sx={{ height: '100%' }} table={table} />
      <GridYoulandFooter
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
      />
    </Stack>
  );
});
