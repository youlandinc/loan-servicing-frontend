import { FC } from 'react';
import { Pagination, Stack, TablePagination, Typography } from '@mui/material';

interface GridYoulandFooterProps {
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
}

export const GridYoulandFooter: FC<GridYoulandFooterProps> = ({
  page,
  onPageSizeChange,
  onPageChange,
}) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      height={48}
      justifyContent={'space-between'}
      px={4}
    >
      <Stack flexDirection={'row'} gap={3}>
        <Typography variant={'subtitle2'}>
          Total amount: $234,232,000
        </Typography>
        <Typography variant={'subtitle2'}>Number of loans: 89</Typography>
        <Typography variant={'subtitle2'}>
          Weighted average note sheet: 11.3%
        </Typography>
        <Typography variant={'subtitle2'}>
          Weighted average margin: 11.3%
        </Typography>
      </Stack>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        sx={{
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <TablePagination
          component={'div'}
          count={page.totalElements}
          onPageChange={() => {
            return;
          }}
          onRowsPerPageChange={(e) => {
            onPageSizeChange(parseInt(e?.target?.value));
          }}
          page={page.number - 1}
          rowsPerPage={page.size}
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
            select: {
              MenuProps: {
                MenuListProps: {
                  sx: {
                    p: 0,
                    m: 0,
                    '& .MuiMenuItem-root:hover': {
                      bgcolor: 'rgba(144, 149, 163, 0.1) !important',
                    },
                    '& .Mui-selected': {
                      bgcolor: 'hsla(222,100%,95%,1) !important',
                    },
                    '& .Mui-selected:hover': {
                      bgcolor: 'hsla(222,100%,92%,1) !important',
                    },
                    '& .MuiMenuItem-root': {
                      fontSize: 12,
                      color: 'text.primary',
                    },
                  },
                },
              },
            },
          }}
        />

        <Pagination
          count={page.totalPages}
          onChange={(e, page) => {
            onPageChange(page);
          }}
          page={page.number}
        />
      </Stack>
    </Stack>
  );
};
