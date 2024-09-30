import { ColumnsHeaderMenus } from '@/components/molecules';
import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import {
  MRT_Column,
  MRT_TableContainer,
  MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import router from 'next/router';
import { enqueueSnackbar } from 'notistack';
import React, { CSSProperties, FC, useEffect, useState } from 'react';
import { useAsyncFn, useDebounce } from 'react-use';

import { _setColumnWidth, _setGroupExpanded } from '@/request/common';
import { SetColumnWidthParam } from '@/types/common';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

type GroupLoansProps = MRT_TableOptions<any> & {
  loading?: boolean;
  handleHeaderClick?: (
    e: React.MouseEvent<HTMLTableCellElement>,
    column: MRT_Column<any>,
  ) => void;
  columnOrder?: string[];
  gridType: PortfolioGridTypeEnum;
  expandedData?: Record<string, boolean>;
  handleSort?: (param: {
    property: string; //.id as string,
    label: string;
  }) => void;
};

export const GroupLoans: FC<GroupLoansProps> = ({
  columns,
  data,
  rowCount,
  loading,
  columnOrder,
  handleHeaderClick,
  gridType,
  expandedData = {},
  handleSort,
  ...rest
}) => {
  const [headerColumnId, setHeaderColumnId] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const [, updateGroupExpanded] = useAsyncFn(
    async (
      param: { dropDownId: string; collapsed: boolean }[],
      gridType: PortfolioGridTypeEnum,
    ) => {
      await _setGroupExpanded({
        pageColumn: gridType,
        dropDowns: param,
      });
    },
    [gridType],
  );

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
    [gridType],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    rowCount,
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
      columnOrder: columnOrder || [],
      // isLoading: isValidating,
      showSkeletons: loading,
      // expanded: expandeds || {},
    },
    initialState: {
      // showSkeletons: false,
      showProgressBars: false,
      expanded: expandedData,
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
    muiExpandButtonProps: (props) => ({
      sx: {
        width: 20,
        height: 20,
        padding: 0,
        px: 1.5,
        m: 0,
      },
      title: '',
    }),
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
    muiTableBodyRowProps: ({ row }) => {
      return {
        sx: {
          '& .MuiTableCell-root:last-child': {
            borderColor: '#EDF1FF !important',
            borderBottom:
              row.original.servicingLoans && !row.getIsExpanded()
                ? 'none'
                : '1px solid',
            borderLeft: row.original.servicingLoans ? 'none' : '1px solid',
          },
          '& .MuiTableCell-root:first-of-type': {
            width: 'auto',
            minWidth: 40,
            border: 'none',
          },
          boxShadow: 'none',
          '&:hover': {
            '& td:after': {
              background: '#F6F6F6',
            },
          },
        },
      };
    },
    muiTableBodyCellProps: ({ row }) => {
      return {
        sx: {
          px: 1,
          py: 0,
          height: '32px',
          bgcolor: 'transparent',
          borderLeft: row.original.servicingLoans ? 'none' : '1px solid',
          borderColor: '#EDF1FF !important',
          overflow: 'visible',
          '&:first-of-type': {
            p: 0,
            '& button': {
              px: 1.5,
              py: 0,
              visibility: row.original.servicingLoans ? 'visible' : 'hidden',
              width: 'auto',
              height: 'auto',
            },
          },
          borderBottom:
            row.original.servicingLoans && !row.getIsExpanded()
              ? 'none'
              : '1px solid',
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
      };
    },
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
        '&:first-of-type': {
          width: 'auto',
          minWidth: 40,
          p: 0,
          '& button': {
            height: 'auto',
            px: 1.5,
            py: 1.25,
            width: 'auto',
            minWidth: 'auto',
          },
        },
      },
      onClick: (e) => {
        e.stopPropagation();
        if (props.column.id === 'mrt-row-expand') {
          return;
        }
        setAnchorEl(e.currentTarget);
        setHeaderColumnId(props.column.id);
        setHeaderTitle(props.column.columnDef.header);
      },
    }),
    muiTableContainerProps: {
      style: {
        maxHeight: 'calc(100vh - 212px)',
      },
    },
    muiExpandAllButtonProps: (props) => {
      return {
        sx: {
          m: 0,
          p: 0,
          px: 1.5,
          width: 'auto',
        },
        title: '',
        onClick: () => {
          props.table.toggleAllRowsExpanded();
          //haneleExpandAllClick();
          // set(props.table.toggleAllRowsExpanded, !props.table.getIsAllRowsExpanded());
        },
      };
    },
    ...rest,
  });

  const columnSizing: Record<string, number> = table.getState().columnSizing;
  const expanded = table.getState().expanded;

  useDebounce(
    async () => {
      if (Object.keys(columnSizing).length) {
        //handle column sizing
        await setColumnWidth({
          pageColumn: gridType,
          columnWidths: Object.keys(columnSizing).map((field) => ({
            field,
            columnWidth: columnSizing[field],
          })),
        });
      }
    },
    500,
    [
      Object.keys(columnSizing)
        .map((item) => item)
        .join(''),
      gridType,
    ],
  );

  const [, cancelUpdateGroupExpanded] = useDebounce(
    async () => {
      if (typeof expanded === 'boolean') {
        await updateGroupExpanded(
          data.map((item) => {
            return {
              dropDownId: item.groupById,
              collapsed: true,
            };
          }),
          gridType,
        );
      } else {
        await updateGroupExpanded(
          Object.keys(expanded).map((id) => ({
            dropDownId: id,
            collapsed: true,
          })),
          gridType,
        );
      }
    },
    500,
    [expanded, gridType],
  );

  useEffect(() => {
    cancelUpdateGroupExpanded();
  }, []);

  return (
    <>
      <MRT_TableContainer table={table} />
      <ColumnsHeaderMenus
        anchorEl={anchorEl}
        handleSort={() => {
          handleSort?.({
            property: headerColumnId, //.id as string,
            label: headerTitle as string,
          });
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        type={'group'}
      />
    </>
  );
};
