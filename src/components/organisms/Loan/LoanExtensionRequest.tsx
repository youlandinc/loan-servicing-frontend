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
import { observer } from 'mobx-react-lite';
import { format, isValid } from 'date-fns';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

import {
  StyledButton,
  StyledDatePicker,
  StyledHeaderAddressInfo,
  StyledSelect,
  StyledTextFieldInput,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { StyledGoogleAutoComplete } from '@/components/atoms/StyledGoogleAutoComplete';
import {
  LoanExtensionRequestDeleteDialog,
  LoanExtensionRequestDialog,
  useLoanExtensionRequestFetch,
  useLoanExtensionRequestSelects,
} from '@/components/molecules';
import {
  ExtensionPaidTypeOpt,
  ExtensionPaidTypeOptToExtensionFee,
  MATURITY_DATE,
  MATURITY_DATE_LABEL,
  YES_NO,
} from '@/constant';

import { useSwitch } from '@/hooks';
import {
  ExtensionPaidTypeEnum,
  LoanAnswerEnum,
  MaturityDateTypeEnum,
} from '@/types/enum';
import { utils } from '@/utils';

import ICON_DOWNLOAD from '@/svg/loan/extension/extension_download.svg';

export const LoanExtensionRequest = observer(() => {
  const router = useRouter();
  const { loanId } = router.query;
  const formRef = useRef<HTMLFormElement | null>(null);
  const { visible, open, close } = useSwitch();

  const {
    maturityDate,
    setMaturityDate,
    paidType,
    setPaidType,
    extensionFee,
    setExtensionFee,
    changeRateShow,
    setChangeRateShow,
    changeRate,
    setChangeRate,
    executionDate,
    setExtensionDate,
    borrowerName,
    setBorrowerName,
    promissoryNoteDate,
    setPromissoryNoteDate,
    address,
    resetFilter,
  } = useLoanExtensionRequestSelects();

  const {
    value,
    retry,
    createExtensionPdf,
    generateAgreementLoading,
    confirmState,
    extensionConfirm,
    pdfFile,
    viewState,
    viewExtensionPdf,
    downloadState,
    downloadExtensionPdf,
    deleteExtensionFileState,
    deleteExtensionFile,
    initLoading,
  } = useLoanExtensionRequestFetch({
    resetFilter,
    formRef,
    open,
  });

  const [index, setIndex] = useState(0);

  const { visible: undoShow, open: undoOpen, close: undoClose } = useSwitch();

  const {
    address: addressData,
    aptNumber,
    city,
    state,
    postcode,
  } = address.getPostData();

  const cardInfo: Record<string, any> = {
    'Extend by': MATURITY_DATE_LABEL[maturityDate],
    'Extension number': value?.data?.extensionNumber || 0,
    'Current interest rate': utils.formatPercent(
      value?.data?.interestRate || 0,
    ),
    ...(changeRateShow === LoanAnswerEnum.yes && {
      'Change the interest rate to': utils.formatPercent(changeRate),
    }),
    'Extension fee': ` ${utils.formatPercent(
      extensionFee,
      2,
    )}  (${utils.formatDollar(
      (value?.data?.totalLoanAmount || 0) * extensionFee * 0.01,
    )})`,
    'Default rate': utils.formatPercent(value?.data?.defaultRate || 0),
    'Execution date': isValid(executionDate)
      ? format(executionDate as Date, 'MM/dd/yyyy')
      : '',
  };

  const borrowerInfo: Record<string, any> = {
    'Borrower name': borrowerName || '',
    'Property address': address.computedFormatAddress || '',
    'Current loan amount': value?.data?.currentBalance
      ? utils.formatDollar(value.data.currentBalance)
      : 0,
    'Promissory note date': promissoryNoteDate
      ? utils.formatDate(promissoryNoteDate)
      : '',
    'Current maturity date': value?.data?.currentMaturityDate
      ? utils.formatDate(value.data?.currentMaturityDate)
      : '',
  };

  if (initLoading) {
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
                  minWidth={500}
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
                      label={'Extend by'}
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
                      value={value?.data?.extensionNumber || 0}
                    />
                  </Stack>
                  <Stack flexDirection={'row'} gap={3} width={'100%'}>
                    <StyledSelect
                      label={'When does it get paid?'}
                      onChange={(e) => {
                        setPaidType(e.target.value as ExtensionPaidTypeEnum);
                        setExtensionFee(
                          ExtensionPaidTypeOptToExtensionFee[
                            e.target.value as ExtensionPaidTypeEnum
                          ],
                        );
                      }}
                      options={ExtensionPaidTypeOpt}
                      value={paidType}
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
                  </Stack>
                  <Stack flexDirection={'row'} gap={3} width={'100%'}>
                    <StyledSelect
                      label={'Change the interest rate?'}
                      onChange={(e) => {
                        setChangeRateShow(e.target.value as LoanAnswerEnum);
                      }}
                      options={YES_NO}
                      value={changeRateShow}
                    />
                    {changeRateShow === LoanAnswerEnum.yes && (
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
                    )}
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
                      label={'Borrower name'}
                      onChange={(e) => {
                        setBorrowerName(e.target.value);
                      }}
                      value={borrowerName}
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
                    value={value.data.currentBalance}
                  />
                  <Stack flexDirection={'row'} gap={3}>
                    <StyledDatePicker
                      disableFuture={false}
                      label={'Promissory note date'}
                      onChange={(value) => {
                        setPromissoryNoteDate(value);
                      }}
                      slotProps={{
                        textField: {
                          required: true,
                        },
                      }}
                      value={promissoryNoteDate}
                    />
                    <StyledDatePicker
                      disabled
                      label={'Current maturity date'}
                      onChange={() => void 0}
                      value={new Date(value?.data?.currentMaturityDate)}
                    />
                  </Stack>
                </Stack>
                <Stack flex={1} gap={3}>
                  <Stack
                    bgcolor={'#F0F4FF'}
                    borderRadius={2}
                    component={'ul'}
                    flex={1}
                    flexGrow={0}
                    gap={1.5}
                    height={'fit-content'}
                    minWidth={500}
                    p={3}
                  >
                    {Object.keys(cardInfo).map((item, index) => (
                      <Stack
                        direction={'row'}
                        gap={2}
                        justifyContent={'space-between'}
                        key={index}
                      >
                        <Typography
                          color={'text.hover'}
                          variant={'body2'}
                          whiteSpace={'nowrap'}
                        >
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
                      disabled={value?.data?.extensionNumber >= 4}
                      loading={generateAgreementLoading}
                      onClick={async () => {
                        if (
                          executionDate !== null &&
                          value?.data?.extensionNumber < 4
                        ) {
                          await createExtensionPdf({
                            loanId: parseInt(loanId as string),
                            extendMonth: maturityDate,
                            paymentTiming: paidType,
                            extensionFee,
                            isChangeInterestRate: changeRateShow,
                            ...(changeRateShow === LoanAnswerEnum.yes && {
                              changeInterestRate: changeRate,
                            }),
                            executionDate: executionDate.toISOString(),
                            borrowerName: value?.data?.borrowerName,
                            address: addressData,
                            city: city,
                            state: state,
                            aptNumber: aptNumber,
                            zipCode: postcode,
                            promissoryNoteDate:
                              promissoryNoteDate?.toISOString(),
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

                  {!!value?.data?.genAgreement && (
                    <Fade in={!!value?.data?.genAgreement}>
                      <Stack
                        alignItems={'center'}
                        bgcolor={'#F4F4F6'}
                        borderRadius={'8px'}
                        flexDirection={{
                          xs: 'column',
                          xl: 'row',
                        }}
                        gap={3}
                        justifyContent={'space-between'}
                        p={3}
                      >
                        <Stack
                          gap={1}
                          maxWidth={{
                            xs: '100%',
                            xl: '60%',
                          }}
                        >
                          <Typography
                            onClick={async () => {
                              if (
                                typeof value?.data?.genAgreement?.downloadId ===
                                'number'
                              ) {
                                await viewExtensionPdf(
                                  value.data.genAgreement.downloadId,
                                );
                              }
                            }}
                            sx={{
                              color: '#2B52B6',
                              fontSize: '14px',
                              fontWeight: 600,
                              lineHeight: '20px',
                              cursor: 'pointer',
                              textDecorationLine: 'underline',
                            }}
                            variant={'subtitle2'}
                          >
                            Extension agreement{' '}
                            {value?.data?.genAgreement?.downloadId} -{' '}
                            {value?.data?.genAgreement?.propertyFullAddress} -{' '}
                            {utils.formatDate(
                              value?.data?.genAgreement?.createdTime,
                            )}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#9095A3',
                              fontSize: '14px',
                              lineHeight: '20px',
                              fontWeight: 400,
                            }}
                            variant={'subtitle2'}
                          >
                            Review and accept the amended terms, then select
                            “Confirm loan extension” to apply the updated
                            schedule.
                          </Typography>
                        </Stack>
                        <StyledButton
                          color={'error'}
                          loading={confirmState.loading}
                          onClick={async () => {
                            if (
                              executionDate !== null &&
                              typeof value?.data?.genAgreement?.downloadId ===
                                'number'
                            ) {
                              await extensionConfirm(
                                value.data.genAgreement.downloadId,
                              );
                              retry();
                            }
                          }}
                          size={'small'}
                          sx={{
                            alignSelf: 'center',
                            width: 193,
                            flexShrink: 0,
                            borderRadius: '8px !important',
                          }}
                          variant={'contained'}
                        >
                          Confirm loan extension
                        </StyledButton>
                      </Stack>
                    </Fade>
                  )}

                  {Array.isArray(value?.data?.confirmAgreements) &&
                    !!value.data.confirmAgreements.length && (
                      <>
                        <Fade
                          in={
                            Array.isArray(value?.data?.confirmAgreements) &&
                            !!value.data.confirmAgreements.length
                          }
                        >
                          <TableContainer
                            component={Box}
                            style={{
                              borderRadius: 8,
                              border: '1px solid #E4E7EF',
                            }}
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
                                      Confirmed loan extensions
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ paddingLeft: 0, paddingRight: 0 }}
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
                                {value?.data?.confirmAgreements.map(
                                  (row, i) => (
                                    <TableRow key={row.id}>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        style={{
                                          paddingLeft: 24,
                                          paddingRight: 0,
                                        }}
                                      >
                                        Extension agreement {row.downloadId} -{' '}
                                        {row.propertyFullAddress} -{' '}
                                        {utils.formatDate(row.createdTime)}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{
                                          paddingLeft: 0,
                                          paddingRight: 0,
                                        }}
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
                                              await downloadExtensionPdf(
                                                row.downloadId,
                                              );
                                            }}
                                            sx={{ p: 0 }}
                                          >
                                            {downloadState.loading &&
                                            index === i ? (
                                              <CircularProgress
                                                style={{
                                                  width: 20,
                                                  height: 20,
                                                }}
                                                sx={{ color: '#E3E3EE' }}
                                              />
                                            ) : (
                                              <Icon
                                                component={ICON_DOWNLOAD}
                                                sx={{ width: 20, height: 20 }}
                                              />
                                            )}
                                          </IconButton>
                                        </Stack>
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Fade>
                        <Typography
                          color={'#202939'}
                          fontSize={12}
                          lineHeight={'18px'}
                          onClick={() => {
                            undoOpen();
                          }}
                          sx={{
                            cursor: 'pointer',
                            width: 'fit-content',
                            alignSelf: 'end',
                          }}
                          textAlign={'right'}
                        >
                          Undo loan extension
                        </Typography>
                      </>
                    )}
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
        <LoanExtensionRequestDialog
          downloadLoading={downloadState.loading}
          loading={viewState.loading}
          onClickClose={close}
          onClickDownload={async () => {
            if (typeof value?.data?.genAgreement?.downloadId === 'number') {
              await downloadExtensionPdf(value!.data.genAgreement.downloadId);
            }
          }}
          pdfFile={pdfFile}
          visible={visible}
        />
        <LoanExtensionRequestDeleteDialog
          loading={deleteExtensionFileState.loading}
          onClickUndo={async () => {
            if (
              Array.isArray(value?.data?.confirmAgreements) &&
              !!value?.data.confirmAgreements.length
            ) {
              const [first] = value!.data.confirmAgreements;
              await deleteExtensionFile(first.downloadId);
              retry();
              undoClose();
            }
          }}
          undoClose={undoClose}
          undoShow={undoShow}
        />
      </Box>
    </Fade>
  );
});
