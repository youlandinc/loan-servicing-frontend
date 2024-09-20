import { useState } from 'react';

import { MRT_ColumnDef } from 'material-react-table';
import { Button, Stack, Typography } from '@mui/material';
import { ellipsisStyle } from '@/styles';
import { utils } from '@/utils';

import {
  REPAYMENT_STATUS_OPTIONS,
  TRADE_STATUS_BGCOLOR_PALETTE,
  TRADE_STATUS_OPTIONS,
} from '@/constant';

import { GridDropDown } from '@/components/molecules';

import {
  allLoansStatusBgcolor,
  allLoansStatusColor,
} from '@/styles/allLoansGridStyles';
import {
  GridTradeConfirmEnum,
  GridTradeStatusEnum,
} from '@/types/pipeline/youland';
import { useSwitch } from '@/hooks';
import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
} from '@/components/atoms';
import { GridDropDownButton } from '@/components/molecules/Common/GridDropDownButton';

export const YOULAND_COLUMNS = (
  cb?: () => Promise<void>,
  investorOptions?: Array<Option & { bgColor: string }>,
) => {
  return [
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
            cb={cb}
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
          <GridDropDownButton
            cb={cb}
            loanId={row.original.loanId}
            options={investorOptions}
            paramsKey={'prospectiveBuyer'}
            status={renderedCellValue as string | null}
          />
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
            cb={cb}
            loanId={row.original.loanId}
            options={TRADE_STATUS_OPTIONS}
            paramsKey={'tradeStatus'}
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
        const { visible, close, open } = useSwitch(false);
        const [date, setDate] = useState<Date | null>(null);
        return (
          <>
            <Button
              color={'primary'}
              disabled={
                renderedCellValue !== GridTradeConfirmEnum.confirmed ||
                row.original.tradeStatus !== GridTradeStatusEnum.confirmed
              }
              onClick={open}
              sx={{
                fontSize: 12,
                width: 120,
                height: 26,
                p: '0 !important',
                textTransform: 'none',
                boxShadow: 'none',
              }}
              variant={'contained'}
            >
              Complete trade
            </Button>
            <StyledDialog
              content={
                <Stack gap={3} py={3}>
                  <Typography color={'text.secondary'} variant={'body2'}>
                    Please confirm the sale date below is correct before you
                    mark the trade as completed.
                  </Typography>
                  <StyledDatePicker
                    label={'Sale date'}
                    onChange={(value) => {
                      setDate(value);
                    }}
                    value={date}
                  />
                </Stack>
              }
              footer={
                <Stack flexDirection={'row'} gap={3}>
                  <StyledButton
                    color={'info'}
                    onClick={() => {
                      close();
                    }}
                    size={'small'}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    onClick={() => {
                      console.log(date);
                      close();
                    }}
                    size={'small'}
                  >
                    Confirm
                  </StyledButton>
                </Stack>
              }
              header={'Confirm sale date'}
              open={visible}
            />
          </>
        );
      },
    },
  ] as MRT_ColumnDef<any>[];
};
