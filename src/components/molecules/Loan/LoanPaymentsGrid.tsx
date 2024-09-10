import { CSSProperties, FC, useState } from 'react';
import { Icon, Stack, Tooltip, Typography } from '@mui/material';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { useAsync } from 'react-use';
import { uniqueId } from 'lodash';
import { useSnackbar } from 'notistack';

import { utils } from '@/utils';
import { AUTO_HIDE_DURATION } from '@/constant';
import { ellipsisStyle } from '@/styles';

import { LoanPaymentsGridFooter } from '@/components/molecules';

import { HttpError } from '@/types/common';
import { _fetchPaymentsHistory } from '@/request/loan/payments';
import { PaymentHistoryItem } from '@/types/payments';

import TABLE_NO_RESULT from '@/svg/loan/table-no-result.svg';

export const LoanPaymentsGrid: FC<{
  maxHeight?: CSSProperties['maxHeight'];
  tableHeight?: CSSProperties['height'];
  tableMaxHeight?: CSSProperties['maxHeight'];
}> = ({ maxHeight, tableHeight, tableMaxHeight }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [fetchLoading, setFetchLoading] = useState(false);

  const { loading } = useAsync(async () => {
    await fetchData(0, 10);
  }, []);

  const fetchData = async (page: number, size: number) => {
    const { loanId } = utils.getParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    const postData = {
      loanId,
      page,
      size,
    };
    setFetchLoading(true);
    try {
      const { data } = await _fetchPaymentsHistory(postData);

      const last = {
        dataReceivedTime: 'Total (4 rc)',
        totalPmt: data.accumulateTotalPmt,
        totalInterestReceived: data.accumulateTotalInterestReceived,
        //defaultInterestReceived: data.accumulateDefaultInterestReceived,
        //interestRateReceived: data.accumulateInterestRateReceived,
        principalReceived: data.accumulatePrincipalReceived,
        accruedLateCharges: data.accumulateAccruedLateCharges,
        waivedLateCharges: data.accumulateWaivedLateCharges,
        reservePmt: data.accumulateReservePmt,
        reserveRestricted: data.accumulateReserveRestricted,
        id: '-1',
      };
      const list = data?.content || [];
      list.forEach((item) => Object.assign(item, { id: uniqueId() }));
      list.push(last);
      setList(list);
      //setList([]);
      if (list.length > 0) {
        table.setRowSelection({ '-1': true });
        table.setRowPinning({ bottom: ['-1'] });
      }
      setPage({
        number: data.page.number + 1,
        size: data.page.size,
        totalElements: data.page.totalElements,
        totalPages: data.page.totalPages,
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

  const [list, setList] = useState<
    Array<Partial<PaymentHistoryItem & { id: string | number }>>
  >([]);
  const [page, setPage] = useState({
    number: 1,
    size: 10,
    totalElements: 5,
    totalPages: 1,
  });

  const onPageSizeChange = async (pageSize: number) => {
    setPage((prev) => ({ ...prev, size: pageSize }));
    await fetchData(page.number - 1, pageSize);
  };

  const onPageChange = async (currentPage: number) => {
    setPage((prev) => ({ ...prev, number: currentPage }));
    await fetchData(currentPage - 1, page.size);
  };

  const table = useMaterialReactTable({
    columns: LOAN_PAYMENT_GRID_COLUMNS as MRT_ColumnDef<any>[],
    data: list,
    //rowCount: rowsTotal,
    enableExpandAll: false, //hide expand all double arrow in column header
    enableExpanding: false,
    enableSorting: false,
    enableBottomToolbar: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    paginateExpandedRows: true, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    enableTopToolbar: false,
    enableGrouping: false,

    enableRowVirtualization: true,

    enableColumnActions: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    enableColumnOrdering: false,
    enableColumnDragging: false,
    enableColumnResizing: false,
    enableColumnVirtualization: true,

    enableRowPinning: true,
    rowPinningDisplayMode: 'select-bottom',

    manualPagination: true,
    state: {
      isLoading: loading || fetchLoading,
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.id, //default
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 5 }, //optionally customize the column virtualizer

    renderEmptyRowsFallback: ({ table }) => {
      return (
        <Stack
          //alignItems={'center'}
          //justifyContent={'center'}
          pl={8}
          pt={4}
          width={'100%'}
        >
          {/*<Icon component={TABLE_NO_RESULT} sx={{ width: 120, height: 45 }} />*/}
          <Typography color={'text.secondary'} mt={1.5} variant={'subtitle2'}>
            No recorded transactions
          </Typography>
        </Stack>
      );
    },
    muiTableHeadProps: {
      sx: {
        '& .MuiTableRow-root': {
          boxShadow: 'none !important',
          bgcolor: '#F4F6FA',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        width: 'fit-content',
        px: 1.5,
        position: 'relative',
        boxShadow: 'none',
        fontWeight: 500,
        '&:not(:last-of-type)': {
          '&:after': {
            display: 'block',
            content: "''",
            position: 'absolute',
            right: '1px',
            top: '50%',
            width: '1px',
            height: '18px',
            bgcolor: '#D2D6E1',
            transform: 'translateY(-50%)',
          },
        },
      },
    },
    muiTableBodyRowProps: {
      sx: {
        width: 'fit-content',
        boxShadow: 'none',
        '& td': {
          borderBottom: 'none !important',
        },
        '& .MuiTableCell-body': {
          p: 1.5,
          position: 'relative',
          '&:before': {
            display: 'block',
            content: "''",
            position: 'absolute',
            right: '1px',
            top: '50%',
            width: '1px',
            height: '18px',
            bgcolor: '#D2D6E1',
            transform: 'translateY(-50%)',
          },
        },
        '&[data-pinned="true"]': {
          bgcolor: 'white !important',
          '& td': {
            fontWeight: '600 !important',
            '&:after': {
              bgcolor: 'transparent !important',
            },
            '&:before': {
              display: 'none',
            },
          },
        },
      },
    },
  });

  return (
    <Stack flexShrink={0} height={'auto'} maxHeight={maxHeight}>
      <Typography pb={1} pl={3} pt={2} variant={'subtitle1'}>
        Payment history
      </Typography>
      <MRT_TableContainer table={table} />
      <LoanPaymentsGridFooter
        onPageChange={(page) => onPageChange(page)}
        onPageSizeChange={(pageSize) => onPageSizeChange(pageSize)}
        page={page}
      />
    </Stack>
  );
};

const LOAN_PAYMENT_GRID_COLUMNS: MRT_ColumnDef<any>[] = [
  {
    accessorKey: 'dataReceivedTime',
    header: 'Date received',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? !row.getIsPinned()
                ? utils.formatDate(renderedCellValue as string)
                : renderedCellValue
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'dataDue',
    header: 'Date due',
    size: 120,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        !row.getIsPinned() && (
          <Tooltip title={renderedCellValue}>
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDate(renderedCellValue as string)
                : '-'}
            </Typography>
          </Tooltip>
        )
      );
    },
  },
  {
    accessorKey: 'pmtDayVariance',
    header: 'Pmt day variance',
    size: 200,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        !row.getIsPinned() && (
          <Tooltip title={renderedCellValue}>
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body2'}
            >
              {renderedCellValue}
            </Typography>
          </Tooltip>
        )
      );
    },
  },
  {
    accessorKey: 'isAch',
    header: 'ACH',
    size: 100,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        !row.getIsPinned() && (
          <Tooltip title={renderedCellValue}>
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body2'}
            >
              {renderedCellValue ? 'ACH' : '-'}
            </Typography>
          </Tooltip>
        )
      );
    },
  },
  {
    accessorKey: 'paymentType',
    header: 'Payment Type',
    size: 180,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        !row.getIsPinned() && (
          <Tooltip title={renderedCellValue}>
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body2'}
            >
              {/*todo:enum?*/}
              {renderedCellValue}
            </Typography>
          </Tooltip>
        )
      );
    },
  },
  {
    accessorKey: 'totalPmt',
    header: 'Total pmt',
    size: 120,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? utils.formatDollar(renderedCellValue as number)
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'totalInterestReceived',
    header: 'Total interest received',
    size: 210,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? utils.formatDollar(renderedCellValue as number)
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  //{
  //  accessorKey: 'defaultInterestReceived',
  //  header: 'Default interest received',
  //  size: 220,
  //  muiTableBodyCellProps: { align: 'center' },
  //  muiTableHeadCellProps: { align: 'center' },
  //  Cell: ({ renderedCellValue, row }) => {
  //    return (
  //      <Tooltip title={renderedCellValue}>
  //        <Typography
  //          sx={{
  //            ...ellipsisStyle,
  //            width: '100%',
  //            fontWeight: row.getIsPinned() ? 600 : 400,
  //          }}
  //          variant={'body2'}
  //        >
  //          {utils.notNull(renderedCellValue)
  //            ? utils.formatDollar(renderedCellValue as number)
  //            : '-'}
  //        </Typography>
  //      </Tooltip>
  //    );
  //  },
  //},
  //{
  //  accessorKey: 'interestRateReceived',
  //  header: 'Interest rate received',
  //  size: 210,
  //  muiTableBodyCellProps: { align: 'center' },
  //  muiTableHeadCellProps: { align: 'center' },
  //  Cell: ({ renderedCellValue, row }) => {
  //    return (
  //      <Tooltip title={renderedCellValue}>
  //        <Typography
  //          sx={{
  //            ...ellipsisStyle,
  //            width: '100%',
  //            fontWeight: row.getIsPinned() ? 600 : 400,
  //          }}
  //          variant={'body2'}
  //        >
  //          {utils.notNull(renderedCellValue)
  //            ? utils.formatDollar(renderedCellValue as number)
  //            : '-'}
  //        </Typography>
  //      </Tooltip>
  //    );
  //  },
  //},
  {
    accessorKey: 'principalReceived',
    header: 'Principal received',
    size: 200,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? utils.formatDollar(renderedCellValue as number)
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'accruedLateCharges',
    header: 'Accrued late charges',
    size: 210,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? utils.formatDollar(renderedCellValue as number)
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'waivedLateCharges',
    header: 'Waive late charges',
    size: 190,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? utils.formatDollar(renderedCellValue as number)
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'reservePmt',
    header: 'Reserve pmt',
    size: 190,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? utils.formatDollar(renderedCellValue as number)
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'reserveRestricted',
    header: 'Reserve restricted',
    size: 190,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
              fontWeight: row.getIsPinned() ? 600 : 400,
            }}
            variant={'body2'}
          >
            {utils.notNull(renderedCellValue)
              ? utils.formatDollar(renderedCellValue as number)
              : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'additionalInformation',
    header: 'Additional information',
    size: 190,
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    Cell: ({ renderedCellValue }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
            variant={'body2'}
          >
            {renderedCellValue ?? '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
];
