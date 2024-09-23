import { FC } from 'react';
import { Pagination, Stack, TablePagination } from '@mui/material';

interface LoanPaymentsGridFooterProps {
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
}

export const LoanPaymentsGridFooter: FC<LoanPaymentsGridFooterProps> = ({
  page,
  onPageSizeChange,
  onPageChange,
}) => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'white'}
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
                    //px: 1.5,
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
  );
};
