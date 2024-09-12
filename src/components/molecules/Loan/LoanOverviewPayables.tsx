import { FC } from 'react';
import { Icon, Stack, SxProps, Typography } from '@mui/material';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';

import { utils } from '@/utils';
import { OverviewOutstandingPayAble } from '@/types/overview';

import TABLE_NO_RESULT from '@/svg/loan/table-no-result.svg';

const mockData = [
  {
    id: 0,
    loanId: 1520,
    dueDate: '2024-11-01',
    dateReceived: null,
    interestDue: 11681.25,
    lateChargesDue: null,
    paymentAmount: null,
    principalDue: null,
    paymentModeOn: null,
    description: null,
    billStatus: 'DELINQUENT',
    monthAndYearOfDueDate: 'November 2024',
  },
];

const columns: GridColDef[] = [
  //{
  //  field: 'description',
  //  headerName: 'Description',
  //  sortable: false,
  //  align: 'center',
  //  headerAlign: 'center',
  //  minWidth: 300,
  //  renderCell: ({ value }) => (
  //    <Typography variant={'body3'}>{value || '-'}</Typography>
  //  ),
  //},
  {
    field: 'dueDate',
    headerName: 'Date due',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDate(value)}</Typography>
    ),
  },
  {
    field: 'interestDue',
    headerName: 'Interest due',
    sortable: false,
    align: 'center',
    headerAlign: 'center',
    minWidth: 200,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDollar(value)}</Typography>
    ),
  },
  {
    field: 'lateChargesDue',
    headerName: 'Late charges',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDollar(value)}</Typography>
    ),
  },
  {
    field: 'principalDue',
    headerName: 'Principal',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDollar(value)}</Typography>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: () => (
      <Typography
        bgcolor={'rgba(144, 149, 163, 1)'}
        borderRadius={1}
        color={'white'}
        py={0.25}
        textAlign={'center'}
        variant={'body3'}
        width={80}
      >
        Unpaid
      </Typography>
    ),
  },
];

export interface LoanOverviewPayablesGridProps {
  sx?: SxProps;
  outstandingPayAbles?: GridRowsProp<OverviewOutstandingPayAble>;
}

export const LoanOverviewPayablesGrid: FC<LoanOverviewPayablesGridProps> = ({
  sx = { minWidth: 682 },
  outstandingPayAbles = mockData,
}) => {
  const router = useRouter();
  const lastChildIndex = columns.length;

  return (
    <DataGrid
      columnHeaderHeight={40}
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      disableDensitySelector
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
      hideFooter={true}
      pagination
      rowHeight={40}
      rows={outstandingPayAbles}
      slots={{
        toolbar: () => (
          <Stack pb={1} pl={3} pt={2}>
            <Typography variant={'subtitle1'}>Outstanding payables</Typography>
          </Stack>
        ),
        noRowsOverlay: () => (
          <Stack
            //alignItems={'center'}
            //justifyContent={'center'}
            height={'100%'}
            pl={8}
            pt={4}
            width={'100%'}
          >
            {/*<Icon component={TABLE_NO_RESULT} sx={{ width: 120, height: 45 }} />*/}
            <Typography color={'text.secondary'} mt={1.5} variant={'subtitle2'}>
              No outstanding payables
            </Typography>
          </Stack>
        ),
        //footer: PortfolioGridPagination,
        //pagination: PortfolioGridPagination,
      }}
      sx={{
        m: '0 auto',
        width: '100%',
        borderRadius: 4,
        '.MuiDataGrid-columnHeader': {
          bgcolor: 'background.homepage',
        },
        '.MuiDataGrid-columnHeader:focus-within': {
          outline: 'none !important',
        },
        '.MuiDataGrid-columnHeaders': {
          borderBottom: 'none',
        },
        '& .MuiDataGrid-cell': {
          border: 0,
        },
        '.MuiDataGrid-columnSeparator': {
          visibility: 'visible',
        },
        '.MuiDataGrid-columnHeadersInner': {
          [`.MuiDataGrid-columnHeader:nth-of-type(${lastChildIndex}) > .MuiDataGrid-columnSeparator`]:
            {
              visibility: 'hidden',
            },
        },
        '.MuiDataGrid-cell': {
          overflow: 'unset !important',
          position: 'relative',
          '&:focus': {
            outline: 0,
          },
          '&::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            height: '16px',
            width: '2px',
            bgcolor: 'rgb(224,224,224)',
            top: '50%',
            right: '-1px',
            transform: 'translateY(-50%)',
          },
          '&:last-of-type': {
            '&::after': {
              display: 'none',
            },
          },
        },
        '.MuiDataGrid-row': {
          [`.MuiDataGrid-cell:nth-of-type(${lastChildIndex})`]: {
            '&::after': {
              display: 'none',
            },
          },
        },
        ...sx,
      }}
    />
  );
};
