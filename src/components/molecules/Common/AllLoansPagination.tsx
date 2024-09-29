import React, { FC } from 'react';
import {
  Pagination,
  Stack,
  SxProps,
  TablePagination,
  TablePaginationProps,
  Typography,
} from '@mui/material';

import { utils } from '@/utils';

type PipelinePaginationProps = {
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentPage: number;
  pageCount?: number;
  rowCount?: number;
  sx?: SxProps;
  totalLoanAmount?: number;
  totalLoanAmountShow?: boolean;
  showPage?: boolean;
} & Pick<TablePaginationProps, 'onRowsPerPageChange' | 'rowsPerPage'>;

export const AllLoansPagination: FC<PipelinePaginationProps> = ({
  currentPage,
  onRowsPerPageChange,
  rowCount = 0,
  pageCount = 0,
  rowsPerPage,
  onPageChange,
  sx,
  totalLoanAmount = 0,
  totalLoanAmountShow = true,
  showPage = true,
}) => {
  return (
    <Stack
      direction={'row'}
      sx={{
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        pl: 2.5,
        height: 48,
        ...sx,
      }}
    >
      <Stack alignItems={'center'} direction={'row'} spacing={3}>
        {totalLoanAmountShow && (
          <Typography fontWeight={600} variant={'subtitle2'}>
            Total amount: {utils.formatDollar(totalLoanAmount, 0)}
          </Typography>
        )}{' '}
        <Typography fontWeight={600} variant={'subtitle2'}>
          Number of loans: {rowCount.toLocaleString()}
        </Typography>
      </Stack>
      {showPage && (
        <Stack alignItems={'center'} direction={'row'} spacing={6}>
          <TablePagination
            component={'div'}
            count={rowCount}
            onPageChange={() => {
              return;
            }}
            onRowsPerPageChange={onRowsPerPageChange}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[50, 100]}
            slotProps={{
              actions: {
                previousButton: {
                  sx: { display: 'none' },
                },
                nextButton: {
                  sx: { display: 'none' },
                },
              },
            }}
            sx={{
              // '& .MuiTablePagination-selectLabel,& .MuiTablePagination-displayedRows':
              //   {
              //     fontSize: {
              //       xs: '14px !important',
              //       lg: '16px !important',
              //     },
              //   },
              color: 'text.secondary',
              '& .MuiTablePagination-input': {
                fontSize: 12,
                ml: 0,
              },
            }}
          />

          <Pagination
            count={pageCount}
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              onPageChange?.(value - 1);
            }}
            page={currentPage + 1}
            shape="circular"
            siblingCount={0}
            sx={{
              fontSize: 14,
              '& .MuiPaginationItem-previousNext': {
                color: 'text.primary',
              },
              '& .Mui-disabled svg path': {
                fill: '#cdcdcd',
                '& svg path': {
                  fill: 'background.disabled',
                },
              },
            }}
            variant="text"
          />
        </Stack>
      )}
    </Stack>
  );
};
