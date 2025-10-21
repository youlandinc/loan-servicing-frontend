import { CSSProperties, FC, useCallback, useState } from 'react';
import { Drawer, Icon, Stack, Tooltip, Typography } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import {
  MRT_ColumnDef,
  MRT_TableContainer,
  useMaterialReactTable,
} from 'material-react-table';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { isValid } from 'date-fns';

import { utils } from '@/utils';
import { AUTO_HIDE_DURATION, PAYMENT_METHODS_OPTIONS } from '@/constant';
import { ellipsisStyle } from '@/styles';

import {
  StyledButton,
  StyledCheckbox,
  StyledDatePicker,
  StyledDialog,
  StyledSelect,
  StyledTextFieldNumber,
} from '@/components/atoms';

import { GridActions, LoanPaymentsGridFooter } from '@/components/molecules';

import { HttpError } from '@/types/common';
import {
  _deletePaymentData,
  _fetchCurrentBill,
  _fetchNumberOfDraw,
  _fetchPaymentsHistory,
  _updateOrCreatePaymentData,
} from '@/request/loan/payments';
import {
  AbutmentSources,
  PaymentHistoryItem,
  PaymentMethod,
  PaymentTypeEnum,
} from '@/types/loan/payments';
import { LoanAnswerEnum } from '@/types/enum';
import { useSwitch } from '@/hooks';

//import TABLE_NO_RESULT from '@/svg/loan/table-no-result.svg';
import LOGO_CLOSE from '@/svg/loan/payments/logo-close.svg';
import LOGO_EDIT from '@/svg/loan/payments/logo-edit.svg';
import LOGO_DELETE from '@/svg/portfolio/logo-delete.svg';
import LOGO_VIEW_ALL from '@/svg/loan/payments/logo-view-all.svg';

import {
  OverviewRepaymentTimeLine,
  PaidStatusEnum,
} from '@/types/loan/overview';

interface PaymentFormDataProps {
  id: string | number | undefined;
  dataReceivedTime: string | null | Date;
  dateDue: string;
  paymentMethod: PaymentMethod | undefined;
  defaultInterestReceived: number | undefined;
  lateChargesPaid: number | undefined;
  waivedLateCharges: number | undefined;
  nsf: LoanAnswerEnum;
  principalReceived: number | undefined;
  reservePmt: number | undefined;
}

const PAYMENT_FORM_DATA = {
  dataReceivedTime: null,
  dateDue: '',
  paymentMethod: PaymentMethod.ach,
  defaultInterestReceived: undefined,
  lateChargesPaid: undefined,
  waivedLateCharges: undefined,
  nsf: LoanAnswerEnum.no,
  id: undefined,
  principalReceived: undefined,
  reservePmt: undefined,
};

interface DrawFormDataProps {
  id: undefined;
  fundingDate: string | null | Date;
  recommendedDraw: number | undefined;
  inspectionFee: number | undefined;
  wireFee: number | undefined;
  drawNumber: number | undefined;
}

const DRAW_FORM_DATA = {
  id: undefined,
  fundingDate: null,
  recommendedDraw: undefined,
  inspectionFee: undefined,
  wireFee: undefined,
  drawNumber: undefined,
};

export const LoanPaymentsGrid: FC<{
  maxHeight?: CSSProperties['maxHeight'];
  cb?: () => Promise<void>;
  showPagination?: boolean;
}> = ({ maxHeight, cb, showPagination = true }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const fetchDueDate = async () => {
    const { loanId } = utils.getParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const { data } = await _fetchCurrentBill({ loanId });
      setOriginalDateDueOpts(
        (data as OverviewRepaymentTimeLine[]).map((item) => ({
          label: item.formatterDateDue,
          value: item.dateDue,
          key: item.dateDue,
        })),
      );
      const handler = (arr: OverviewRepaymentTimeLine[]) => {
        if (arr.length <= 0) {
          return '';
        }
        const unpaidItem = arr.find(
          (item) => item.paidStatus === PaidStatusEnum.unpaid,
        );
        return unpaidItem ? unpaidItem.dateDue : arr[arr.length - 1].dateDue;
      };

      setDateDueOpts(
        (data as OverviewRepaymentTimeLine[])
          .filter((item) => item.paidStatus === PaidStatusEnum.unpaid)
          .map((item) => ({
            label: item.formatterDateDue,
            value: item.dateDue,
            key: item.dateDue,
          })),
      );
      setDateDue(handler(data));
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };
  const fetchData = async (page: number, size: number) => {
    const { loanId } = utils.getParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    const postData = {
      loanId,
      page,
      size,
    };
    setFetchLoading(true);
    try {
      const { data } = await _fetchPaymentsHistory(postData);
      setIsEditable(
        [AbutmentSources.alameda, AbutmentSources.youland].includes(
          data.abutmentSources,
        ),
      );

      const last = {
        dataReceivedTime: `Total (${data.totalItem} row${
          data.totalItem > 1 ? 's' : ''
        })`,
        totalPmt: data.accumulateTotalPmt,
        totalInterestReceived: data.accumulateTotalInterestReceived,
        //defaultInterestReceived: data.accumulateDefaultInterestReceived,
        //interestRateReceived: data.accumulateInterestRateReceived,
        principalReceived: data.accumulatePrincipalReceived,
        accruedLateCharges: data.accumulateAccruedLateCharges,
        waivedLateCharges: data.accumulateWaivedLateCharges,
        reservePmt: data.accumulateReservePmt,
        reserveRestricted: data.accumulateReserveRestricted,
        drawNumber: data.accumulateDrawNumber,
        id: '-1',
      };

      const list = data?.content || [];

      if (list.length > 0) {
        list.push(last);
        table.setRowSelection({ '-1': true });
        table.setRowPinning({ bottom: ['-1'] });
      }

      setList(list);

      setPage({
        number: data.page.number + 1,
        size: data.page.size,
        totalElements: data.page.totalElements,
        totalPages: data.page.totalPages,
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

  const { loading } = useAsync(async () => {
    await fetchData(0, showPagination ? 50 : 1000);
  }, []);
  useAsync(async () => await fetchDueDate(), []);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [editLoading, setEditLoading] = useState(false);

  const {
    open: openPayment,
    close: closePayment,
    visible: visiblePayment,
  } = useSwitch(false);
  const {
    open: openDraw,
    close: closeDraw,
    visible: visibleDraw,
  } = useSwitch(false);

  const [dateDue, setDateDue] = useState('');
  const [dateDueOpts, setDateDueOpts] = useState<Option[]>([]);
  const [originalDateDueOpts, setOriginalDateDueOpts] = useState<Option[]>([]);
  const [paymentAction, setPaymentAction] = useState<
    'addPayment' | 'editPayment'
  >('addPayment');
  const [paymentFormData, setPaymentFormData] =
    useState<PaymentFormDataProps>(PAYMENT_FORM_DATA);

  const onClickToClosePayment = useCallback(() => {
    closePayment();
    setPaymentFormData(PAYMENT_FORM_DATA);
  }, [closePayment]);
  const onClickToSavePayment = useCallback(
    async () => {
      const postData = {
        id: paymentFormData.id,
        dataReceivedTime: (
          paymentFormData.dataReceivedTime as Date
        ).toISOString(),
        dateDue: paymentFormData?.dateDue
          ? paymentFormData.dateDue === 'NO_DATE'
            ? undefined
            : paymentFormData.dateDue
          : dateDue === 'NO_DATE'
            ? undefined
            : dateDue,
        paymentMethod: paymentFormData.paymentMethod,
        defaultInterestReceived: paymentFormData.defaultInterestReceived,
        lateChargesPaid: paymentFormData.lateChargesPaid,
        waivedLateCharges: paymentFormData.waivedLateCharges,
        nsf: paymentFormData.nsf,
        loanId: utils.getParamsFromUrl(location.href).loanId as string,
        paymentType: PaymentTypeEnum.reg_pmt,
        principalReceived: paymentFormData.principalReceived,
        reservePmt: paymentFormData.reservePmt,
      };
      setEditLoading(true);
      try {
        await _updateOrCreatePaymentData(postData);
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
        setEditLoading(false);
        onClickToClosePayment();
        await fetchDueDate();
        await fetchData(0, 50);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      paymentFormData.id,
      paymentFormData.dataReceivedTime,
      paymentFormData.dateDue,
      paymentFormData.paymentMethod,
      paymentFormData.defaultInterestReceived,
      paymentFormData.lateChargesPaid,
      paymentFormData.waivedLateCharges,
      paymentFormData.nsf,
      paymentFormData.principalReceived,
      paymentFormData.reservePmt,
      dateDue,
      enqueueSnackbar,
      onClickToClosePayment,
    ],
  );

  const [drawAction, setDrawAction] = useState<'editDraw' | 'addDraw'>(
    'addDraw',
  );
  const [drawFormData, setDrawFormData] =
    useState<DrawFormDataProps>(DRAW_FORM_DATA);

  const onClickToCloseDraw = useCallback(() => {
    closeDraw();
    setDrawFormData(DRAW_FORM_DATA);
  }, [closeDraw]);
  const onClickToSaveDraw = useCallback(
    async () => {
      const postData = {
        id: drawFormData.id,
        fundingDate: (drawFormData.fundingDate as Date).toISOString(),
        recommendedDraw: drawFormData.recommendedDraw,
        inspectionFee: drawFormData.inspectionFee,
        wireFee: drawFormData.wireFee,
        drawNumber: drawFormData.drawNumber,
        loanId: utils.getParamsFromUrl(location.href).loanId as string,
        paymentType: PaymentTypeEnum.funding,
      };
      setEditLoading(true);
      try {
        await _updateOrCreatePaymentData(postData);
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
        setEditLoading(false);
        onClickToCloseDraw();
        await fetchDueDate();
        await fetchData(0, 50);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      drawFormData.drawNumber,
      drawFormData.fundingDate,
      drawFormData.id,
      drawFormData.inspectionFee,
      drawFormData.recommendedDraw,
      drawFormData.wireFee,
      enqueueSnackbar,
      onClickToCloseDraw,
    ],
  );

  const [list, setList] = useState<Array<Partial<PaymentHistoryItem>>>([]);
  const [page, setPage] = useState({
    number: 1,
    size: 50,
    totalElements: 5,
    totalPages: 1,
  });

  const onPageSizeChange = async (pageSize: number) => {
    setPage((prev) => ({ ...prev, size: pageSize }));
    await fetchData(page.number - 1, pageSize);
  };

  const onPageChange = async (currentPage: number) => {
    setPage((prev) => ({ ...prev, number: currentPage }));
    await fetchData(currentPage - 1, page.size);
  };

  const table = useMaterialReactTable({
    columns: LOAN_PAYMENT_GRID_COLUMNS(
      isEditable,
      openPayment,
      setPaymentFormData,
      setPaymentAction,
      openDraw,
      setDrawFormData,
      setDrawAction,
      fetchData,
      cb,
    ),
    data: list,
    //data: temp,
    //rowCount: rowsTotal,
    enableExpandAll: false, //hide expand all double arrow in column header
    enableExpanding: false,
    enableSorting: false,
    enableBottomToolbar: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    paginateExpandedRows: true, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
    enableTopToolbar: false,
    enableGrouping: false,

    enableRowVirtualization: true,

    enableColumnActions: false, //pipelineType === PipelineDisplayMode.LIST_MODE,
    enableColumnOrdering: false,
    enableColumnDragging: false,
    enableColumnResizing: false,
    enableColumnVirtualization: true,

    enableRowPinning: true,
    rowPinningDisplayMode: 'select-bottom',

    defaultColumn: {
      grow: true,
    },

    manualPagination: true,
    state: {
      showSkeletons: fetchLoading || loading,
      columnOrder: isEditable ? ALAMEDA_YOULAND_ORDER : OTHER_ORDER,
    },
    initialState: {
      showProgressBars: false,
    },
    getRowId: (row) => row.id, //default
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
    muiTableHeadProps: {
      sx: {
        '& .MuiTableRow-root': {
          boxShadow: 'none !important',
          bgcolor: '#F4F6FA',
        },
      },
    },
    muiTableHeadCellProps: () => {
      return {
        sx: {
          px: 0,
          position: 'relative',
          boxShadow: 'none',
          fontWeight: 500,
          border: 'none',
          height: 40,
          '&:not(:last-of-type)': {
            '&:after': {
              display: 'block',
              content: "''",
              position: 'absolute',
              right: '1px',
              top: '50%',
              width: '1px',
              height: '18px',
              bgcolor: '#D2D6E1',
              transform: 'translateY(-50%)',
            },
          },
        },
      };
    },
    muiTableBodyRowProps: () => {
      return {
        sx: {
          boxShadow: 'none',
          '& td': {
            borderBottom: 'none !important',
          },
          '& .MuiTableCell-body': {
            p: 0.75,
            position: 'relative',
            '&:not(:last-of-type)': {
              '&:before': {
                display: 'block',
                content: "''",
                position: 'absolute',
                right: '1px',
                top: '50%',
                width: '1px',
                height: '18px',
                bgcolor: '#D2D6E1',
                transform: 'translateY(-50%)',
              },
            },
          },
          '&[data-pinned="true"]': {
            bgcolor: 'white !important',
            '& td': {
              fontWeight: '600 !important',
              '&:after,&:before': {
                bgcolor: 'transparent !important',
              },
              '&:before': {
                display: 'none',
              },
            },
          },
        },
      };
    },
  });

  return (
    <Stack
      flex={1}
      gap={isEditable ? 2 : 1.5}
      height={'auto'}
      maxHeight={maxHeight}
      width={'100%'}
    >
      <Stack
        alignItems={'flex-end'}
        flexDirection={'row'}
        pt={isEditable ? 2 : 3}
        px={3}
      >
        <Typography variant={'subtitle1'}>Payments</Typography>
        {!showPagination && (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            height={24}
            justifyContent={'center'}
            onClick={() => {
              router.push({
                pathname: '/loan/payments',
                query: { loanId: router.query.loanId },
              });
            }}
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              fontSize: 14,
              px: 1.5,
              gap: 0.5,
              ml: 3,
              '& path': {
                fill: 'rgba(0,0,0,.38)',
              },
              '&:hover': {
                color: 'text.primary',
                '& path': {
                  fill: 'rgba(0,0,0,.87)',
                },
              },
            }}
          >
            View all
            <Icon
              component={LOGO_VIEW_ALL}
              sx={{ width: 12, height: 12, mt: -0.25 }}
            />
          </Stack>
        )}
        {isEditable && (
          <Stack flexDirection={'row'} gap={3} mb={-1} ml={'auto'}>
            <StyledButton
              color={'info'}
              onClick={async () => {
                const { loanId } = utils.getParamsFromUrl(location.href);
                if (!loanId) {
                  return;
                }
                const { data } = await _fetchNumberOfDraw(loanId);
                setDrawFormData({
                  ...drawFormData,
                  drawNumber: data,
                });
                setDrawAction('addDraw');
                openDraw();
              }}
              sx={{
                fontSize: '14px !important',
                borderWidth: '1px !important',
                px: '16px !important',
                py: '8px solid !important',
                height: 'auto !important',
                borderRadius: '8px !important',
              }}
              variant={'outlined'}
            >
              Add draw
            </StyledButton>

            <StyledButton
              color={'info'}
              onClick={() => {
                setPaymentAction('addPayment');
                openPayment();
              }}
              sx={{
                fontSize: '14px !important',
                borderWidth: '1px !important',
                px: '16px !important',
                py: '8px solid !important',
                height: 'auto !important',
                borderRadius: '8px !important',
              }}
              variant={'outlined'}
            >
              Add payment
            </StyledButton>
            {/*<Stack*/}
            {/*  alignItems={'center'}*/}
            {/*  border={'1px solid'}*/}
            {/*  borderColor={'#D2D6E1'}*/}
            {/*  borderRadius={1}*/}
            {/*  fontSize={14}*/}
            {/*  justifyContent={'center'}*/}
            {/*  onClick={() => {*/}
            {/*    setDrawAction('addDraw');*/}
            {/*    openDraw();*/}
            {/*  }}*/}
            {/*  px={2}*/}
            {/*  py={1}*/}
            {/*  sx={{*/}
            {/*    border: '1px solid #D2D6E1',*/}
            {/*    borderRadius: 2,*/}
            {/*    cursor: 'pointer',*/}
            {/*    fontSize: 14,*/}
            {/*    fontWeight: 600,*/}
            {/*    '&:hover': {*/}
            {/*      borderColor: '#5B76BC',*/}
            {/*      color: '#5B76BC',*/}
            {/*      bgcolor: '#F0F4FF',*/}
            {/*    },*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Add draw*/}
            {/*</Stack>*/}
          </Stack>
        )}
      </Stack>

      <MRT_TableContainer
        sx={{
          height: '100%',
          borderBottomLeftRadius: !showPagination ? 16 : 0,
          borderBottomRightRadius: !showPagination ? 16 : 0,
        }}
        table={table}
      />
      {list.length > 0 && showPagination && (
        <LoanPaymentsGridFooter
          onPageChange={(page) => onPageChange(page)}
          onPageSizeChange={(pageSize) => onPageSizeChange(pageSize)}
          page={page}
        />
      )}

      <Drawer
        anchor={'right'}
        onClose={onClickToClosePayment}
        open={visiblePayment}
      >
        <Stack gap={3} px={3} py={6} width={560}>
          <Stack alignItems={'center'} flexDirection={'row'}>
            <Typography variant={'subtitle1'}>
              {paymentAction === 'addPayment' ? 'Add' : 'Edit'} payment
            </Typography>
            <Icon
              component={LOGO_CLOSE}
              onClick={onClickToClosePayment}
              sx={{
                width: 24,
                height: 24,
                flexShrink: 0,
                ml: 'auto',
                cursor: 'pointer',
              }}
            />
          </Stack>
          <Stack gap={3}>
            <StyledSelect
              label={'Date due'}
              onChange={(value) => {
                setPaymentFormData({
                  ...paymentFormData,
                  dateDue: value.target.value as string,
                });
              }}
              options={[
                ...(paymentAction === 'addPayment'
                  ? dateDueOpts
                  : originalDateDueOpts),
                {
                  label: 'No date due',
                  value: 'NO_DATE',
                  key: 'No date due',
                },
              ]}
              value={
                paymentFormData.dateDue ? paymentFormData.dateDue : dateDue
              }
              variant={'outlined'}
            />

            <StyledDatePicker
              disableFuture
              label={'Date received'}
              onChange={(value) => {
                setPaymentFormData({
                  ...paymentFormData,
                  dataReceivedTime: value,
                });
              }}
              value={paymentFormData.dataReceivedTime as Date | null}
            />

            <StyledSelect
              label={'Payment method'}
              onChange={(e) => {
                setPaymentFormData({
                  ...paymentFormData,
                  paymentMethod: e.target.value as string as PaymentMethod,
                });
              }}
              options={PAYMENT_METHODS_OPTIONS}
              value={paymentFormData.paymentMethod}
            />

            <StyledTextFieldNumber
              label={'Interest received'}
              onValueChange={({ floatValue }) => {
                setPaymentFormData({
                  ...paymentFormData,
                  defaultInterestReceived: floatValue,
                });
              }}
              prefix={'$'}
              value={paymentFormData.defaultInterestReceived}
            />
            <StyledTextFieldNumber
              label={'Reserve received'}
              onValueChange={({ floatValue }) => {
                setPaymentFormData({
                  ...paymentFormData,
                  reservePmt: floatValue,
                });
              }}
              prefix={'$'}
              value={paymentFormData.reservePmt}
            />

            <StyledTextFieldNumber
              label={'Late charges received'}
              onValueChange={({ floatValue }) => {
                setPaymentFormData({
                  ...paymentFormData,
                  lateChargesPaid: floatValue,
                });
              }}
              prefix={'$'}
              value={paymentFormData.lateChargesPaid}
            />

            <StyledTextFieldNumber
              label={'Waived late charges'}
              onValueChange={({ floatValue }) => {
                setPaymentFormData({
                  ...paymentFormData,
                  waivedLateCharges: floatValue,
                });
              }}
              prefix={'$'}
              value={paymentFormData.waivedLateCharges}
            />

            <StyledTextFieldNumber
              label={'Principal received'}
              onValueChange={({ floatValue }) => {
                setPaymentFormData({
                  ...paymentFormData,
                  principalReceived: floatValue,
                });
              }}
              prefix={'$'}
              value={paymentFormData.principalReceived}
            />

            <StyledCheckbox
              checked={paymentFormData.nsf === LoanAnswerEnum.yes}
              label={'Non-sufficient funds (NSF)'}
              onChange={(e, checked) => {
                setPaymentFormData({
                  ...paymentFormData,
                  nsf: checked ? LoanAnswerEnum.yes : LoanAnswerEnum.no,
                });
              }}
            />

            <Stack flexDirection={'row'} gap={3}>
              <StyledButton
                onClick={onClickToClosePayment}
                size={'small'}
                sx={{ flex: 1 }}
                variant={'text'}
              >
                Cancel
              </StyledButton>
              <StyledButton
                disabled={
                  !isValid(paymentFormData.dataReceivedTime) ||
                  !paymentFormData.paymentMethod ||
                  editLoading
                }
                loading={editLoading}
                onClick={onClickToSavePayment}
                size={'small'}
                sx={{ flex: 1 }}
              >
                Save
              </StyledButton>
            </Stack>
          </Stack>
        </Stack>
      </Drawer>

      <Drawer anchor={'right'} onClose={onClickToCloseDraw} open={visibleDraw}>
        <Stack gap={3} px={3} py={6} width={560}>
          <Stack alignItems={'center'} flexDirection={'row'}>
            <Typography variant={'subtitle1'}>
              {drawAction === 'addDraw' ? 'Add' : 'Edit'} draw
            </Typography>
            <Icon
              component={LOGO_CLOSE}
              onClick={onClickToCloseDraw}
              sx={{
                width: 24,
                height: 24,
                flexShrink: 0,
                ml: 'auto',
                cursor: 'pointer',
              }}
            />
          </Stack>
          <Stack gap={3}>
            <StyledDatePicker
              disableFuture
              label={'Funding date'}
              onChange={(value) => {
                setDrawFormData({
                  ...drawFormData,
                  fundingDate: value,
                });
              }}
              value={drawFormData.fundingDate as Date | null}
            />

            <StyledTextFieldNumber
              decimalScale={0}
              disabled={true}
              label={'Number of draws'}
              onValueChange={() => {
                return;
              }}
              value={drawFormData.drawNumber}
            />

            <StyledTextFieldNumber
              label={'Draw amount'}
              onValueChange={({ floatValue }) => {
                setDrawFormData({
                  ...drawFormData,
                  recommendedDraw: floatValue,
                });
              }}
              prefix={'$'}
              value={drawFormData.recommendedDraw}
            />

            <StyledTextFieldNumber
              label={'Inspection fee'}
              onValueChange={({ floatValue }) => {
                setDrawFormData({
                  ...drawFormData,
                  inspectionFee: floatValue,
                });
              }}
              prefix={'$'}
              value={drawFormData.inspectionFee}
            />

            <StyledTextFieldNumber
              label={'Wire fee'}
              onValueChange={({ floatValue }) => {
                setDrawFormData({
                  ...drawFormData,
                  wireFee: floatValue,
                });
              }}
              prefix={'$'}
              value={drawFormData.wireFee}
            />

            <StyledTextFieldNumber
              disabled={true}
              label={'Net funding'}
              onValueChange={() => {
                return;
              }}
              prefix={'$'}
              value={
                (drawFormData.recommendedDraw ?? 0) -
                (drawFormData.inspectionFee ?? 0) -
                (drawFormData.wireFee ?? 0)
              }
            />

            <Stack flexDirection={'row'} gap={3}>
              <StyledButton
                onClick={onClickToCloseDraw}
                size={'small'}
                sx={{ flex: 1 }}
                variant={'text'}
              >
                Cancel
              </StyledButton>
              <StyledButton
                disabled={
                  !isValid(drawFormData.fundingDate) ||
                  !drawFormData.recommendedDraw ||
                  !drawFormData.drawNumber ||
                  editLoading
                }
                loading={editLoading}
                onClick={onClickToSaveDraw}
                size={'small'}
                sx={{ flex: 1 }}
              >
                Save
              </StyledButton>
            </Stack>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
};

const ALAMEDA_YOULAND_ORDER = [
  'action',
  'dataReceivedTime',
  'dateDue',
  'totalPmt',
  'totalInterestReceived',
  'principalReceived',
  'netFunding',
  'fundingDate',
  'drawNumber',
  'recommendedDraw',
  'inspectionFee',
  'wireFee',
  'accruedLateCharges',
  'waivedLateCharges',
  'reservePmt',
  'reserveRestricted',
  'pmtDayVariance',
  'isAch',
  'paymentType',
  'paymentMethod',
  'additionalInformation',
];

const OTHER_ORDER = [
  'dataReceivedTime',
  'dateDue',
  'totalPmt',
  'totalInterestReceived',
  'principalReceived',
  'accruedLateCharges',
  'waivedLateCharges',
  'reservePmt',
  'reserveRestricted',
  'pmtDayVariance',
  'isAch',
  'paymentType',
  'paymentMethod',
  'additionalInformation',
];

const LOAN_PAYMENT_GRID_COLUMNS = (
  isEditable: boolean,
  openPayment: () => void,
  setPaymentFormData: any,
  setPaymentAction: any,
  openDraw: () => void,
  setDrawFormData: any,
  setDrawAction: any,
  cb?: (page: number, size: number) => Promise<void>,
  refresh?: () => Promise<void>,
): MRT_ColumnDef<any>[] => {
  const source = [
    {
      header: '',
      accessorKey: 'action',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 40,
      Cell: ({ row }) => {
        const { enqueueSnackbar } = useSnackbar();
        const { visible, open, close } = useSwitch();

        const [anchorEl, setAnchorEl] = useState<null | Element>();
        const [loading, setLoading] = useState(false);

        const onClickToDelete = useCallback(async () => {
          setLoading(true);
          const postData = {
            id: row.original.id,
          };
          try {
            await _deletePaymentData(postData);
            await refresh?.();
            await cb?.(0, 50);
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
        }, [close, enqueueSnackbar, row.original.id]);

        const options = [
          {
            label: 'Delete',
            key: 'Delete',
            value: 'Delete',
            icon: LOGO_DELETE,
            action: () => {
              open();
              setAnchorEl(null);
            },
          },
        ];

        options.unshift(
          row.original.paymentType === 'Funding'
            ? {
                label: 'Edit draw',
                key: 'Edit draw',
                value: 'Edit draw',
                icon: LOGO_EDIT,
                action: () => {
                  openDraw();
                  setAnchorEl(null);
                  setDrawAction('editDraw');
                  setDrawFormData({
                    fundingDate: row.original.fundingDate
                      ? new Date(row.original.fundingDate)
                      : null,
                    recommendedDraw: row.original.recommendedDraw,
                    inspectionFee: row.original.inspectionFee,
                    wireFee: row.original.wireFee,
                    drawNumber: row.original.drawNumber,
                    id: row.original.id,
                  });
                },
              }
            : {
                label: 'Edit payment',
                key: 'Edit payment',
                value: 'Edit payment',
                icon: LOGO_EDIT,
                action: () => {
                  openPayment();
                  setAnchorEl(null);
                  setPaymentAction('editPayment');
                  setPaymentFormData({
                    dataReceivedTime: row.original.dataReceivedTime
                      ? new Date(row.original.dataReceivedTime)
                      : null,
                    dateDue: row.original.dateDue as string,
                    paymentMethod: row.original.paymentMethod,
                    defaultInterestReceived:
                      row.original.defaultInterestReceived,
                    lateChargesPaid: row.original.lateChargesPaid,
                    waivedLateCharges: row.original.waivedLateCharges,
                    principalReceived: row.original.principalReceived,
                    nsf: row.original.nsf,
                    id: row.original.id,
                    reservePmt: row.original.reservePmt,
                  });
                },
              },
        );

        return row.original.id === '-1' ? null : (
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
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              close={() => setAnchorEl(null)}
              open={Boolean(anchorEl)}
              options={options}
              target={anchorEl}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            />
            <StyledDialog
              content={
                <Typography my={1.5} variant={'body2'}>
                  This action is irreversible, and the record will be
                  permanently removed from the loan.
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
              header={'Are you sure you want to delete this payment history?'}
              open={visible}
            />
          </Stack>
        );
      },
    },
    {
      accessorKey: 'dataReceivedTime',
      header: 'Date received',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 140,
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? !row.getIsPinned()
                  ? utils.formatDate(renderedCellValue as string)
                  : renderedCellValue
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? !row.getIsPinned()
                  ? utils.formatDate(renderedCellValue as string)
                  : renderedCellValue
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'dateDue',
      header: 'Date due',
      size: 110,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          !row.getIsPinned() && (
            <Tooltip
              title={
                utils.notNull(renderedCellValue)
                  ? utils.formatDate(renderedCellValue as string)
                  : '-'
              }
            >
              <Typography
                color={
                  row.original.nsf === LoanAnswerEnum.yes
                    ? '#DE6449'
                    : 'text.primary'
                }
                sx={{
                  ...ellipsisStyle,
                  width: '100%',
                }}
                variant={'body2'}
              >
                {utils.notNull(renderedCellValue)
                  ? utils.formatDate(renderedCellValue as string)
                  : '-'}
              </Typography>
            </Tooltip>
          )
        );
      },
    },
    {
      accessorKey: 'totalPmt',
      header: 'Total pmt',
      size: 110,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'totalInterestReceived',
      header: 'Total interest received',
      size: 170,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'principalReceived',
      header: 'Principal received',
      size: 140,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'netFunding',
      header: 'Net funding',
      size: 110,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'fundingDate',
      header: 'Funding date',
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      size: 140,
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? !row.getIsPinned()
                  ? utils.formatDate(renderedCellValue as string)
                  : renderedCellValue
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? !row.getIsPinned()
                  ? utils.formatDate(renderedCellValue as string)
                  : renderedCellValue
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'drawNumber',
      header: 'Draw number',
      size: 140,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={utils.notNull(renderedCellValue) ? renderedCellValue : '-'}
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue) ? renderedCellValue : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'recommendedDraw',
      header: 'Recommended draw',
      size: 160,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'inspectionFee',
      header: 'Inspection fee',
      size: 120,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'wireFee',
      header: 'Wire fee',
      size: 100,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'accruedLateCharges',
      header: 'Accrued late charges',
      size: 170,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'waivedLateCharges',
      header: 'Waive late charges',
      size: 160,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'reservePmt',
      header: 'Reserve pmt',
      size: 120,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'reserveRestricted',
      header: 'Reserve restricted',
      size: 140,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip
            title={
              utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'
            }
          >
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
                fontWeight: row.getIsPinned() ? 600 : 400,
              }}
              variant={'body2'}
            >
              {utils.notNull(renderedCellValue)
                ? utils.formatDollar(renderedCellValue as number)
                : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'pmtDayVariance',
      header: 'Pmt day variance',
      size: 150,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          !row.getIsPinned() && (
            <Tooltip title={renderedCellValue}>
              <Typography
                color={
                  row.original.nsf === LoanAnswerEnum.yes
                    ? '#DE6449'
                    : 'text.primary'
                }
                sx={{
                  ...ellipsisStyle,
                  width: '100%',
                }}
                variant={'body2'}
              >
                {renderedCellValue}
              </Typography>
            </Tooltip>
          )
        );
      },
    },
    {
      accessorKey: 'isAch',
      header: 'ACH',
      size: 60,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          !row.getIsPinned() && (
            <Tooltip title={renderedCellValue ? 'ACH' : '-'}>
              <Typography
                color={
                  row.original.nsf === LoanAnswerEnum.no
                    ? '#DE6449'
                    : 'text.primary'
                }
                sx={{
                  ...ellipsisStyle,
                  width: '100%',
                }}
                variant={'body2'}
              >
                {renderedCellValue ? 'ACH' : '-'}
              </Typography>
            </Tooltip>
          )
        );
      },
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment type',
      size: 130,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          !row.getIsPinned() && (
            <Tooltip title={renderedCellValue}>
              <Typography
                color={
                  row.original.nsf === LoanAnswerEnum.yes
                    ? '#DE6449'
                    : 'text.primary'
                }
                sx={{
                  ...ellipsisStyle,
                  width: '100%',
                }}
                variant={'body2'}
              >
                {/*todo:enum?*/}
                {renderedCellValue}
              </Typography>
            </Tooltip>
          )
        );
      },
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment method',
      size: 150,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          !row.getIsPinned() && (
            <Tooltip title={renderedCellValue}>
              <Typography
                color={
                  row.original.nsf === LoanAnswerEnum.yes
                    ? '#DE6449'
                    : 'text.primary'
                }
                sx={{
                  ...ellipsisStyle,
                  width: '100%',
                }}
                variant={'body2'}
              >
                {/*todo:enum?*/}
                {renderedCellValue}
              </Typography>
            </Tooltip>
          )
        );
      },
    },
    {
      accessorKey: 'additionalInformation',
      header: 'Additional information',
      size: 160,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ renderedCellValue, row }) => {
        return (
          <Tooltip title={renderedCellValue ?? '-'}>
            <Typography
              color={
                row.original.nsf === LoanAnswerEnum.yes
                  ? '#DE6449'
                  : 'text.primary'
              }
              sx={{
                ...ellipsisStyle,
                width: '100%',
              }}
              variant={'body2'}
            >
              {renderedCellValue ?? '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    //{
    //  accessorKey: 'defaultInterestReceived',
    //  header: 'Default interest received',
    //  size: 220,
    //  muiTableBodyCellProps: { align: 'center' },
    //  muiTableHeadCellProps: { align: 'center' },
    //  Cell: ({ renderedCellValue, row }) => {
    //    return (
    //      <Tooltip title={renderedCellValue}>
    //        <Typography
    //          sx={{
    //            ...ellipsisStyle,
    //            width: '100%',
    //            fontWeight: row.getIsPinned() ? 600 : 400,
    //          }}
    //          variant={'body2'}
    //        >
    //          {utils.notNull(renderedCellValue)
    //            ? utils.formatDollar(renderedCellValue as number)
    //            : '-'}
    //        </Typography>
    //      </Tooltip>
    //    );
    //  },
    //},
    //{
    //  accessorKey: 'interestRateReceived',
    //  header: 'Interest rate received',
    //  size: 210,
    //  muiTableBodyCellProps: { align: 'center' },
    //  muiTableHeadCellProps: { align: 'center' },
    //  Cell: ({ renderedCellValue, row }) => {
    //    return (
    //      <Tooltip title={renderedCellValue}>
    //        <Typography
    //          sx={{
    //            ...ellipsisStyle,
    //            width: '100%',
    //            fontWeight: row.getIsPinned() ? 600 : 400,
    //          }}
    //          variant={'body2'}
    //        >
    //          {utils.notNull(renderedCellValue)
    //            ? utils.formatDollar(renderedCellValue as number)
    //            : '-'}
    //        </Typography>
    //      </Tooltip>
    //    );
    //  },
    //},
  ] as MRT_ColumnDef<any>[];

  return source.filter((item) =>
    (isEditable ? ALAMEDA_YOULAND_ORDER : OTHER_ORDER).includes(
      item.accessorKey as string,
    ),
  );
};
