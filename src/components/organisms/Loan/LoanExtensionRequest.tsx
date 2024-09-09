import { IGetExtensionPdfParam } from '@/types/loan/extension';
import { FC, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useAsync, useAsyncFn } from 'react-use';

import {
  StyledButton,
  StyledDatePicker,
  StyledHeaderAddressInfo,
  StyledSelect,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { Layout, SideMenu } from '@/components/molecules';
import { MATURITY_DATE } from '@/constant';

import { _createExtensionPdf, _getExtensionInfo } from '@/request';
import { MaturityDateTypeEnum } from '@/types/enum';
import { utils } from '@/utils';

export const LoanExtensionRequest: FC = () => {
  const router = useRouter();
  const { loanId } = router.query;

  const formRef = useRef<HTMLFormElement | null>(null);

  const [changeRate, setChangeRate] = useState(12);
  const [extensionFee, setExtensionFee] = useState(1);
  const [executionDate, setExtensionDate] = useState<Dayjs | null>(dayjs());
  const [maturityDate, setMaturityDate] = useState(
    MaturityDateTypeEnum.EXTEND_3,
  );

  const { value } = useAsync(async () => {
    return typeof loanId === 'string'
      ? await _getExtensionInfo(parseInt(loanId as string)).catch(
          ({ message, variant, header }) => {
            enqueueSnackbar(message, { variant, isSimple: !header, header });
          },
        )
      : null;
  }, [loanId]);

  const [state, createExtensionPdf] = useAsyncFn(
    async (param: IGetExtensionPdfParam) => {
      if (!formRef.current?.reportValidity()) {
        return;
      }
      return await _createExtensionPdf(param).catch(
        ({ message, variant, header }) => {
          enqueueSnackbar(message, { variant, isSimple: !header, header });
        },
      );
    },
    [formRef.current],
  );

  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      {value?.data && (
        <Stack m={'0 auto'} maxWidth={900} spacing={3} width={'100%'}>
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
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography color={'text.hover'} variant={'body2'}>
                  Current interest rate
                </Typography>
                <Typography variant={'subtitle2'}>
                  {utils.formatPercent(value.data.currentInterestRate / 100)}
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography color={'text.hover'} variant={'body2'}>
                  Extension fee
                </Typography>
                <Typography variant={'subtitle2'}>
                  {utils.formatPercent(extensionFee / 100, 2)} (
                  {utils.formatDollar(
                    value.data.totalLoanAmount * extensionFee * 0.01,
                  )}
                  )
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography color={'text.hover'} variant={'body2'}>
                  Default rate
                </Typography>
                <Typography variant={'subtitle2'}>
                  {utils.formatPercent(value.data.defaultRate / 100)}
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography color={'text.hover'} variant={'body2'}>
                  Change the interest rate to:
                </Typography>
                <Typography variant={'subtitle2'}>
                  {utils.formatPercent(changeRate / 100)}
                </Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography color={'text.hover'} variant={'body2'}>
                  Execution date
                </Typography>
                <Typography variant={'subtitle2'}>
                  {dayjs(executionDate).format('MM/DD/YYYY')}
                </Typography>
              </Stack>
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
              if (executionDate !== null) {
                await createExtensionPdf({
                  loanId: parseInt(loanId as string),
                  maturityDate: maturityDate,
                  extensionFee,
                  changeInterestRate: changeRate,
                  executionDate: executionDate.format('YYYY-MM-DD'),
                });
              }
            }}
            size={'small'}
            sx={{ alignSelf: 'flex-start' }}
            variant={'outlined'}
          >
            Generate agreement
          </StyledButton>
          <Box
            color={'primary.main'}
            component={'a'}
            fontSize={18}
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            Extension agreement - Generated day
          </Box>
          <Typography color={'info.main'}>
            The generated extension agreement has been added to the Documents
            folder for this loan.
          </Typography>
        </Stack>
      )}
    </Layout>
  );
};
