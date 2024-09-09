import {
  StyledButton,
  StyledDatePicker,
  StyledHeaderAddressInfo,
  StyledSelect,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { Layout, SideMenu } from '@/components/molecules';
import { MATURITY_DATE } from '@/constant';

import { _getExtensionInfo } from '@/request';
import { MaturityDateTypeEnum } from '@/types/enum';
import { utils } from '@/utils';
import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { FC, useState } from 'react';
import { useAsync } from 'react-use';

export const LoanExtensionRequest: FC = () => {
  const router = useRouter();
  const { loanId } = router.query;

  const [changeRate, setChangeRate] = useState(12);
  const [extensionFee, setExtensionFee] = useState(1);
  const [executionDate, setExtensionDate] = useState(dayjs());
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

  return (
    <Layout isHomepage={false} isInside={true} sideMenu={<SideMenu />}>
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
            <Stack component={'ul'} gap={3} width={'50%'}>
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
                  {utils.formatPercent(extensionFee / 100, 2)}(
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
                <Typography variant={'subtitle2'}></Typography>
              </Stack>
            </Stack>
            <Stack gap={1.25} width={'50%'}>
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
                suffix={'%'}
                value={extensionFee}
              />
              <StyledTextFieldNumber
                decimalScale={3}
                label={'Change the interest rate to:'}
                onValueChange={(values) => {
                  setChangeRate(values.floatValue ?? 0);
                }}
                suffix={'%'}
                value={changeRate}
              />
              <StyledDatePicker
                onChange={(value, context) => {
                  console.log(value, context);
                }}
                value={executionDate}
              />
            </Stack>
          </Stack>
          <StyledButton
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
