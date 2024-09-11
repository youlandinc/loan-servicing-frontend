import { Stack, Typography } from '@mui/material';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React, { CSSProperties, FC, useMemo } from 'react';
import useSWR from 'swr';

import {
  AllLoansPagination,
  commonColumns,
  groupCommonColumns,
} from '@/components/molecules';
import { useMst } from '@/models/Root';
import { _getGroupByInvestor } from '@/request/portfolio/investor';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { PortfolioGridTypeEnum } from '@/types/enum';

export const InvestorGrid: FC = observer(() => {
  const router = useRouter();
  const {
    portfolio: { investorGridQueryModel, displayType },
  } = useMst();

  const { data, isLoading, isValidating } = useSWR(
    displayType === PortfolioGridTypeEnum.BY_INVESTOR
      ? [
          {
            ...investorGridQueryModel,
            searchCondition: {
              ...investorGridQueryModel.searchCondition,
              investors: [...investorGridQueryModel.searchCondition.investors],
            },
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _getGroupByInvestor(p);
    },
    // { revalidateOnMount: true },
  );

  const columns = useMemo(() => groupCommonColumns, []);

  const rowsTotal = data?.data?.totalItems ?? 0;
  const totalLoanAmount = data?.data?.totalAmount ?? 0;

  const table = useMaterialReactTable({
    columns: columns as MRT_ColumnDef<any>[],
    data: data?.data?.contents || [],
    rowCount: rowsTotal,
    enableExpandAll: true, //hide expand all double arrow in column header
    enableExpanding: true,
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
      showSkeletons: isValidating,
      // columnPinning: columnPiningState,
    },
    initialState: {
      // showSkeletons: false,
      showProgressBars: false,
      // expanded: defaultExpanded,
    },
    getRowId: (row) => {
      if (row.servicingLoans?.length) {
        return row.groupById;
      }
      return row.loanId;
    }, //default
    getSubRows: (row) => row.servicingLoans,
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 5 }, //optionally customize the column virtualizer
    muiExpandButtonProps: {
      sx: {
        width: 20,
        height: 20,
      },
      title: '',
    },
    icons: {
      KeyboardDoubleArrowDownIcon: (props: { style: CSSProperties }) => {
        const { style } = props;

        const transformValue =
          style.transform === 'rotate(-180deg)'
            ? 'rotate(0deg)'
            : 'rotate(-90deg)';
        return (
          <KeyboardDoubleArrowDownIcon
            style={{ ...style, transform: transformValue }}
            sx={{ fontSize: 20 }}
          />
        );
      },
      ExpandMoreIcon: (props: { style: CSSProperties }) => {
        const { style } = props;

        const transformValue =
          style.transform === 'rotate(-180deg)'
            ? 'rotate(0deg)'
            : 'rotate(-90deg)';

        return (
          <ExpandMoreIcon
            style={{ ...style, transform: transformValue }}
            sx={{ fontSize: 20 }}
          />
        );
      },
    },
    muiTableBodyRowProps: {
      sx: {
        '& .MuiTableCell-root:last-child': {
          borderBottom: 'none',
        },
        '& .MuiTableCell-root:first-of-type': {
          width: 40,
          minWidth: 40,
        },
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        px: 1.5,
        py: 1.5,
        borderBottom: 'none',
        bgcolor: 'transparent',
        overflow: 'visible',
        '&:first-of-type button': {
          visibility: row.original.servicingLoans ? 'visible' : 'hidden',
        },
      },
      onClick: async () => {
        const { original } = row;
        const { loanId } = original;
        if (original.servicingLoans) {
          row.toggleExpanded();
        }
        if (!original.servicingLoans) {
          await router.push({
            pathname: '/loan/overview',
            query: { loanId },
          });
        }
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
        '& .MuiTableCell-root:first-of-type': {
          width: 40,
          minWidth: 40,
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
        maxHeight: 1098,
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
        currentPage={0}
        rowCount={rowsTotal}
        rowsPerPage={0}
        showPage={false}
        sx={{ borderTop: '1px solid #EDF1FF' }}
        totalLoanAmount={totalLoanAmount}
      />
    </Stack>
  );
});
