import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const mockData = [
  {
    loanNumber: 123456,
    borrowerName: 'iKun',
    propertyAddress: '3254 Fraser Street, | Aurora, CO 80011',
    maturityDate: '11/11/2022',
    primaryPurpose: 'Business',
    originalBalance: 44444444,
    currentBalance: 0,
    nextDueDate: '11/11/2022',
    noteRate: 0.085,
    totalPayment: 0,
    status: 'Paid Off',
    defaultRate: 0.18,
    originationData: '11/11/2022',
  },
  {
    loanNumber: 1234567,
    borrowerName: 'iKun',
    propertyAddress: '3254 Fraser Street, | Aurora, CO 80011',
    maturityDate: '11/11/2022',
    primaryPurpose: 'Business',
    originalBalance: 44444444,
    currentBalance: 0,
    nextDueDate: '11/11/2022',
    noteRate: 0.085,
    totalPayment: 0,
    status: 'Paid Off',
    defaultRate: 0.18,
    originationData: '11/11/2022',
  },
];

const columns: GridColDef[] = [
  {
    field: 'loanNumber',
    headerName: 'Loan number',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => (
      <Typography overflow={'hidden'}>{value}</Typography>
    ),
  },
  {
    field: 'borrowerName',
    headerName: 'Borrower name',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'propertyAddress',
    headerName: 'Property address',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => {
      const [line_1, line_2] = value.split('|');
      return (
        <Box>
          <Typography overflow={'hidden'}>{line_1}</Typography>
          <Typography overflow={'hidden'}>{line_2}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'maturityDate',
    headerName: 'Maturity date',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'primaryPurpose',
    headerName: 'Primary purpose',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'originalBalance',
    headerName: 'Original balance',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'currentBalance',
    headerName: 'Current balance',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'nextDueDate',
    headerName: 'Next due date',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'noteRate',
    headerName: 'Note rate',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'totalPayment',
    headerName: 'Total payment',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'defaultRate',
    headerName: 'Default rate',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
  {
    field: 'originationData',
    headerName: 'Origination date',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ value }) => <Typography>{value}</Typography>,
  },
];

export const PortfolioGrid: FC = () => {
  const lastChildIndex = columns.length;

  return (
    <>
      <DataGrid
        columns={columns}
        getRowId={(row) => row.loanNumber}
        rowHeight={64}
        rows={mockData}
        sx={{
          m: '0 auto',
          width: '90%',
          minWidth: 1440,
          '.MuiDataGrid-columnSeparator': {
            visibility: 'visible',
          },
          '.MuiDataGrid-columnHeadersInner': {
            [`.MuiDataGrid-columnHeader:nth-child(${lastChildIndex}) > .MuiDataGrid-columnSeparator`]:
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
            [`.MuiDataGrid-cell:nth-child(${lastChildIndex})`]: {
              '&::after': {
                display: 'none',
              },
            },
          },
        }}
      />
    </>
  );
};
