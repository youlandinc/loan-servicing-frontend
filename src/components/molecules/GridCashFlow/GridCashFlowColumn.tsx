import React from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { Stack, Typography } from '@mui/material';

import { utils } from '@/utils';
import { REPAYMENT_STATUS_OPTIONS } from '@/constant';
import { ellipsisStyle } from '@/styles';

import {
  allLoansStatusBgcolor,
  allLoansStatusColor,
} from '@/styles/allLoansGridStyles';

import { GridDropDown } from '@/components/molecules';

export const GridCashFlowColumn = () => {
  const columns: MRT_ColumnDef<any>[] = [
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
            //cb={cb}
            colorPalette={allLoansStatusColor}
            loanId={row.original.loanId}
            options={REPAYMENT_STATUS_OPTIONS}
            paramsKey={'repaymentStatus'}
            status={renderedCellValue ? (renderedCellValue as string) : '-'}
            tableData={row.original}
          />
        );
      },
    },
    {
      header: 'Submit date',
      accessorKey: 'submitDate',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 140,
      minSize: 140,
      Cell: ({ renderedCellValue }) => {
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
      accessorKey: 'propertyFullAddress',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'left' },
      size: 300,
      Cell: ({ renderedCellValue }) => {
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
      header: 'Est. sale date',
      accessorKey: 'estSaleDate',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 140,
      Cell: ({ renderedCellValue }) => {
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
      Cell: ({ renderedCellValue }) => {
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
      header: 'Note rate',
      accessorKey: 'interestRate',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 120,
      Cell: ({ renderedCellValue }) => {
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
      Cell: ({ renderedCellValue }) => {
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
      Cell: ({ renderedCellValue }) => {
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
      Cell: ({ renderedCellValue }) => {
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
  ];

  return columns.reduce((acc, cur: any, index) => {
    if (!cur) {
      return acc;
    }
    const target = {
      ...cur,
      Cell: (props: any) => {
        const { row } = props;
        if (row.original.servicingLoans) {
          return (
            index === 0 && (
              <Typography
                sx={{ whiteSpace: 'nowrap', textIndent: 8 }}
                variant={'subtitle2'}
                width={'100%'}
              >
                {row.original.groupById}
                <Typography
                  color={'#E39F15'}
                  component={'span'}
                  ml={3}
                  variant={'subtitle2'}
                >
                  Total loan amount:{' '}
                  <b>{utils.formatDollar(row.original.currentTotalAmount)}</b>
                </Typography>
                <Typography
                  color={'#E39F15'}
                  component={'span'}
                  ml={3}
                  variant={'subtitle2'}
                >
                  Number of loans:{' '}
                  <b>{row.original.currentTotalItems ?? '-'}</b>
                </Typography>
              </Typography>
            )
          );
        }
        return cur.Cell(props);
      },
    };
    acc.push(target as MRT_ColumnDef<any>);
    return acc;
  }, [] as MRT_ColumnDef<any>[]);
};
