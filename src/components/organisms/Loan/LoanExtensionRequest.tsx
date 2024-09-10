import { FC, useRef, useState } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useAsync, useAsyncFn } from 'react-use';

import { useRenderPdf, useSwitch } from '@/hooks';

import { IGetExtensionPdfParam } from '@/types/loan/extension';

import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
  StyledHeaderAddressInfo,
  StyledLoading,
  StyledSelect,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { Layout, SideMenu } from '@/components/molecules';
import { MATURITY_DATE } from '@/constant';

import {
  _createExtensionPdf,
  _downloadExtensionPdf,
  _getExtensionInfo,
  _viewExtensionPdf,
} from '@/request';
import { MaturityDateTypeEnum } from '@/types/enum';
import { createFile, utils } from '@/utils';

export const LoanExtensionRequest: FC = () => {
  const router = useRouter();
  const { loanId } = router.query;

  const formRef = useRef<HTMLFormElement | null>(null);
  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const [changeRate, setChangeRate] = useState(12);
  const [extensionFee, setExtensionFee] = useState(1);
  const [executionDate, setExtensionDate] = useState<Dayjs | null>(dayjs());
  const [maturityDate, setMaturityDate] = useState(
    MaturityDateTypeEnum.EXTEND_3,
  );
  const [downloadId, setDownloadId] = useState<number | null>(null);
  const { visible, open, close } = useSwitch();

  const { value } = useAsync(async () => {
    return typeof loanId === 'string'
      ? await _getExtensionInfo(parseInt(loanId as string))
          .then((res) => {
            setDownloadId(res.data.downloadId);
            return res;
          })
          .catch(({ message, variant, header }) => {
            enqueueSnackbar(message, { variant, isSimple: !header, header });
          })
      : null;
  }, [loanId]);

  const cardInfo: Record<string, any> = {
    'Current interest rate': utils.formatPercent(
      (value?.data?.currentInterestRate || 0) / 100,
    ),
    'Extension fee': ` ${utils.formatPercent(
      extensionFee / 100,
      2,
    )}  (${utils.formatDollar(
      (value?.data?.totalLoanAmount || 0) * extensionFee * 0.01,
    )})`,
    'Default rate': utils.formatPercent((value?.data?.defaultRate || 0) / 100),
    'Change the interest rate to:': utils.formatPercent(changeRate / 100),
    'Execution date': dayjs(executionDate).format('MM/DD/YYYY'),
  };

  const [state, createExtensionPdf] = useAsyncFn(
    async (param: IGetExtensionPdfParam) => {
      if (!formRef.current?.reportValidity()) {
        return;
      }
      return await _createExtensionPdf(param)
        .then((res) => {
          setDownloadId(res.data);
        })
        .catch(({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        });
    },
    [formRef.current],
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

  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      <Stack direction={'row'} justifyContent={'center'} p={6}>
        {value?.data && (
          <Stack maxWidth={900} spacing={3} width={'100%'}>
            <StyledHeaderAddressInfo
              address={value.data.propertyFullAddress}
              loanNumber={value.data.loanNumber}
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
                <StyledTextFieldNumber
                  decimalScale={3}
                  label={'Change the interest rate to:'}
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
                    executionDate: executionDate.format('YYYY-MM-DD'),
                    maturityDate: value.data.maturityDate,
                    extensionFeeAmount: 0,
                  });
                }
              }}
              size={'small'}
              sx={{ alignSelf: 'flex-start', width: 181 }}
              variant={'outlined'}
            >
              Generate agreement
            </StyledButton>
            {typeof value?.data?.createdTime === 'string' && (
              <Box
                color={'primary.main'}
                component={'a'}
                fontSize={18}
                onClick={async () => {
                  open();
                  await viewExtensionPdf();
                }}
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                Extension agreement -
                {utils.formatDate(value?.data?.createdTime, 'MM/d/yyyy')}
              </Box>
            )}
            <Typography color={'info.main'}>
              The generated extension agreement has been added to the Documents
              folder for this loan.
            </Typography>
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
    </Layout>
  );
};
