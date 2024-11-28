import { Box, CircularProgress, Fade, Stack, Typography } from '@mui/material';
import { format, isValid } from 'date-fns';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { FC, useRef, useState } from 'react';
import { useAsyncFn, useAsyncRetry } from 'react-use';

import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
  StyledHeaderAddressInfo,
  StyledLoading,
  StyledSelect,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { ExtensionPaidTypeOpt, MATURITY_DATE } from '@/constant';

import { useRenderPdf, useSwitch } from '@/hooks';

import {
  _createExtensionPdf,
  _downloadExtensionPdf,
  _extensionConfirm,
  _getExtensionInfo,
  _viewExtensionPdf,
} from '@/request';
import { ExtensionPaidTypeEnum, MaturityDateTypeEnum } from '@/types/enum';

import { IGetExtensionPdfParam } from '@/types/loan/extension';
import { createFile, utils } from '@/utils';

export const LoanExtensionRequest: FC = () => {
  const router = useRouter();
  const { loanId } = router.query;
  const formRef = useRef<HTMLFormElement | null>(null);
  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const [changeRate, setChangeRate] = useState(12);
  const [extensionFee, setExtensionFee] = useState(1);
  const [executionDate, setExtensionDate] = useState<Date | null>(new Date());
  const [maturityDate, setMaturityDate] = useState(
    MaturityDateTypeEnum.EXTEND_3,
  );
  const [paidType, setPaidType] = useState(ExtensionPaidTypeEnum.Upfront);
  const [downloadId, setDownloadId] = useState<number | null>(null);
  const [init, setInit] = useState(false);
  const { visible, open, close } = useSwitch();

  const {
    visible: confirmShow,
    // open: confirmOpen,
    close: confirmClose,
  } = useSwitch();

  const { value, retry } = useAsyncRetry(async () => {
    return typeof loanId === 'string'
      ? await _getExtensionInfo(parseInt(loanId as string))
          .then((res) => {
            setDownloadId(res.data.downloadId);
            if (res.data.paidMode) {
              setPaidType(res.data.paidMode);
            }
            if (typeof res.data.extensionFee === 'number') {
              setExtensionFee(res.data.extensionFee);
            }
            if (typeof res.data.executionData === 'string') {
              setExtensionDate(new Date(res.data.executionData));
            }
            setInit(true);
            return res;
          })
          .catch(({ message, variant, header }) => {
            enqueueSnackbar(message, { variant, isSimple: !header, header });
          })
          .finally(() => {
            setInit(true);
          })
      : null;
  }, [loanId]);

  const cardInfo: Record<string, any> = {
    'Current interest rate': utils.formatPercent(
      value?.data?.currentInterestRate || 0,
    ),
    'Extension fee': ` ${utils.formatPercent(
      extensionFee,
      2,
    )}  (${utils.formatDollar(
      (value?.data?.totalLoanAmount || 0) * extensionFee * 0.01,
    )})`,
    'Default rate': utils.formatPercent(value?.data?.defaultRate || 0),
    'Change the interest rate to:': utils.formatPercent(changeRate),
    'Execution date': isValid(executionDate)
      ? format(executionDate as Date, 'MM/dd/yyyy')
      : '',
  };

  const [state, createExtensionPdf] = useAsyncFn(
    async (param: IGetExtensionPdfParam) => {
      if (!formRef.current?.reportValidity()) {
        return;
      }
      await _createExtensionPdf(param)
        .then((res) => {
          setDownloadId(res.data);
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        });
    },
    [formRef.current],
  );

  const [confirmState, extensionConfirm] = useAsyncFn(
    async (param: IGetExtensionPdfParam) => {
      if (!formRef.current?.reportValidity()) {
        return;
      }
      await _extensionConfirm(param)
        .then(async (res) => {
          enqueueSnackbar('Update Successful !', {
            variant: 'success',
          });
          await router.push(`/loan/overview?loanId=${loanId}`);
          return res;
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        });
    },
    [formRef.current, loanId],
  );

  const [viewState, viewExtensionPdf] = useAsyncFn(async () => {
    if (typeof downloadId !== 'number') {
      return;
    }
    return await _viewExtensionPdf(downloadId)
      .then((res) => {
        setTimeout(() => {
          renderFile(res.data);
        }, 500);
      })
      .catch(({ message, variant, header }) => {
        enqueueSnackbar(message, { variant, isSimple: !header, header });
      });
  }, [downloadId]);

  const [downloadState, downloadExtensionPdf] = useAsyncFn(async () => {
    if (typeof downloadId !== 'number') {
      return;
    }
    await _downloadExtensionPdf(downloadId)
      .then((res) => {
        const fileName = res.headers['content-disposition']
          .split(';')[1]
          .split('filename=')[1];
        const blob = new Blob([res.data], {
          type: 'application/octet-stream',
        });
        createFile(blob, fileName);
      })
      .catch(({ message, variant, header }) => {
        enqueueSnackbar(message, { variant, isSimple: !header, header });
      });
  }, [downloadId]);
  return !init ? (
    <Stack
      alignItems={'center'}
      height={'100%'}
      justifyContent={'center'}
      width={'100%'}
    >
      <CircularProgress sx={{ color: '#E3E3EE' }} />
    </Stack>
  ) : (
    <Fade in={!!value?.data}>
      <Box overflow={'auto'}>
        <Stack direction={'row'} justifyContent={'center'} p={6}>
          {value?.data && (
            <Stack maxWidth={900} spacing={3} width={'100%'}>
              <StyledHeaderAddressInfo
                address={value.data.propertyFullAddress}
                loanNumber={value.data.systemLoanNumber}
                status={value.data.repaymentStatusEnum}
              />
              <Typography color={'text.hover'} fontWeight={600}>
                Extension agreement
              </Typography>
              <Stack direction={'row'} gap={3}>
                <Stack
                  bgcolor={'#F0F4FF'}
                  borderRadius={2}
                  component={'ul'}
                  gap={1.5}
                  p={3}
                  width={'50%'}
                >
                  {Object.keys(cardInfo).map((item, index) => (
                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      key={index}
                    >
                      <Typography color={'text.hover'} variant={'body2'}>
                        {item}
                      </Typography>
                      <Typography variant={'subtitle2'}>
                        {cardInfo[item]}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack
                  autoComplete={'off'}
                  component={'form'}
                  gap={1.25}
                  ref={formRef}
                  width={'50%'}
                >
                  <StyledSelect
                    label={'Maturity date'}
                    onChange={(e) => {
                      setMaturityDate(e.target.value as MaturityDateTypeEnum);
                    }}
                    options={MATURITY_DATE}
                    value={maturityDate}
                  />
                  <StyledTextFieldNumber
                    label={'Extension fee'}
                    onValueChange={(values) => {
                      setExtensionFee(values.floatValue ?? 0);
                    }}
                    required
                    suffix={'%'}
                    value={extensionFee}
                  />
                  <StyledSelect
                    label={'When does it get paid?'}
                    onChange={(e) => {
                      setPaidType(e.target.value as ExtensionPaidTypeEnum);
                    }}
                    options={ExtensionPaidTypeOpt}
                    value={paidType}
                  />
                  <StyledTextFieldNumber
                    decimalScale={3}
                    label={'Change the interest to'}
                    onValueChange={(values) => {
                      setChangeRate(values.floatValue ?? 0);
                    }}
                    required
                    suffix={'%'}
                    value={changeRate}
                  />
                  <StyledDatePicker
                    label={'Execution date'}
                    onChange={(value) => {
                      setExtensionDate(value);
                    }}
                    slotProps={{
                      textField: {
                        required: true,
                      },
                    }}
                    value={executionDate}
                  />
                </Stack>
              </Stack>
              <StyledButton
                loading={state.loading}
                onClick={async () => {
                  if (
                    executionDate !== null &&
                    typeof value?.data?.maturityDate === 'string'
                  ) {
                    await createExtensionPdf({
                      loanId: parseInt(loanId as string),
                      extendMonth: maturityDate,
                      extensionFee,
                      changeInterestRate: changeRate,
                      executionDate: format(executionDate, 'yyyy-MM-dd'),
                      maturityDate: value.data.maturityDate,
                      extensionFeeAmount: 0,
                      paidMode: paidType,
                    });
                    retry();
                  }
                }}
                size={'small'}
                sx={{ alignSelf: 'flex-start', width: 181 }}
                variant={'outlined'}
              >
                Generate agreement
              </StyledButton>
              <Fade
                in={
                  typeof value?.data?.createdTime === 'string' &&
                  typeof downloadId === 'number'
                }
              >
                <Box
                  color={'primary.main'}
                  component={'a'}
                  fontSize={18}
                  onClick={async () => {
                    open();
                    await viewExtensionPdf();
                  }}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  width={'fit-content'}
                >
                  Extension agreement -{' '}
                  {utils.formatDate(value?.data?.createdTime, 'MM/d/yyyy')}
                </Box>
              </Fade>
              <Fade
                in={
                  typeof value?.data?.createdTime === 'string' &&
                  typeof downloadId === 'number'
                }
              >
                <Box>
                  <StyledButton
                    color={'error'}
                    loading={confirmState.loading}
                    onClick={async () => {
                      if (executionDate !== null) {
                        await extensionConfirm({
                          loanId: parseInt(loanId as string),
                          extendMonth: maturityDate,
                          extensionFee,
                          changeInterestRate: changeRate,
                          executionDate: format(executionDate, 'yyyy-MM-dd'),
                          maturityDate: value.data.maturityDate,
                          extensionFeeAmount: 0,
                          paidMode: paidType,
                        });
                      }
                    }}
                    size={'small'}
                    sx={{ alignSelf: 'flex-start', width: 193 }}
                    variant={'contained'}
                  >
                    Confirm loan extension
                  </StyledButton>
                </Box>
              </Fade>
            </Stack>
          )}
        </Stack>
        <StyledDialog
          content={
            <Box minHeight={300}>
              {viewState.loading && (
                <Stack
                  alignItems={'center'}
                  height={300}
                  justifyContent={'center'}
                  textAlign={'center'}
                >
                  <StyledLoading sx={{ color: '#D2D6E1' }} />
                </Stack>
              )}

              <Box ref={pdfFile} />
            </Box>
          }
          footer={
            <Stack flexDirection={'row'} gap={3}>
              <StyledButton
                color={'info'}
                onClick={close}
                size={'small'}
                variant={'outlined'}
              >
                Close
              </StyledButton>
              <StyledButton
                color={'primary'}
                loading={downloadState.loading}
                onClick={downloadExtensionPdf}
                size={'small'}
                sx={{ width: 110 }}
              >
                Download
              </StyledButton>
            </Stack>
          }
          header={''}
          onClose={close}
          open={visible}
          sx={{
            '.MuiDialogContent-root': {
              px: '0 !important',
            },
          }}
        />
        <StyledDialog
          content={
            <Typography color={'#636A7C'} px={3} py={2} variant={'body2'}>
              Please verify that the extension fee has been received and the
              extension agreement has been signed. Ensure that all the extension
              details above are accurate. By clicking &lsquo;Confirm,&rsquo; you
              agree to update the interest rate and maturity date.
            </Typography>
          }
          footer={
            <Stack flexDirection={'row'} gap={3}>
              <StyledButton
                color={'info'}
                onClick={close}
                size={'small'}
                variant={'outlined'}
              >
                Cancel
              </StyledButton>
              <StyledButton
                color={'error'}
                loading={downloadState.loading}
                onClick={downloadExtensionPdf}
                size={'small'}
                sx={{ width: 110 }}
              >
                Confirm
              </StyledButton>
            </Stack>
          }
          header={'Are you sure you want to extend the loan?'}
          onClose={confirmClose}
          open={confirmShow}
          sx={{
            '.MuiDialogContent-root': {
              px: '0 !important',
            },
          }}
        />
      </Box>
    </Fade>
  );
};
