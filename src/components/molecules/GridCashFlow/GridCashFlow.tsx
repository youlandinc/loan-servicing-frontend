import React, { CSSProperties, FC, useState } from 'react';
import router from 'next/router';
import { Stack, Typography } from '@mui/material';
import { ExpandMore, KeyboardDoubleArrowDown } from '@mui/icons-material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constant';

import {
  GridCashFlowItem,
  GridCashFlowSummaryProps,
  ResponseGridCashFlowTable,
} from '@/types/pipeline/youland';
import { PortfolioGridTypeEnum } from '@/types/enum';
import { HttpError } from '@/types/common';
import { _fetchCashFlowTableData } from '@/request';

import { GridCashFlowColumn, GridCashFlowFooter } from './index';
import { getCoreRowModel } from '@tanstack/table-core';

const mock = [
  {
    loanId: 1,
    repaymentStatus: null,
    submitDate: null,
    propertyFullAddress: null,
    estSaleDate: null,
    investor: null,
    tradeConfirm: null,
    tradeStatus: null,
    interestRate: null,
    totalLoanAmount: null,
    buyRate: null,
    originatorSpread: null,
  },
];

export const GridCashFlow: FC = observer(() => {
  const {
    portfolio: { displayType },
  } = useMst();
  const { enqueueSnackbar } = useSnackbar();

  const { loading } = useAsync(async () => await fetchData(), [displayType]);

  const fetchData = async () => {
    if (displayType !== PortfolioGridTypeEnum.CASH_FLOW) {
      return;
    }
    const postData = {};
    setFetchLoading(true);
    try {
      const {
        data: {
          content,
          totalItems,
          totalLoanAmount,
          weightedAverageMargin,
          weightedAverageSheet,
        },
      } = await _fetchCashFlowTableData(postData);
      setTableData(content);
      setFooterData({
        totalItems,
        totalLoanAmount,
        weightedAverageMargin,
        weightedAverageSheet,
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const [fetchLoading, setFetchLoading] = useState(false);
  const [tableData, setTableData] =
    useState<Array<Partial<GridCashFlowItem>>>(mock);
  const [footerData, setFooterData] = useState<GridCashFlowSummaryProps>({
    totalItems: 5,
    totalLoanAmount: 50000,
    weightedAverageMargin: 0,
    weightedAverageSheet: 10,
  });

  const table = useMaterialReactTable({
    columns: GridCashFlowColumn(),
    data: tableData || [],
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
    getCoreRowModel: getCoreRowModel(),
    state: {
      //columnOrder: columnOrder || [],
      // isLoading: isValidating,
      showSkeletons: loading,
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

    icons: {
      KeyboardDoubleArrowDownIcon: (props: { style: CSSProperties }) => {
        const { style } = props;

        const transformValue =
          style.transform === 'rotate(-180deg)'
            ? 'rotate(0deg)'
            : 'rotate(-90deg)';
        return (
          <KeyboardDoubleArrowDown
            style={{
              ...style,
              transform: transformValue,
            }}
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
          <ExpandMore
            style={{
              ...style,
              transform: transformValue,
            }}
            sx={{ fontSize: 20 }}
          />
        );
      },
    },
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
        '& .MuiTableCell-root:first-of-type': {
          width: 40,
          minWidth: 40,
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
        e.stopPropagation();
        if (props.column.id === 'mrt-row-expand') {
          return;
        }
        //handleHeaderClick?.(e, props.column);
      },
    }),
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
    muiExpandAllButtonProps: (props) => {
      return {
        title: '',
        onClick: () => {},
      };
    },
    muiExpandButtonProps: {
      sx: {
        width: 20,
        height: 20,
      },
      title: '',
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        //handleExpandClick();
      },
    },
  });

  return (
    <Stack>
      <MRT_TableContainer sx={{ height: '100%' }} table={table} />
      <GridCashFlowFooter footerData={footerData} />
    </Stack>
  );
});
