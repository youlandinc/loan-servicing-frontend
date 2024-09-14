import { Stack } from '@mui/material';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
import useSWR from 'swr';

import { AllLoansPagination, commonColumns } from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getAllLoansList } from '@/request/portfolio/allLoans';
import { PortfolioGridTypeEnum } from '@/types/enum';

export const AllLoansGrid: FC = observer(() => {
  const router = useRouter();

  const {
    portfolio: { allLoansGridQueryModel, displayType },
  } = useMst();

  const { data, isLoading } = useSWR(
    displayType === PortfolioGridTypeEnum.ALL_LOANS
      ? [
          {
            ...allLoansGridQueryModel,
            searchCondition: {
              ...allLoansGridQueryModel.searchCondition,
              investors: [...allLoansGridQueryModel.searchCondition.investors],
              repaymentStatusList: [
                ...allLoansGridQueryModel.searchCondition.repaymentStatusList,
              ],
            },
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getAllLoansList(p);
    },
    {
      revalidateOnFocus: true,
    },
  );

  const columns = useMemo(() => commonColumns, []);

  const rowsTotal = data?.data?.page?.totalElements ?? 0;
  const totalPages = data?.data?.page?.totalPages ?? 0;
  const totalLoanAmount = data?.data?.totalLoanAmount ?? 0;
  const currentPage = data?.data?.page?.number ?? 0;

  const table = useMaterialReactTable({
    columns: columns as MRT_ColumnDef<any>[],
    data: data?.data?.content || [],
    rowCount: rowsTotal,
    enableExpandAll: false, //hide expand all double arrow in column header
    enableExpanding: false,
    enableBottomToolbar: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    paginateExpandedRows: true, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    enableTopToolbar: false,
    enableColumnActions: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    enableColumnOrdering: false,
    enableSorting: false,
    enableColumnDragging: false,
    enableGrouping: true,
    enableColumnResizing: true,
    enableRowVirtualization: true,
    enableColumnVirtualization: true,
    enableColumnPinning: true,
    manualPagination: true,
    // getCoreRowModel: getCoreRowModel(),
    state: {
      // columnOrder: configColumnsOrderKeysArr,
      // isLoading: isValidating,
      showSkeletons: isLoading,
      // columnPinning: columnPiningState,
    },
    initialState: {
      // showSkeletons: false,
      showProgressBars: false,
      // expanded: defaultExpanded,
    },
    getRowId: (row) => row.loanId, //default
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 5 }, //optionally customize the column virtualizer
    muiTableBodyRowProps: {
      sx: {
        '& .MuiTableCell-root:last-child': {
          borderBottom: 'none',
        },
      },
    },
    muiTableBodyCellProps: ({ row: { original } }) => ({
      sx: {
        px: 1.5,
        py: 1.5,
        borderBottom: 'none',
      },
      onClick: async () => {
        const { loanId } = original;
        await router.push({
          pathname: '/loan/overview',
          query: { loanId },
        });
      },
    }),
    muiTableHeadProps: {
      sx: {
        opacity: 1,
        '& .MuiTableRow-head': {
          boxShadow: 'none',
        },

        '& .Mui-TableHeadCell-Content-Wrapper': {
          fontWeight: 600,
          fontSize: 12,
          lineHeight: '20px',
          whiteSpace: 'nowrap',
        },
        '& .MuiTableCell-root': {
          border: 'none',
        },
        '& .MuiTableCell-root:last-child': {
          bgcolor: '#F4F6FA',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        bgcolor: '#F4F6FA',
        opacity: 1,
        border: 'none',
        minHeight: 36,
        px: 1,
        py: 1.25,
        justifyContent: 'center',
        '& .Mui-TableHeadCell-Content-Labels ': {
          pl: 0,
        },
        '& .Mui-TableHeadCell-Content-Wrapper': {
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          webkitBoxOrient: 'vertical',
          webkitLineClamp: 2,
          display: '-webkit-box',
          whiteSpace: 'normal',
          color: '#636A7C',
        },
        '& .Mui-TableHeadCell-ResizeHandle-Wrapper': {
          mr: '-8px',
        },
        '& .Mui-TableHeadCell-ResizeHandle-Divider': {
          borderWidth: 1,
        },
        '&[data-pinned="true"]:before': {
          bgcolor: 'transparent',
        },
        /* cursor:
            pipelineMode === PipelineDisplayMode.LIST_MODE ? 'pointer' : 'unset',
        '&:hover': {
          bgcolor:
              pipelineMode === PipelineDisplayMode.LIST_MODE ? '#ececec' : 'none',
        },*/
      },
    },
    muiTableContainerProps: {
      style: {
        maxHeight: 'calc(100vh - 212px)',
      },
    },
    /*    muiTablePaperProps: {
      sx: {
        boxShadow: 'none',
        '& .MuiAlert-message span': {
          visibility: 'hidden',
        },
        borderRadius: 0,
      },
    },
    muiBottomToolbarProps: {
      sx: {
        '& .MuiTypography-body2': {
          fontSize: 14,
        },
        '& .MuiInputLabel-root,& .MuiInput-root': {
          fontSize: 14,
        },
      },
    },
    muiTableBodyProps: {
      sx: {
        '& tr .groupingTitle': {
          color: 'text.primary',
        },
        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
          borderBottom: 'none',
        },
      },
    },
    muiPaginationProps: {
      SelectProps: {
        sx: {
          '& .MuiInputBase-input:focus': {
            bgcolor: 'transparent',
          },
        },
      },
    },
    muiSelectCheckboxProps: {
      sx: {
        width: 20,
        height: 20,
        m: '0 auto',
      },
    },
    muiSelectAllCheckboxProps: {
      sx: {
        display: 'block',
        m: '0 auto',
      },
    },*/
    /* displayColumnDefOptions: {
      'mrt-row-expand': {
        size: 40, //make the expand column wider
        Cell: ({ row, table }) => {
          return (
            <>
              {row.subRows?.length ? (
                <MRT_ExpandButton row={row} table={table} />
              ) : null}
            </>
          );
        },
      },
    },
    columnResizeMode: 'onChange',
    muiExpandAllButtonProps: (props) => {
      return {
        onClick: () => {
          set(
            props.table.toggleAllRowsExpanded,
            !props.table.getIsAllRowsExpanded(),
          );
        },
        sx: {
          p: 0,
          width: 'auto',
          height: 'auto',
        },
      };
    },
    muiExpandButtonProps: {
      sx: {
        p: 0,
        width: 'auto',
        height: 'auto',
      },
    },
    paginationDisplayMode: 'custom',
    muiCircularProgressProps: {
      Component: (
        <Stack
          alignItems={'center'}
          direction={'row'}
          justifyContent={'center'}
          mt={8}
        >
          <CircularProgress sx={{ fontSize: 18 }} />
        </Stack>
      ),
    },
    memoMode: 'cells',
    onColumnPinningChange: setColumnPiningState,
    ...TableDefaultProps(pipelineType),
    muiTableHeadCellProps: (props) => {
      return {
        sx: { ...defaultProps(pipelineType).muiTableHeadCellProps.sx },
        onClick: (e) => {
          if (
            pipelineType === PipelineDisplayMode.GROUP_MODE ||
            (e.target as HTMLElement).className?.includes(
              'Mui-TableHeadCell-ResizeHandle-Wrapper',
            ) ||
            (e.target as HTMLElement).className?.includes(
              'Mui-TableHeadCell-ResizeHandle-Divider',
            )
          ) {
            return;
          }
          const id = props.column.id;
          if (id === 'mrt-row-select') {
            return;
          }
          ColumnIdToSortIdMap[props.column.id]
            ? setHeaderSortDisabled(false)
            : setHeaderSortDisabled(true);

          setAnchorElHeader(e.currentTarget);
          setTableHeaderIndex(props.column.getIndex());
          setHeaderColumn(props.column);
        },
      };
    },*/
  });
  return (
    <Stack border={'1px solid'} borderColor={'border.normal'} borderRadius={4}>
      <MRT_TableContainer
        sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        table={table}
      />
      <AllLoansPagination
        currentPage={currentPage}
        onPageChange={(page: number) => {
          allLoansGridQueryModel.updatePage(page, allLoansGridQueryModel.size);
        }}
        onRowsPerPageChange={(e) => {
          allLoansGridQueryModel.updatePage(
            0,
            e.target.value as unknown as number,
          );
        }}
        pageCount={totalPages}
        rowCount={rowsTotal}
        rowsPerPage={50}
        sx={{ borderTop: '1px solid #EDF1FF' }}
        totalLoanAmount={totalLoanAmount}
      />
    </Stack>
  );
});
