import { FC } from 'react';
import { TablePaginationProps } from '@mui/material';
import MuiPagination from '@mui/material/Pagination';
import {
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';

export const CustomPagination: FC<
  Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>
> = ({ page, onPageChange, className }) => {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  return (
    <MuiPagination
      className={className}
      color="primary"
      count={pageCount}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
      page={page + 1}
    />
  );
};

export const PortfolioGridPagination = (props: any) => {
  return <GridPagination ActionsComponent={CustomPagination} {...props} />;
};
