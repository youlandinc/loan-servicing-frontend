import { FC } from 'react';

import { Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { utils } from '@/utils';

const mockData = [
  {
    id: -1,
    dataDue: '11-1-2023',
    dataReceivedTime: '11-1-2023',
    pmtDayVariance: 0,
    isAch: 'ACH',
    paymentType: 'ACH',
    totalPmt: 'ACH',
    reference: 'RegPmt',
  },
  {
    id: -2,
    dataDue: '11-1-2023',
    dataReceivedTime: '11-1-2023',
    pmtDayVariance: 0,
    isAch: 'ACH',
    paymentType: 'ACH',
    totalPmt: 'ACH',
    reference: 'RegPmt',
  },
  {
    id: -3,
    dataDue: '11-1-2023',
    dataReceivedTime: '11-1-2023',
    pmtDayVariance: 0,
    isAch: 'ACH',
    paymentType: 'ACH',
    totalPmt: 'ACH',
    reference: 'RegPmt',
  },
  {
    id: -4,
    dataDue: '11-1-2023',
    dataReceivedTime: '11-1-2023',
    pmtDayVariance: 0,
    isAch: 'ACH',
    paymentType: 'ACH',
    totalPmt: 'ACH',
    reference: 'RegPmt',
  },
  {
    id: -5,
    dataDue: '11-1-2023',
    dataReceivedTime: '11-1-2023',
    pmtDayVariance: 0,
    isAch: 'ACH',
    paymentType: 'ACH',
    totalPmt: 'ACH',
    reference: 'RegPmt',
  },
  {
    id: -6,
    dataDue: '11-1-2023',
    dataReceivedTime: '11-1-2023',
    pmtDayVariance: 0,
    isAch: 'ACH',
    paymentType: 'ACH',
    totalPmt: 'ACH',
    reference: 'RegPmt',
  },
  {
    id: -7,
    dataDue: '11-1-2023',
    dataReceivedTime: '11-1-2023',
    pmtDayVariance: 0,
    isAch: 'ACH',
    paymentType: 'ACH',
    totalPmt: 'ACH',
    reference: 'RegPmt',
  },
];

const columns: GridColDef[] = [
  {
    field: 'dataDue',
    headerName: 'Funding due',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDate(value)}</Typography>
    ),
  },
  {
    field: 'dataReceivedTime',
    headerName: 'Reference',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDate(value)}</Typography>
    ),
  },
  {
    field: 'pmtDayVariance',
    headerName: 'Investor account',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 200,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{value}</Typography>
    ),
  },
  {
    field: 'reference',
    headerName: 'Investor name',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{value}</Typography>
    ),
  },
  {
    field: 'isAch',
    headerName: 'Amount funded',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{value ? 'ACH' : '-'}</Typography>
    ),
  },
  {
    field: 'paymentType',
    headerName: 'Notes',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{value}</Typography>
    ),
  },
  {
    field: 'totalPmt',
    headerName: 'Funding type',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 120,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDollar(value)}</Typography>
    ),
  },
];

export const LoanDrawsGrid: FC = () => {
  const lastChildIndex = columns.length;
  return (
    <DataGrid
      autoHeight
      columnHeaderHeight={40}
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      disableDensitySelector
      disableRowSelectionOnClick
      getRowId={(row) => row.id}
      hideFooter
      pagination
      rowHeight={40}
      rows={mockData}
      slots={{
        toolbar: () => (
          <Stack pb={1} pl={3} pt={2}>
            <Typography variant={'subtitle1'}>Funding draw history</Typography>
          </Stack>
        ),
        // footer: () => <Stack pl={3}>123</Stack>,
        // pagination: PortfolioGridPagination,
      }}
      sx={{
        m: '0 auto',
        height: 'auto',
        width: '100%',
        borderRadius: 4,
        '.MuiDataGrid-virtualScroller': {
          overflowY: 'auto !important',
        },
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
        minWidth: 682,
      }}
    />
  );
};
