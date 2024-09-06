import { FC } from 'react';
import { useRouter } from 'next/router';
import { Stack, SxProps, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { utils } from '@/utils';
import { GridRowsProp } from '@mui/x-data-grid/models/gridRows';

const mockData = [
  {
    id: -11,
    dataDue: '2024-09-05',
    dataReceivedTime: '2024-09-05',
    pmtDayVariance: 0,
    isAch: true,
    paymentType: 'string',
    totalPmt: 0,
    reference: 'string',
  },
];

const columns: GridColDef[] = [
  {
    field: 'dataDue',
    headerName: 'Date Due',
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
    headerName: 'Date Received',
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
    headerName: 'Pmt Day Variance',
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
    headerName: 'Reference',
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
    headerName: 'ACH',
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
    headerName: 'Payment Type',
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
    headerName: 'Total Pmt',
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

export interface LoanOverviewPaymentsGridProps {
  sx?: SxProps;
  histories?: GridRowsProp<any>;
}

export const LoanOverviewPaymentsGrid: FC<LoanOverviewPaymentsGridProps> = ({
  sx = { minWidth: 682 },
  histories = mockData,
}) => {
  const router = useRouter();
  const lastChildIndex = columns.length;

  return (
    <DataGrid
      autoHeight={true}
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
      rows={histories}
      slots={{
        toolbar: () => (
          <Stack pb={1} pl={3} pt={2}>
            <Typography variant={'subtitle1'}>Payment history</Typography>
          </Stack>
        ),
        //footer: () => <Stack pl={3}>123</Stack>,
        //pagination: PortfolioGridPagination,
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
        ...sx,
      }}
    />
  );
};
