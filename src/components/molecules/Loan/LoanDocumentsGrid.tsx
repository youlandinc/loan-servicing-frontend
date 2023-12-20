import { FC } from 'react';
import { Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { observer } from 'mobx-react-lite';

import { utils } from '@/utils';

import {
  PortfolioGridPagination,
  PortfolioGridToolbar,
} from '@/components/molecules';

const mockData = [
  {
    id: 123,
    dateReceived: '11/1/2023',
    dateDue: '11/1/2023',
    pmtDay: 0,
    reference: 2787035,
    ach: 'ACH',
    paymentType: 'RegPmt',
    totalPmt: utils.formatDollar(30387.5),
    totalInterest: utils.formatDollar(0),
    defaultInterest: utils.formatDollar(0),
    noteInterest: utils.formatDollar(0),
    principal: utils.formatDollar(0),
    lateCharges: utils.formatDollar(0),
    reservePmt: utils.formatDollar(0),
    reserveRestricted: utils.formatDollar(0),
    additionalInformation:
      'This is a test sentence, This is a test sentence, This is a test sentence.',
  },
];

const columns: GridColDef[] = [
  {
    headerName: 'Date received',
    field: 'dateReceived',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 180,
    renderCell: ({ value }) => (
      <Typography overflow={'hidden'}>{value}</Typography>
    ),
  },
];

export const LoanDocumentsGrid: FC = observer(() => {
  const lastChildIndex = columns.length;

  return (
    <DataGrid
      columns={columns}
      getRowId={(row) => row.id}
      pagination
      rowHeight={64}
      rows={mockData}
      slots={{
        toolbar: PortfolioGridToolbar,
        //footer: PortfolioGridPagination,
        pagination: PortfolioGridPagination,
      }}
      sx={{
        m: '0 auto',
        width: '100%',
        borderRadius: 4,
        '.MuiDataGrid-columnHeader': {
          bgcolor: 'background.homepage',
        },
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
  );
});
