import React, { FC, useState } from 'react';
import { Stack, Tab, Tabs, Typography } from '@mui/material';
import { GetAppOutlined, VisibilityOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { observer } from 'mobx-react-lite';

import { utils } from '@/utils';

import { PortfolioGridPagination } from '@/components/molecules';

const mockData = [
  {
    id: 123,
    description:
      'This is a test sentence, This is a test sentence, This is a test sentence!',
    createdDate: '11/13/2023',
  },
  {
    id: 234,
    description:
      'This is a test sentence, This is a test sentence, This is a test sentence!',
    createdDate: '11/13/2023',
  },
];

const columns: GridColDef[] = [
  {
    headerName: 'Description',
    field: 'description',
    sortable: true,
    flex: 6,
    align: 'center',
    headerAlign: 'center',
    minWidth: 180,
    renderCell: ({ value }) => (
      <Typography overflow={'hidden'}>{value}</Typography>
    ),
  },
  {
    headerName: 'Created date',
    field: 'createdDate',
    sortable: true,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 180,
    renderCell: ({ value }) => (
      <Typography overflow={'hidden'}>{value}</Typography>
    ),
  },
  {
    headerName: 'Actions',
    field: 'actions',
    type: 'actions',
    renderCell: ({ id }) => (
      <Stack flexDirection={'row'} gap={1}>
        <VisibilityOutlined key={`${id}_preview`} sx={{ cursor: 'pointer' }} />
        <GetAppOutlined key={`${id}_download`} sx={{ cursor: 'pointer' }} />
      </Stack>
    ),
  },
];

const LoanDocumentsGridToolbar: FC = () => {
  const [value, setValue] = useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Tabs
      onChange={handleChange}
      sx={{
        px: 3,
        pt: 3,
        pb: 1.5,
        '& .Mui-selected': {
          color: '#202939 !important',
        },
        '& .MuiTabs-indicator': {
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'transparent',
          bottom: 4,
        },
        '& .MuiTabs-indicatorSpan': {
          width: '100%',
          backgroundColor: 'primary.main',
        },
      }}
      TabIndicatorProps={{
        children: <span className={'MuiTabs-indicatorSpan'} />,
      }}
      value={value}
    >
      <Tab
        label={'Statements'}
        sx={{ textTransform: 'none', p: 0, fontSize: 14, fontWeight: 600 }}
        value="one"
      />
      <Tab
        label={'Year-End(1098)'}
        sx={{
          textTransform: 'none',
          p: 0,
          ml: 2,
          fontSize: 14,
          fontWeight: 600,
        }}
        value="two"
      />
      <Tab
        label={'Late Notices'}
        sx={{
          textTransform: 'none',
          p: 0,
          ml: 2,
          fontSize: 14,
          fontWeight: 600,
        }}
        value="three"
      />
    </Tabs>
  );
};

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
        toolbar: LoanDocumentsGridToolbar,
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
