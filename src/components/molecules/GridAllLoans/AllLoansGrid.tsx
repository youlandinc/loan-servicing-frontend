import { ellipsisStyle } from '@/styles';
import { utils } from '@/utils';
import { Stack, Typography } from '@mui/material';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { enqueueSnackbar } from 'notistack';
import { FC, useMemo, useState } from 'react';
import { useAsyncFn, useDebounce } from 'react-use';
import useSWR from 'swr';

import {
  AllLoansPagination,
  ColumnsHeaderMenus,
  commonColumns,
  defaultColumnPining,
  defaultColumns,
  resortColumns,
  transferOrderColumnsKeys,
} from '@/components/molecules';
import { ExportLoanType } from '@/components/molecules/GridAllLoans/ExportLoanType';
import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { useMst } from '@/models/Root';
import { _setColumnPining, _setColumnWidth } from '@/request/common';
import { _getAllLoansList } from '@/request/portfolio/allLoans';
import {
  SetColumnWidthParam,
  UpdateColumnPiningParamType,
} from '@/types/common';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

const DEFAULT_SORT = [
  {
    property: 'repaymentStatus',
    direction: SortDirection.DESC,
    ignoreCase: true,
    label: 'Status',
  },
  {
    property: 'maturityDate',
    direction: SortDirection.ASC,
    ignoreCase: true,
    label: 'Maturity date',
  },
];

export const AllLoansGrid: FC = observer(() => {
  const {
    portfolio: { allLoansGridModel, displayType },
  } = useMst();

  const [headerColumnId, setHeaderColumnId] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [tableHeaderIndex, setTableHeaderIndex] = useState(0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const [, setColumnPiningState] = useState(
    defaultColumnPining(allLoansGridModel.orderColumns),
  );

  const columnPiningConfig = allLoansGridModel.pinLeftColumns;

  const configColumnsOrderKeysArr = allLoansGridModel.orderColumns?.length
    ? [
        'mrt-row-select',
        ...transferOrderColumnsKeys(allLoansGridModel.orderColumns),
      ]
    : [];

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
            sort: allLoansGridModel.queryModel.sort.length
              ? [...allLoansGridModel.queryModel.sort]
              : DEFAULT_SORT,
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

  const configColumns = useMemo(() => {
    const allLoansColumns = defaultColumns;
    return allLoansGridModel.orderColumns.length
      ? resortColumns(allLoansGridModel.orderColumns, allLoansColumns)
      : allLoansColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configColumnsOrderKeysArr.join('')]);

  const rowsTotal = data?.data?.page?.totalElements ?? 0;
  const totalPages = data?.data?.page?.totalPages ?? 0;
  const totalLoanAmount = data?.data?.totalLoanAmount ?? 0;
  const currentPage = data?.data?.page?.number ?? 0;
  const rowSelectConfig = allLoansGridModel.isExported;

  const rowSelectConfigs = {
    enableRowSelection: rowSelectConfig,
    enableMultiRowSelection: rowSelectConfig,
    enableBatchRowSelection: rowSelectConfig,
    enableSelectAll: rowSelectConfig,
  };

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
    state: {
      columnOrder: configColumnsOrderKeysArr,
      showSkeletons: isLoading,
      columnPinning: { left: columnPiningConfig },
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.loanId, //default
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 5 }, //optionally customize the column virtualizer
    muiTableBodyRowProps: {
      sx: {
        '& .MuiTableCell-root:last-child': {
          // borderBottom: 'none',
          borderColor: '#EDF1FF',
        },
        boxShadow: 'none',
        '& td': {},
        '&:hover': {
          '& td:after': {
            background: '#F6F6F6',
          },
        },
        '&:hover .MuiTableCell-root[data-pinned="true"]::before': {
          bgcolor: '#F6F6F6',
        },
        '& .MuiTableCell-root[data-pinned="true"]::after': {
          zIndex: -2,
        },
      },
    },
    muiTableBodyCellProps: ({ row: { original } }) => ({
      sx: {
        px: 1,
        py: 0,
        height: 32,
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: '#EDF1FF',
        '&:last-of-type': {
          borderRight: 'none',
        },
      },
      onClick: async () => {
        const { loanId } = original;
        window.open(`/loan/overview/?loanId=${loanId}`, '_blank');
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
        '&[data-pinned="true"]:before': {
          bgcolor: 'transparent',
        },
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#ececec',
        },
        '& .MuiDivider-root': {
          borderWidth: '1px',
          height: 16,
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
    muiSelectAllCheckboxProps: {
      title: '',
      sx: {
        m: '0 auto',
        transform: 'translateX(calc(50% - 18px))',
      },
    },
    muiSelectCheckboxProps: {
      title: '',
      sx: {
        m: '0 auto',
      },
    },
    ...rowSelectConfigs,
  });

  const columnSizing: Record<string, number> = table.getState().columnSizing;
  const columnPining = table.getState().columnPinning;
  const rowSelection = Object.keys(table.getState().rowSelection).length
    ? Object.keys(table.getState().rowSelection).map((item) => Number(item))
    : [];

  const [, setColumnWidth] = useAsyncFn(
    async (result: SetColumnWidthParam) => {
      await _setColumnWidth(result).catch(({ message, variant, header }) => {
        enqueueSnackbar(message, {
          variant,
          isSimple: !header,
          header,
        });
      });
      // await userSetting.fetchUserSetting();
    },
    [columnSizing],
  );

  const [, updateColumnPining] = useAsyncFn(
    async (param: UpdateColumnPiningParamType) => {
      await _setColumnPining({
        pageColumn: PortfolioGridTypeEnum.ALL_LOANS,
        ...param,
      });
    },
    [columnPining],
  );

  useDebounce(
    async () => {
      if (Object.keys(columnSizing).length) {
        //handle column sizing
        await setColumnWidth({
          pageColumn: PortfolioGridTypeEnum.ALL_LOANS,
          columnWidths: Object.keys(columnSizing).map((field) => ({
            field,
            columnWidth: columnSizing[field],
          })),
        });
      }
    },
    500,
    [columnSizing],
  );

  useDebounce(
    async () => {
      if (columnPining.left?.length) {
        await updateColumnPining({
          leftColumn: (columnPining.left || []) as string[],
          rightColumn: (columnPining.right || []) as string[],
        });
      }
    },
    500,
    [columnPining.left?.join('')],
  );

  return (
    <>
      <Stack>
        <MRT_TableContainer table={table} />

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
          updateTime={data?.data?.dataUpdateTime}
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
          allLoansGridModel.updatePinLeftColumns(
            configColumns
              .slice(0, tableHeaderIndex)
              .map((item) => item.accessorKey) as string[],
          );
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
        handleUnfreeze={async () => {
          // setColumnPiningState({ left: [] });
          allLoansGridModel.updatePinLeftColumns([]);
          await updateColumnPining({
            leftColumn: [],
            rightColumn: [],
          });
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
      />
      <ExportLoanType
        disabled={rowSelection.length === 0}
        loanIds={rowSelection}
        onClose={() => {
          allLoansGridModel.updateIsExported(false);
          table.setRowSelection({});
        }}
        open={allLoansGridModel.isExported}
      />
    </>
  );
});
