import { MRT_ColumnDef } from 'material-react-table';
import { Tooltip, Typography } from '@mui/material';
import { utils } from '@/utils';
import { ellipsisStyle } from '@/styles';
import { GridDropDown } from '@/components/molecules';
import {
  allLoansStatusBgcolor,
  allLoansStatusColor,
} from '@/styles/allLoansGridStyles';
import {
  REPAYMENT_STATUS_OPTIONS,
  TRADE_STATUS_BGCOLOR_PALETTE,
  TRADE_STATUS_OPTIONS,
} from '@/constant';

export const ALAMEDA_COLUMNS: MRT_ColumnDef<any>[] = [
  {
    header: 'Status',
    accessorKey: 'repaymentStatus',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 140,
    minSize: 140,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <GridDropDown
          bgPalette={allLoansStatusBgcolor}
          colorPalette={allLoansStatusColor}
          options={REPAYMENT_STATUS_OPTIONS}
          status={renderedCellValue ? (renderedCellValue as string) : '-'}
        />
      );
    },
  },
  {
    header: 'Submit date',
    accessorKey: 'submitDate',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 120,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {utils.formatDate(renderedCellValue as string)}
        </Typography>
      );
    },
  },
  {
    header: 'Property address',
    accessorKey: 'propertyAddress',
    muiTableHeadCellProps: { align: 'center' },
    muiTableBodyCellProps: { align: 'left' },
    size: 300,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {renderedCellValue ? renderedCellValue : '-'}
        </Typography>
      );
    },
  },
  {
    header: 'Est sale date',
    accessorKey: 'estSaleDate',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 140,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {utils.formatDate(renderedCellValue as string)}
        </Typography>
      );
    },
  },
  {
    header: 'Investor',
    accessorKey: 'investor',
    muiTableHeadCellProps: { align: 'center' },
    muiTableBodyCellProps: { align: 'left' },
    size: 146,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {renderedCellValue ? renderedCellValue : '-'}
        </Typography>
      );
    },
  },
  {
    header: 'Prospective buyer',
    accessorKey: 'prospectiveBuyer',
    muiTableHeadCellProps: { align: 'center' },
    muiTableBodyCellProps: { align: 'center' },
    size: 146,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {renderedCellValue} component
        </Typography>
      );
    },
  },
  {
    header: 'Trade status',
    accessorKey: 'tradeStatus',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 160,
    minSize: 160,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <GridDropDown
          bgPalette={TRADE_STATUS_BGCOLOR_PALETTE}
          options={TRADE_STATUS_OPTIONS}
          status={renderedCellValue ? (renderedCellValue as string) : '-'}
        />
      );
    },
  },
  {
    header: 'Interest Rate',
    accessorKey: 'interestRate',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 120,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {utils.formatPercent(renderedCellValue as number, 2)}
        </Typography>
      );
    },
  },
  {
    header: 'Loan amount',
    accessorKey: 'totalLoanAmount',
    muiTableHeadCellProps: { align: 'center' },
    muiTableBodyCellProps: { align: 'left' },
    size: 116,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {utils.formatDollar(renderedCellValue as number)}
        </Typography>
      );
    },
  },
  {
    header: 'Buy rate',
    accessorKey: 'buyRate',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 160,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {utils.formatPercent(renderedCellValue as number, 2)}
        </Typography>
      );
    },
  },
  {
    header: 'Originator spread',
    accessorKey: 'originatorSpread',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 200,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {utils.formatPercent(renderedCellValue as number, 2)}
        </Typography>
      );
    },
  },
  {
    header: '',
    accessorKey: 'tradeConfirm',
    muiTableBodyCellProps: { align: 'center' },
    muiTableHeadCellProps: { align: 'center' },
    size: 200,
    grow: true,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <Typography
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
          variant={'body3'}
        >
          {renderedCellValue} component
        </Typography>
      );
    },
  },
];
