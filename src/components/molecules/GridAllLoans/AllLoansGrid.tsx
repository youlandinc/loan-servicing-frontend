import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { Stack } from '@mui/material';
import {
  MRT_Column,
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { FC, useMemo, useState } from 'react';
import useSWR from 'swr';

import {
  AllLoansPagination,
  ColumnsHeaderMenus,
  columnsResult,
  commonColumns,
  defaultColumnPining,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getAllLoansList } from '@/request/portfolio/allLoans';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

export const AllLoansGrid: FC = observer(() => {
  const router = useRouter();

  const {
    portfolio: { allLoansGridModel, displayType },
  } = useMst();

  const [headerColumnId, setHeaderColumnId] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [tableHeaderIndex, setTableHeaderIndex] = useState(0);

  // const [headerColumn, setHeaderColumn] = useState({} as MRT_Column<any>);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const [columnPiningState, setColumnPiningState] = useState(
    defaultColumnPining(allLoansGridModel.orderColumns),
  );

  const { data, isLoading } = useSWR(
    displayType === PortfolioGridTypeEnum.ALL_LOANS
      ? [
          {
            ...allLoansGridModel.queryModel,
            searchCondition: {
              ...allLoansGridModel.queryModel.searchCondition,
              investors: [
                ...allLoansGridModel.queryModel.searchCondition.investors,
              ],
              repaymentStatusList: [
                ...allLoansGridModel.queryModel.searchCondition
                  .repaymentStatusList,
              ],
            },
            sort: [...allLoansGridModel.queryModel.sort],
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

  const configColumns = useMemo(() => {
    return columnsResult(columns, allLoansGridModel.orderColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLoansGridModel.orderColumns]);

  const rowsTotal = data?.data?.page?.totalElements ?? 0;
  const totalPages = data?.data?.page?.totalPages ?? 0;
  const totalLoanAmount = data?.data?.totalLoanAmount ?? 0;
  const currentPage = data?.data?.page?.number ?? 0;

  const table = useMaterialReactTable({
    columns: configColumns as MRT_ColumnDef<any>[],
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
      columnPinning: columnPiningState,
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
    muiTableHeadCellProps: (props) => ({
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
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#ececec',
        },
      },
      onClick: (e) => {
        if (
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

        setAnchorEl(e.currentTarget);
        setTableHeaderIndex(props.column.getIndex());
        // setHeaderColumn(props.column);
        setHeaderColumnId(props.column.id);
        setHeaderTitle(props.column.columnDef.header);
      },
    }),
    muiTableContainerProps: {
      style: {
        maxHeight: 'calc(100vh - 212px)',
      },
    },
  });
  return (
    <>
      <Stack>
        <MRT_TableContainer
          // sx={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          table={table}
        />
        <AllLoansPagination
          currentPage={currentPage}
          onPageChange={(page: number) => {
            allLoansGridModel.queryModel.updatePage(
              page,
              allLoansGridModel.queryModel.size,
            );
          }}
          onRowsPerPageChange={(e) => {
            allLoansGridModel.queryModel.updatePage(
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
      <ColumnsHeaderMenus
        anchorEl={anchorEl}
        handleFreeze={() => {
          setColumnPiningState({
            left: configColumns
              .slice(0, tableHeaderIndex)
              .map((item) => item.accessorKey) as string[],
          });
        }}
        handleSort={() => {
          allLoansGridModel.queryModel.updateSort([
            {
              property: headerColumnId, //.id as string,
              direction: SortDirection.DESC,
              ignoreCase: true,
              label: headerTitle as string,
            },
          ] as ISortItemModel[]);
        }}
        handleUnfreeze={() => {
          setColumnPiningState({ left: [] });
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
      />
    </>
  );
});
