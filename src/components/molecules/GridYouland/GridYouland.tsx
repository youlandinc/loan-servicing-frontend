import React, { FC, useMemo, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import {
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { enqueueSnackbar } from 'notistack';
import { useAsync, useAsyncFn, useDebounce } from 'react-use';
import useSWR from 'swr';

import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { useMst } from '@/models/Root';

import {
  ColumnsHeaderMenus,
  defaultColumnPining,
  resortColumns,
  transferOrderColumnsKeys,
} from '@/components/molecules';

import { _fetchInvestorData, _fetchYoulandTableData } from '@/request';
import { _setColumnPining, _setColumnWidth } from '@/request/common';
import {
  SetColumnWidthParam,
  UpdateColumnPiningParamType,
} from '@/types/common';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';
import { TableTypeEnum } from '@/types/pipeline/youland';

import { GridYoulandFooter, YOULAND_COLUMNS } from './index';

const defaultSort = [
  {
    direction: 'DESC',
    ignoreCase: true,
    label: 'Est. sale date',
    property: 'estSaleDate',
  },
  {
    direction: 'ASC',
    ignoreCase: true,
    label: 'Investor',
    property: 'investor',
  },
];

export const GridYouland: FC = observer(() => {
  const {
    portfolio: {
      displayType,
      youlandGridModel: {
        queryModel,
        orderColumns,
        pinLeftColumns,
        updatePinLeftColumns,
      },
    },
  } = useMst();

  const [headerColumnId, setHeaderColumnId] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [tableHeaderIndex, setTableHeaderIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const [, setColumnPiningState] = useState(defaultColumnPining(orderColumns));

  const columnPiningConfig = pinLeftColumns;

  const onPageSizeChange = async (pageSize: number) => {
    queryModel.updatePage(page.number, pageSize);
  };

  const onPageChange = async (currentPage: number) => {
    queryModel.updatePage(currentPage, page.size);
  };

  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string; color: string }>
  >([]);

  const { loading } = useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.YOULAND) {
      return;
    }
    const { data } = await _fetchInvestorData({
      investorName: TableTypeEnum.youland,
    });
    const temp = data.reduce(
      (acc, cur) => {
        acc.push({
          label: cur.investorName,
          value: cur.investorName,
          key: cur.id,
          bgColor: cur.bgColor,
          color: cur.color,
        });
        return acc;
      },
      [] as Array<Option & { bgColor: string; color: string }>,
    );
    temp.unshift({
      label: 'None',
      value: 'None',
      key: null,
      bgColor: 'transparent',
      color: 'rgba(0,0,0,.87)',
    });
    setInvestorData(temp);
  }, [displayType]);

  const { data, isLoading, mutate } = useSWR(
    displayType === PortfolioGridTypeEnum.YOULAND
      ? [
          {
            ...queryModel,
            searchCondition: {
              ...queryModel.searchCondition,
              investors: [...queryModel.searchCondition.investors],
              repaymentStatusList: [
                ...queryModel.searchCondition.repaymentStatusList,
              ],
              tradeStatus: [...queryModel.searchCondition.tradeStatus],
              prospectiveBuyer: [
                ...queryModel.searchCondition.prospectiveBuyers,
              ],
            },
            sort:
              queryModel.sort.length === 1 ? [...queryModel.sort] : defaultSort,
          },
          displayType,
        ]
      : null,
    async ([p]) => {
      return await _fetchYoulandTableData(p);
    },
    {
      revalidateOnFocus: true,
    },
  );

  const footerData = {
    initialLoanAmount: data?.data?.initialLoanAmount,
    totalItems: data?.data?.totalItems,
    totalLoanAmount: data?.data?.totalLoanAmount,
    weightedAverageMargin: data?.data?.weightedAverageMargin,
    weightedAverageSheet: data?.data?.weightedAverageSheet,
  };

  const page = {
    number: data?.data?.page?.number ?? 0,
    size: data?.data?.page?.size ?? 50,
    totalElements: data?.data?.page?.totalElements ?? 0,
    totalPages: data?.data?.page?.totalPages ?? 0,
  };

  const configColumnsOrderKeysArr = orderColumns?.length
    ? transferOrderColumnsKeys(orderColumns)
    : [];

  configColumnsOrderKeysArr.unshift('action');

  const configColumns = useMemo(() => {
    const target = YOULAND_COLUMNS(async () => await mutate(), investorData);
    return orderColumns.length ? resortColumns(orderColumns, target) : target;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configColumnsOrderKeysArr.join(''), loading]);

  const table = useMaterialReactTable({
    columns: configColumns,
    data: data?.data?.content || [],
    enableExpandAll: false,
    enableExpanding: false,
    enableSorting: false,
    enableBottomToolbar: false,
    paginateExpandedRows: false,
    enableTopToolbar: false,
    enableGrouping: false,

    enableRowVirtualization: true,
    enableRowActions: false,
    enableColumnActions: false,
    enableColumnOrdering: false,
    enableColumnDragging: false,
    enableColumnResizing: true,
    enableColumnVirtualization: true,
    enableColumnPinning: true,

    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: 140,
      size: 250,
    },

    manualPagination: true,
    state: {
      columnOrder: configColumnsOrderKeysArr,
      showSkeletons: isLoading || loading,
      columnPinning: { left: columnPiningConfig },
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.loanId,
    rowVirtualizerOptions: { overscan: 5 },
    columnVirtualizerOptions: { overscan: 5 },

    renderEmptyRowsFallback: () => {
      return (
        <Stack pl={8} pt={4} width={'100%'}>
          <Typography color={'text.secondary'} mt={1.5} variant={'subtitle2'}>
            No recorded transactions
          </Typography>
        </Stack>
      );
    },
    muiTableContainerProps: {
      style: {
        maxHeight: 'calc(100vh - 236px)',
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
    muiTableBodyCellProps: ({ row }) => {
      return {
        async onClick() {
          if (isLoading) {
            return;
          }
          window.open(
            `/loan/overview/?loanId=${row.original.loanId}`,
            '_blank',
          );
        },
      };
    },
    muiTableBodyRowProps: {
      sx: {
        boxShadow: 'none',
        '& td': {
          height: 32,
          py: 0,
          px: 1.5,
          borderRight: '1px solid',
          borderBottom: '1px solid',
          borderColor: '#EDF1FF',
          '&:last-of-type': {
            borderRight: 'none',
            px: 0,
          },
        },
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
  });

  const columnSizing: Record<string, number> = table.getState().columnSizing;
  const columnPining = table.getState().columnPinning;

  const [, setColumnWidth] = useAsyncFn(async (result: SetColumnWidthParam) => {
    await _setColumnWidth(result).catch(({ message, variant, header }) => {
      enqueueSnackbar(message, {
        variant,
        isSimple: !header,
        header,
      });
    });
  }, []);

  const [, updateColumnPining] = useAsyncFn(
    async (param: UpdateColumnPiningParamType) => {
      await _setColumnPining({
        pageColumn: PortfolioGridTypeEnum.YOULAND,
        ...param,
      });
    },
    [columnPining],
  );

  useDebounce(
    async () => {
      if (Object.keys(columnSizing).length) {
        // handle column sizing
        await setColumnWidth({
          pageColumn: PortfolioGridTypeEnum.YOULAND,
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
    <Stack>
      <MRT_TableContainer sx={{ height: '100%' }} table={table} />
      <GridYoulandFooter
        footerData={footerData}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={page}
      />
      <ColumnsHeaderMenus
        anchorEl={anchorEl}
        handleFreeze={() => {
          setColumnPiningState({
            left: configColumns
              .slice(0, tableHeaderIndex)
              .map((item) => item.accessorKey) as string[],
          });
          updatePinLeftColumns(
            configColumns
              .slice(0, tableHeaderIndex)
              .map((item) => item.accessorKey) as string[],
          );
        }}
        handleSort={() => {
          queryModel.updateSort([
            {
              property: headerColumnId, // .id as string,
              direction: SortDirection.DESC,
              ignoreCase: true,
              label: headerTitle as string,
            },
          ] as ISortItemModel[]);
        }}
        handleUnfreeze={async () => {
          // setColumnPiningState({ left: [] });
          updatePinLeftColumns([]);
          await updateColumnPining({
            leftColumn: [],
            rightColumn: [],
          });
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
      />
    </Stack>
  );
});
