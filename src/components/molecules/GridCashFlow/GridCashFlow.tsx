import React, { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import {
  MRT_ExpandButton,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { useAsync, useAsyncFn, useDebounce } from 'react-use';
import { enqueueSnackbar } from 'notistack';
import useSWR from 'swr';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  CASH_FLOW_COLUMNS,
  GridCashFlowFooter,
  reduceCashFlowColumn,
} from './index';
import {
  ColumnsHeaderMenus,
  resortColumns,
  transferOrderColumnsKeys,
} from '@/components/molecules';

import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { SetColumnWidthParam } from '@/types/common';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';
import { _fetchCashFlowTableData, _fetchInvestorData } from '@/request';
import { _setColumnWidth, _setGroupExpanded } from '@/request/common';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const GridCashFlow: FC = observer(() => {
  const {
    portfolio: {
      displayType,
      cashFlowGridModel: { queryModel, orderColumns, expandedColumns },
    },
  } = useMst();

  const router = useRouter();

  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string }>
  >([]);

  const [headerColumnId, setHeaderColumnId] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const [, updateGroupExpanded] = useAsyncFn(
    async (params?: { dropDownId: string; collapsed: boolean }[]) => {
      if (!params) {
        return;
      }
      await _setGroupExpanded({
        pageColumn: PortfolioGridTypeEnum.CASH_FLOW,
        dropDowns: params,
      });
    },
    [],
  );

  const [, setColumnWidth] = useAsyncFn(async (result: SetColumnWidthParam) => {
    await _setColumnWidth(result).catch(({ message, variant, header }) => {
      enqueueSnackbar(message, {
        variant,
        isSimple: !header,
        header,
      });
    });
  }, []);

  const { loading } = useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.CASH_FLOW) {
      return;
    }
    const { data } = await _fetchInvestorData({});
    const temp = data.reduce(
      (acc, cur) => {
        acc.push({
          label: cur.investorName,
          value: cur.investorName,
          key: cur.id,
          bgColor: '',
        });
        return acc;
      },
      [] as Array<Option & { bgColor: string }>,
    );
    temp.unshift({
      label: 'None',
      value: 'None',
      key: NaN,
      bgColor: '',
    });
    setInvestorData(temp);
  }, [displayType]);

  const { data, isLoading, mutate } = useSWR(
    displayType === PortfolioGridTypeEnum.CASH_FLOW
      ? [
          {
            ...queryModel,
            searchCondition: {
              ...queryModel.searchCondition,
              investors: [...queryModel.searchCondition.investors],
              tradeStatus: [...queryModel.searchCondition.tradeStatus],
              prospectiveBuyers: [
                ...queryModel.searchCondition.prospectiveBuyers,
              ],
            },
            sort: [...queryModel.sort],
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _fetchCashFlowTableData(p);
    },
    {
      revalidateOnFocus: true,
    },
  );

  const footerData = {
    totalItems: data?.data?.totalItems,
    totalLoanAmount: data?.data?.totalLoanAmount,
    weightedAverageMargin: data?.data?.weightedAverageMargin,
    weightedAverageSheet: data?.data?.weightedAverageSheet,
  };

  const configColumnsOrderKeysArr = orderColumns?.length
    ? transferOrderColumnsKeys(orderColumns)
    : [];

  configColumnsOrderKeysArr.unshift('mrt-row-expand');

  const configColumns = useMemo(() => {
    return orderColumns.length
      ? reduceCashFlowColumn(
          resortColumns(
            orderColumns,
            CASH_FLOW_COLUMNS(async () => await mutate(), investorData),
          ),
        )
      : reduceCashFlowColumn(
          resortColumns(
            orderColumns,
            CASH_FLOW_COLUMNS(async () => await mutate(), investorData),
          ),
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configColumnsOrderKeysArr.join(''), loading]);

  const expandedData =
    expandedColumns?.reduce(
      (pre, cur) => {
        pre[cur.dropDownId] = true;
        return pre;
      },
      {} as Record<string, boolean>,
    ) || {};

  const table = useMaterialReactTable({
    columns: configColumns,
    data: data?.data?.content || [],
    //rowCount,
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
    state: {
      columnOrder: configColumnsOrderKeysArr,
      showSkeletons: isLoading || loading,
    },
    initialState: {
      showProgressBars: false,
      expanded: expandedData,
    },
    getRowId: (row) => {
      if (row.servicingLoans?.length) {
        return row.groupById;
      }
      return row.loanId;
    }, //default
    defaultColumn: {
      minSize: 140,
      size: 250,
    },

    getSubRows: (row) => row.servicingLoans,
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    columnVirtualizerOptions: { overscan: 5 }, //optionally customize the column virtualizer
    renderEmptyRowsFallback: () => {
      return (
        <Stack pl={8} pt={4} width={'100%'}>
          <Typography color={'text.secondary'} mt={1.5} variant={'subtitle2'}>
            No recorded transactions
          </Typography>
        </Stack>
      );
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
    displayColumnDefOptions: {
      'mrt-row-expand': {
        size: 40,
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
    muiTableContainerProps: {
      style: {
        maxHeight: 'calc(100vh - 212px)',
      },
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
          minWidth: 44,
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
    muiTableBodyRowProps: ({ row }) => {
      return {
        sx: {
          '& .MuiTableCell-root:last-child': {
            borderColor: '#D2D6E1 !important',
            borderBottom:
              row.original.servicingLoans && !row.getIsExpanded()
                ? 'none'
                : '1px solid',
            borderLeft: row.original.servicingLoans ? 'none' : '1px solid',
          },
          '& .MuiTableCell-root:first-of-type': {
            width: 'auto',
            minWidth: 44,
            border: 'none',
          },
          boxShadow: 'none',
        },
      };
    },
    muiTableBodyCellProps: ({ row }) => {
      return {
        sx: {
          px: 1.5,
          py: 0,
          height: '32px',
          bgcolor: 'transparent',
          borderLeft: row.original.servicingLoans ? 'none' : '1px solid',
          borderColor: '#D2D6E1 !important',
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
        },
      };
    },
    muiExpandButtonProps: () => ({
      sx: {
        width: 20,
        height: 20,
        padding: 0,
        px: 1.5,
        m: 0,
      },
      title: '',
    }),
  });

  const expanded = table.getState().expanded;

  const [, cancelUpdateGroupExpanded] = useDebounce(
    async () => {
      if (typeof expanded === 'boolean') {
        await updateGroupExpanded(
          data?.data.content.map((item) => {
            return {
              dropDownId: item.groupById,
              collapsed: true,
            };
          }),
        );
      } else {
        await updateGroupExpanded(
          Object.keys(expanded).map((id) => ({
            dropDownId: id,
            collapsed: true,
          })),
        );
      }
    },
    500,
    [expanded],
  );

  const columnSizing: Record<string, number> = table.getState().columnSizing;

  useDebounce(
    async () => {
      if (Object.keys(columnSizing).length) {
        //handle column sizing
        await setColumnWidth({
          pageColumn: PortfolioGridTypeEnum.CASH_FLOW,
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
    ],
  );

  useEffect(
    () => {
      cancelUpdateGroupExpanded();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Stack>
      <MRT_TableContainer sx={{ height: '100%' }} table={table} />
      <GridCashFlowFooter footerData={footerData} />
      <ColumnsHeaderMenus
        anchorEl={anchorEl}
        handleSort={() => {
          queryModel.updateSort([
            {
              property: headerColumnId, //.id as string,
              direction: SortDirection.DESC,
              ignoreCase: true,
              label: headerTitle,
            },
          ] as ISortItemModel[]);
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        type={'group'}
      />
    </Stack>
  );
});
