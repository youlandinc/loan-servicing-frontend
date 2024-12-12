import React, { useCallback, useState } from 'react';
import { Button, Stack, Tooltip, Typography } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { format, isValid } from 'date-fns';
import { useSnackbar } from 'notistack';
import { MRT_ColumnDef } from 'material-react-table';

import {
  AUTO_HIDE_DURATION,
  REPAYMENT_STATUS_OPTIONS,
  TRADE_STATUS_BGCOLOR_PALETTE,
  TRADE_STATUS_OPTIONS,
} from '@/constant';

import { ellipsisStyle } from '@/styles';
import { utils } from '@/utils';
import { useSwitch } from '@/hooks';

import {
  allLoansStatusBgcolor,
  allLoansStatusColor,
} from '@/styles/allLoansGridStyles';
import {
  GridTradeConfirmEnum,
  GridTradeStatusEnum,
} from '@/types/pipeline/youland';

import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
  StyledTextFieldNumber,
} from '@/components/atoms';
import {
  GridActions,
  GridDropDown,
  GridDropDownButton,
} from '@/components/molecules';

import { _deleteGridData, _updateTableData } from '@/request';
import { HttpError } from '@/types/common';

import LOGO_DELETE from '@/svg/portfolio/logo-delete.svg';

export const ALAMEDA_COLUMNS = (
  cb?: () => Promise<any>,
  investorOptions?: Array<Option & { bgColor: string; color: string }>,
) => {
  return [
    {
      header: '',
      accessorKey: 'action',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 60,
      minSize: 60,
      Cell: ({ row }) => {
        const { enqueueSnackbar } = useSnackbar();
        const { visible, open, close } = useSwitch();

        const [anchorEl, setAnchorEl] = useState<null | Element>();
        const [loading, setLoading] = useState(false);

        const onClickToDelete = useCallback(async () => {
          setLoading(true);
          const postData = {
            loanId: row.original.loanId,
          };
          try {
            await _deleteGridData(postData);
            await cb?.();
          } catch (err) {
            const { header, message, variant } = err as HttpError;
            enqueueSnackbar(message, {
              variant: variant || 'error',
              autoHideDuration: AUTO_HIDE_DURATION,
              isSimple: !header,
              header,
            });
          } finally {
            setLoading(false);
            setAnchorEl(null);
            close();
          }
        }, [close, enqueueSnackbar, row.original.loanId]);

        return (
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            width={'100%'}
          >
            <MoreHoriz
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setAnchorEl(e.currentTarget);
              }}
              sx={{ fontSize: 24, cursor: 'pointer', color: '#202939' }}
            />
            <GridActions
              close={() => setAnchorEl(null)}
              open={Boolean(anchorEl)}
              options={[
                {
                  label: 'Delete',
                  key: 'Delete',
                  value: 'Delete',
                  icon: LOGO_DELETE,
                  action: () => open(),
                },
              ]}
              target={anchorEl}
            />
            <StyledDialog
              content={
                <Typography my={1.5} variant={'body2'}>
                  Please confirm you want to delete this loan from the Servicing
                  Center.
                </Typography>
              }
              footer={
                <Stack flexDirection={'row'} gap={3}>
                  <StyledButton
                    color={'info'}
                    onClick={() => {
                      setAnchorEl(null);
                      close();
                    }}
                    size={'small'}
                    sx={{ width: 110 }}
                    variant={'outlined'}
                  >
                    No, cancel
                  </StyledButton>
                  <StyledButton
                    color={'error'}
                    disabled={loading}
                    loading={loading}
                    onClick={onClickToDelete}
                    size={'small'}
                    sx={{ width: 110 }}
                  >
                    Yes, delete
                  </StyledButton>
                </Stack>
              }
              header={'Are you sure?'}
              open={visible}
            />
          </Stack>
        );
      },
    },
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
          />
        );
      },
    },
    {
      accessorKey: 'maturityDate',
      header: 'Maturity date',
      size: 140,
      minSize: 110,
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
      Cell: ({ renderedCellValue }) => {
        return (
          <Typography fontSize={12} sx={{ ...ellipsisStyle }}>
            {typeof renderedCellValue === 'string' &&
            isValid(new Date(renderedCellValue))
              ? format(new Date(renderedCellValue), 'MM/dd/yyyy')
              : '—'}
          </Typography>
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
      Cell: ({ renderedCellValue, row }) => {
        const { enqueueSnackbar } = useSnackbar();
        const { visible, close, open } = useSwitch(false);
        const [date, setDate] = useState<Date | null>(
          renderedCellValue ? new Date(renderedCellValue as string) : null,
        );
        const [updating, setUpdating] = useState(false);

        return (
          <Stack
            className={'edit-cell'}
            height={'100%'}
            justifyContent={'center'}
            mx={-1.5}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              open();
              return;
            }}
            sx={{
              '&:hover': {
                border: '1px solid rgba(144, 149, 163, 0.3)',
              },
              cursor: 'text',
            }}
            width={'calc(100% + 48px)'}
          >
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body3'}
            >
              {utils.formatDate(renderedCellValue as string)}
            </Typography>
            <StyledDialog
              aria-hidden="true"
              content={
                <Stack gap={3} py={3}>
                  <StyledDatePicker
                    disableFuture={false}
                    label={'Submit date'}
                    onChange={(value) => {
                      setDate(value);
                    }}
                    value={date}
                  />
                </Stack>
              }
              footer={
                <Stack flexDirection={'row'} gap={1.5}>
                  <StyledButton
                    color={'info'}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      close();
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    disabled={updating}
                    loading={updating}
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const postData = {
                        ...row.original,
                        loanId: row.original.loanId,
                        submitDate: isValid(date)
                          ? (date as Date).toISOString()
                          : null,
                      };
                      setUpdating(true);
                      try {
                        await _updateTableData(postData);
                        await cb?.();
                      } catch (err) {
                        const { header, message, variant } = err as HttpError;
                        enqueueSnackbar(message, {
                          variant: variant || 'error',
                          autoHideDuration: AUTO_HIDE_DURATION,
                          isSimple: !header,
                          header,
                        });
                      } finally {
                        setUpdating(false);
                        close();
                      }
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                  >
                    Confirm
                  </StyledButton>
                </Stack>
              }
              header={'Submit date'}
              onClose={(e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                close();
              }}
              open={visible}
              scroll={'body'}
            />
          </Stack>
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
          <Tooltip title={renderedCellValue ? renderedCellValue : '-'}>
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body3'}
            >
              {renderedCellValue ? renderedCellValue : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      header: 'Est. sale date',
      accessorKey: 'estSaleDate',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 140,
      minSize: 140,
      Cell: ({ renderedCellValue, row }) => {
        const { enqueueSnackbar } = useSnackbar();
        const { visible, close, open } = useSwitch(false);
        const [date, setDate] = useState<Date | null>(
          renderedCellValue ? new Date(renderedCellValue as string) : null,
        );
        const [updating, setUpdating] = useState(false);

        return (
          <Stack
            className={'edit-cell'}
            height={'100%'}
            justifyContent={'center'}
            mx={-1.5}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              open();
              return;
            }}
            sx={{
              '&:hover': {
                border: '1px solid rgba(144, 149, 163, 0.3)',
              },
              cursor: 'text',
            }}
            width={'calc(100% + 48px)'}
          >
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body3'}
            >
              {utils.formatDate(renderedCellValue as string)}
            </Typography>
            <StyledDialog
              aria-hidden="true"
              content={
                <Stack gap={3} py={3}>
                  <StyledDatePicker
                    disableFuture={false}
                    label={'Est. sale date'}
                    onChange={(value) => {
                      setDate(value);
                    }}
                    value={date}
                  />
                </Stack>
              }
              footer={
                <Stack flexDirection={'row'} gap={1.5}>
                  <StyledButton
                    color={'info'}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      close();
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    disabled={updating}
                    loading={updating}
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const postData = {
                        ...row.original,

                        loanId: row.original.loanId,
                        estSaleDate: isValid(date)
                          ? (date as Date).toISOString()
                          : null,
                      };
                      setUpdating(true);
                      try {
                        await _updateTableData(postData);
                        await cb?.();
                      } catch (err) {
                        const { header, message, variant } = err as HttpError;
                        enqueueSnackbar(message, {
                          variant: variant || 'error',
                          autoHideDuration: AUTO_HIDE_DURATION,
                          isSimple: !header,
                          header,
                        });
                      } finally {
                        setUpdating(false);
                        close();
                      }
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                  >
                    Confirm
                  </StyledButton>
                </Stack>
              }
              header={'Est. sale date'}
              onClose={(e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                close();
              }}
              open={visible}
              scroll={'body'}
            />
          </Stack>
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
            originalData={row.original}
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
      header: 'Interest rate',
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
      Cell: ({ renderedCellValue, row }) => {
        const { enqueueSnackbar } = useSnackbar();
        const { visible, close, open } = useSwitch(false);
        const [value, setValue] = useState<string | number | undefined>(
          utils.notNull(row.original.buyRate)
            ? row.original.buyRate
            : undefined,
        );
        const [updating, setUpdating] = useState(false);

        return (
          <Stack
            className={'edit-cell'}
            height={'100%'}
            justifyContent={'center'}
            mx={-1.5}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              open();
              return;
            }}
            sx={{
              '&:hover': {
                border: '1px solid rgba(144, 149, 163, 0.3)',
              },
              cursor: 'text',
            }}
            width={'calc(100% + 48px)'}
          >
            <Typography
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body3'}
            >
              {utils.formatPercent(renderedCellValue as number)}
            </Typography>
            <StyledDialog
              aria-hidden="true"
              content={
                <Stack gap={3} py={3}>
                  <StyledTextFieldNumber
                    label={'Buy rate'}
                    onValueChange={({ floatValue }) => setValue(floatValue)}
                    suffix={'%'}
                    value={value}
                  />
                </Stack>
              }
              footer={
                <Stack flexDirection={'row'} gap={1.5}>
                  <StyledButton
                    color={'info'}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      close();
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    disabled={updating}
                    loading={updating}
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const postData = {
                        ...row.original,

                        loanId: row.original.loanId,
                        buyRate: typeof value === 'number' ? value : null,
                      };
                      setUpdating(true);
                      try {
                        await _updateTableData(postData);
                        await cb?.();
                      } catch (err) {
                        const { header, message, variant } = err as HttpError;
                        enqueueSnackbar(message, {
                          variant: variant || 'error',
                          autoHideDuration: AUTO_HIDE_DURATION,
                          isSimple: !header,
                          header,
                        });
                      } finally {
                        setUpdating(false);
                        close();
                      }
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                  >
                    Confirm
                  </StyledButton>
                </Stack>
              }
              header={'Buy rate'}
              onClose={(e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                close();
              }}
              open={visible}
              scroll={'body'}
            />
          </Stack>
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
    {
      header: 'Actions',
      accessorKey: 'tradeConfirm',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 200,
      Cell: ({ renderedCellValue, row }) => {
        const { enqueueSnackbar } = useSnackbar();
        const { visible, close, open } = useSwitch(false);
        const [date, setDate] = useState<Date | null>(
          row.original.estSaleDate
            ? new Date(row.original.estSaleDate as string)
            : null,
        );
        const [updating, setUpdating] = useState(false);

        return (
          <Stack
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              return;
            }}
            width={'100%'}
          >
            {!row.original.prospectiveBuyer ||
            row.original.prospectiveBuyer === 'None' ||
            renderedCellValue === GridTradeConfirmEnum.completed ||
            row.original.tradeStatus !== GridTradeStatusEnum.confirmed ? (
              <Tooltip
                arrow
                title={
                  'There must be a prospective investor and trade status has to be either "In Progress" or "Confirmed" in order to complete the trade.'
                }
              >
                <Stack
                  alignItems={'center'}
                  bgcolor={'rgba(0, 0, 0, 0.12)'}
                  borderRadius={1}
                  color={'rgba(0, 0, 0, 0.26)'}
                  fontSize={12}
                  height={26}
                  justifyContent={'center'}
                  width={120}
                >
                  Complete trade
                </Stack>
              </Tooltip>
            ) : (
              <Button
                color={'primary'}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  open();
                }}
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
            )}

            <StyledDialog
              aria-hidden="true"
              content={
                <Stack gap={3} py={3}>
                  <Typography color={'text.secondary'} variant={'body2'}>
                    Please confirm the sale date below is correct before you
                    mark the trade as completed.
                  </Typography>
                  <StyledDatePicker
                    disableFuture={false}
                    label={'Sale date'}
                    onChange={(value) => {
                      setDate(value);
                    }}
                    value={date}
                  />
                </Stack>
              }
              footer={
                <Stack flexDirection={'row'} gap={1.5}>
                  <StyledButton
                    color={'info'}
                    onClick={() => {
                      close();
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    disabled={updating}
                    loading={updating}
                    onClick={async () => {
                      const postData = {
                        ...row.original,

                        loanId: row.original.loanId,
                        estSaleDate: isValid(date)
                          ? (date as Date).toISOString()
                          : null,
                        tradeConfirm: GridTradeConfirmEnum.completed,
                      };
                      setUpdating(true);
                      try {
                        await _updateTableData(postData);
                        await cb?.();
                      } catch (err) {
                        const { header, message, variant } = err as HttpError;
                        enqueueSnackbar(message, {
                          variant: variant || 'error',
                          autoHideDuration: AUTO_HIDE_DURATION,
                          isSimple: !header,
                          header,
                        });
                      } finally {
                        setUpdating(false);
                        close();
                      }
                    }}
                    size={'small'}
                    sx={{
                      width: 82,
                    }}
                  >
                    Confirm
                  </StyledButton>
                </Stack>
              }
              header={'Confirm sale date'}
              onClose={(e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                close();
              }}
              open={visible}
            />
          </Stack>
        );
      },
    },
  ] as MRT_ColumnDef<any>[];
};
