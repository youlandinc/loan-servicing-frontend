import { FC, useMemo } from 'react';
import {
  MRT_ColumnDef,
  MRT_ExpandButton,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import useSWR from 'swr';

import { commonColumns, AllLoansPagination } from '@/components/molecules';
import { _getAllLoansList } from '@/request/portfolio/allLoans';
import { CircularProgress, Stack } from '@mui/material';

export const AllLoansGrid: FC = () => {
  const { data, isLoading } = useSWR({}, _getAllLoansList);

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
      isLoading,
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
    /*    muiTableBodyCellProps: ({ row, column: { id } }) => ({
      onClick: async () => {
        const { original, originalSubRows } = row;
        if (originalSubRows?.length) {
          set(row.toggleExpanded, !row.getIsExpanded());
          return;
        }
        if (
          originalSubRows?.length ||
          id === 'loanOfficer' ||
          id === 'action' ||
          id === 'stage' ||
          id === 'appraisalStage'
        ) {
          return;
        }
        await Router.push({
          pathname: '/dashboard/pipeline/details/[formKey]',
          query: {
            id: original.id,
            formKey: getFirstSubMenuKey(setting.tenantConfig?.tenantId),
          },
        });
      },
    }),
    displayColumnDefOptions: {
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
    <div>
      <MRT_TableContainer table={table} />
      <AllLoansPagination
        currentPage={currentPage}
        // onPageChange={(page: number) => {
        //   // onPageChange(page);
        //   updatePipelineSearchParam({ ...allLoansQuerys, page });
        // }}
        // onRowsPerPageChange={(e) => {
        //   updatePipelineSearchParam({
        //     ...allLoansQuerys,
        //     page: 0,
        //     size: e.target.value as unknown as number,
        //   });
        // }}
        pageCount={totalPages}
        rowCount={rowsTotal}
        rowsPerPage={50}
        sx={{ borderTop: '1px solid #EDF1FF' }}
        totalLoanAmount={totalLoanAmount}
      />
    </div>
  );
};
