import {
  Box,
  CircularProgress,
  Fade,
  Icon,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
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
  StyledTextFieldInput,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { ExtensionPaidTypeOpt, MATURITY_DATE, YES_NO } from '@/constant';

import { useRenderPdf, useSwitch } from '@/hooks';

import {
  _createExtensionPdf,
  _deleteExtensionFile,
  _downloadExtensionPdf,
  _extensionConfirm,
  _getExtensionInfo,
  _viewExtensionPdf,
} from '@/request';
import { ExtensionPaidTypeEnum, MaturityDateTypeEnum } from '@/types/enum';

import { IGetExtensionPdfParam } from '@/types/loan/extension';
import { createFile, utils } from '@/utils';

import ICON_DOWNLOAD from '@/svg/loan/extension/extension_download.svg';
import ICON_DELETE from '@/svg/loan/extension/extension_delete.svg';
import { StyledGoogleAutoComplete } from '@/components/atoms/StyledGoogleAutoComplete';
import { Address, IAddress } from '@/models/common';

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
  const [index, setIndex] = useState(0);
  const [address] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const {
    visible: confirmShow,
    // open: confirmOpen,
    close: confirmClose,
  } = useSwitch();

  const { value, retry } = useAsyncRetry(async () => {
    return typeof loanId === 'string'
      ? await _getExtensionInfo(parseInt(loanId as string))
          .then((res) => {
            if (typeof res.data.genAgreement?.id === 'number') {
              setDownloadId(res.data.genAgreement.id);
            }
            if (res.data.paidMode) {
              setPaidType(res.data.paidMode);
            }
            if (typeof res.data.extensionFee === 'number') {
              setExtensionFee(res.data.extensionFee);
            }
            if (typeof res.data.executionDate === 'string') {
              setExtensionDate(new Date(res.data.executionDate));
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

  const borrowerInfo: Record<string, any> = {
    'Borrower name': 'Borrower name',
    'Property address': value?.data?.propertyFullAddress || '',
    'Current loan amount': '$1000000',
    'Promissory note date': '01/01/2022',
    'Current maturity date': '01/01/2022',
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
    async (param: IGetExtensionPdfParam & { id: number }) => {
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
    open();
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

  const [downloadState, downloadExtensionPdf] = useAsyncFn(
    async (downloadId: number) => {
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
    },
    [],
  );

  const [deleteExtensionFileState, deleteExtensionFile] = useAsyncFn(
    async (downloadId: number) => {
      await _deleteExtensionFile(downloadId).catch(
        ({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        },
      );
    },
    [],
  );

  if (!init) {
    return (
      <Stack
        alignItems={'center'}
        height={'100%'}
        justifyContent={'center'}
        width={'100%'}
      >
        <CircularProgress sx={{ color: '#E3E3EE' }} />
      </Stack>
    );
  }

  return (
    <Fade in={!!value?.data}>
      <Box overflow={'auto'}>
        <Stack direction={'row'} p={6}>
          {value?.data && (
            <Stack gap={3} width={'100%'}>
              <StyledHeaderAddressInfo
                address={value.data.propertyFullAddress}
                loanNumber={value.data.systemLoanNumber}
                status={value.data.repaymentStatusEnum}
              />

              <Stack direction={'row'} gap={3}>
                <Stack
                  autoComplete={'off'}
                  border={'1px solid #E4E7EF'}
                  borderRadius={4}
                  component={'form'}
                  gap={3}
                  minWidth={600}
                  p={3}
                  ref={formRef}
                  width={'36%'}
                >
                  <Typography fontWeight={600} letterSpacing={0.32}>
                    Generate extension agreement
                  </Typography>
                  <Stack flexDirection={'row'} gap={3} width={'100%'}>
                    <StyledSelect
                      fullWidth
                      label={'Maturity date'}
                      onChange={(e) => {
                        setMaturityDate(e.target.value as MaturityDateTypeEnum);
                      }}
                      options={MATURITY_DATE}
                      value={maturityDate}
                    />
                    <StyledTextFieldNumber
                      decimalScale={0}
                      disabled
                      label={'Extension number'}
                      required
                      value={1}
                    />
                  </Stack>
                  <Stack flexDirection={'row'} gap={3} width={'100%'}>
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
                  </Stack>
                  <Stack flexDirection={'row'} gap={3} width={'100%'}>
                    <StyledSelect
                      label={'Change the interest rate?'}
                      onChange={(e) => {
                        setPaidType(e.target.value as ExtensionPaidTypeEnum);
                      }}
                      options={YES_NO}
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
                  </Stack>
                  <StyledDatePicker
                    disableFuture={false}
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
                  <Stack
                    bgcolor={'#D2D6E1'}
                    height={'1px'}
                    width={'100%'}
                  ></Stack>
                  <Stack flexDirection={'row'} gap={3}>
                    <StyledTextFieldInput
                      label={'First name'}
                      variant={'outlined'}
                    />
                    <StyledTextFieldInput
                      label={'Last name'}
                      variant={'outlined'}
                    />
                  </Stack>
                  <StyledGoogleAutoComplete
                    address={address}
                    fullAddress
                    label={'Property address'}
                  />
                  <StyledTextFieldNumber
                    disabled
                    label={'Current loan amount'}
                    prefix={'$'}
                    value={''}
                  />
                  <Stack flexDirection={'row'} gap={3}>
                    <StyledDatePicker
                      disableFuture={false}
                      label={'Promissory note date'}
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
                    <StyledDatePicker
                      disableFuture={false}
                      label={'Current maturity date'}
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
                <Stack
                  bgcolor={'#F0F4FF'}
                  borderRadius={2}
                  component={'ul'}
                  flex={1}
                  gap={1.5}
                  height={'fit-content'}
                  p={3}
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
                  <Stack
                    bgcolor={'#D2D6E1'}
                    height={'1px'}
                    width={'100%'}
                  ></Stack>
                  {Object.keys(borrowerInfo).map((item, index) => (
                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      key={index}
                    >
                      <Typography color={'text.hover'} variant={'body2'}>
                        {item}
                      </Typography>
                      <Typography variant={'subtitle2'}>
                        {borrowerInfo[item]}
                      </Typography>
                    </Stack>
                  ))}
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
                          executionDate: executionDate.toISOString(),
                          maturityDate: value.data.maturityDate,
                          extensionFeeAmount: 0,
                          paidMode: paidType,
                        });
                        retry();
                      }
                    }}
                    size={'small'}
                    sx={{ alignSelf: 'center', width: 181 }}
                    variant={'outlined'}
                  >
                    Generate agreement
                  </StyledButton>
                </Stack>
              </Stack>

              {!!value?.data?.genAgreement?.executionDate && (
                <Fade in={!!value?.data?.genAgreement?.executionDate}>
                  <Box
                    color={'primary.main'}
                    component={'a'}
                    fontSize={18}
                    onClick={async () => {
                      await viewExtensionPdf();
                    }}
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    width={'fit-content'}
                  >
                    Extension agreement -{' '}
                    {utils.formatDate(
                      value?.data?.genAgreement?.executionDate,
                      'MM/d/yyyy',
                    )}
                  </Box>
                </Fade>
              )}
              {Array.isArray(value?.data?.confirmAgreements) &&
                !!value.data.confirmAgreements.length && (
                  <Fade
                    in={
                      Array.isArray(value?.data?.confirmAgreements) &&
                      !!value.data.confirmAgreements.length
                    }
                  >
                    <TableContainer
                      component={Box}
                      style={{ borderRadius: 8, border: '1px solid #E4E7EF' }}
                    >
                      <Table>
                        <TableHead
                          sx={{
                            bgcolor: '#F4F6FA',
                            '& .MuiTableCell-root': {
                              border: 'none',
                            },
                          }}
                        >
                          <TableRow
                            sx={{
                              '& .MuiTableCell-root': {
                                py: 1.5,
                              },
                            }}
                          >
                            <TableCell
                              align="left"
                              style={{ paddingLeft: 24, paddingRight: 0 }}
                            >
                              <Typography
                                color={'info.main'}
                                variant={'subtitle2'}
                              >
                                Description
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ paddingLeft: 0, paddingRight: 24 }}
                              width={120}
                            >
                              <Typography
                                borderLeft={'1px solid #D2D6E1'}
                                color={'info.main'}
                                variant={'subtitle2'}
                              >
                                Actions
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody
                          sx={{
                            '& .MuiTableCell-root': {
                              border: 'none',
                            },
                          }}
                        >
                          {value?.data?.confirmAgreements.map((row, i) => (
                            <TableRow key={row.id}>
                              <TableCell
                                component="th"
                                scope="row"
                                style={{ paddingLeft: 24, paddingRight: 0 }}
                              >
                                Extension agreement -{' '}
                                {utils.formatDate(
                                  row.executionDate,
                                  'MM/d/yyyy',
                                )}
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{ paddingLeft: 0, paddingRight: 24 }}
                              >
                                <Stack
                                  borderLeft={'1px solid #D2D6E1'}
                                  flexDirection={'row'}
                                  gap={1.25}
                                  justifyContent={'center'}
                                >
                                  <IconButton
                                    onClick={async () => {
                                      setIndex(i);
                                      await downloadExtensionPdf(row.id);
                                    }}
                                    sx={{ p: 0 }}
                                  >
                                    {downloadState.loading && index === i ? (
                                      <CircularProgress
                                        style={{ width: 20, height: 20 }}
                                        sx={{ color: '#E3E3EE' }}
                                      />
                                    ) : (
                                      <Icon
                                        component={ICON_DOWNLOAD}
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    )}
                                  </IconButton>
                                  <IconButton
                                    onClick={async () => {
                                      setIndex(i);
                                      await deleteExtensionFile(row.id);
                                      retry();
                                    }}
                                    sx={{ p: 0 }}
                                  >
                                    {deleteExtensionFileState.loading &&
                                    index === i ? (
                                      <CircularProgress
                                        style={{ width: 20, height: 20 }}
                                        sx={{ color: '#E3E3EE' }}
                                      />
                                    ) : (
                                      <Icon
                                        component={ICON_DELETE}
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    )}
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Fade>
                )}
              {!!value?.data?.genAgreement?.executionDate && (
                <Fade in={!!value?.data?.genAgreement?.executionDate}>
                  <Box>
                    <StyledButton
                      color={'error'}
                      loading={confirmState.loading}
                      onClick={async () => {
                        if (
                          executionDate !== null &&
                          typeof value?.data?.genAgreement?.id === 'number'
                        ) {
                          await extensionConfirm({
                            loanId: parseInt(loanId as string),
                            extendMonth: maturityDate,
                            extensionFee,
                            changeInterestRate: changeRate,
                            executionDate: executionDate.toISOString(),
                            maturityDate: value.data.maturityDate,
                            extensionFeeAmount: 0,
                            paidMode: paidType,
                            id: value.data.genAgreement.id,
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
              )}
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
                onClick={async () => {
                  if (typeof downloadId === 'number') {
                    await downloadExtensionPdf(downloadId);
                  }
                }}
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
                onClick={async () => {
                  if (typeof downloadId === 'number') {
                    await downloadExtensionPdf(downloadId);
                  }
                }}
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
