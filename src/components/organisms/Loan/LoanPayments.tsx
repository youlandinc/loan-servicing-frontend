import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Icon, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { utils } from '@/utils';

import { StyledButton } from '@/components/atoms';
import {
  Layout,
  LoanPaymentsCard,
  LoanPaymentsGrid,
  SideMenu,
} from '@/components/molecules';

import LOAN_CARD_01 from '@/svg/loan/payments/payment_card_01.svg';
import LOAN_CARD_02 from '@/svg/loan/payments/payment_card_02.svg';
import LOAN_CARD_03 from '@/svg/loan/payments/payment_card_03.svg';
import LOAN_CARD_04 from '@/svg/loan/payments/payment_card_04.svg';

const mockData = [
  {
    label: 'Interest received',
    icon: LOAN_CARD_01,
    content: utils.formatDollar(30000),
  },
  {
    label: 'Reserve balance',
    icon: LOAN_CARD_02,
    content: utils.formatDollar(1100),
  },
  {
    label: 'Late charges',
    icon: LOAN_CARD_03,
    content: utils.formatDollar(1100),
  },
  {
    label: 'Maturity date',
    icon: LOAN_CARD_04,
    content: utils.formatDate('11/1/2024', 'dd/MM/yyyy'),
  },
];

export const LoanPayments: FC = observer(() => {
  const router = useRouter();

  const [loanId, setLoanId] = useState<string>('');

  useEffect(
    () => {
      const { loanId } = utils.getParamsFromUrl(location.href);

      if (!loanId) {
        router.push('/portfolio');
        return;
      }

      setLoanId(loanId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      <Stack
        gap={3}
        height={'100%'}
        m={'0 auto'}
        maxWidth={{ lg: 1600, xs: 'auto' }}
        minWidth={{ lg: 'auto', xs: 990 }}
        width={'100%'}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography variant={'h6'}>Payments - {loanId}</Typography>
          <Stack flexDirection={'row'} gap={1.25}>
            <StyledButton color={'info'} variant={'outlined'}>
              Update late charges
            </StyledButton>
            {/*<StyledButton color={'info'} variant={'outlined'}>*/}
            {/*  Update interest rate*/}
            {/*</StyledButton>*/}
          </Stack>
        </Stack>
        <Stack
          flexDirection={'row'}
          gap={3}
          justifyContent={'space-between'}
          width={'100%'}
        >
          {mockData.map((item, index) => (
            <LoanPaymentsCard
              content={item.content}
              icon={
                <Icon component={item.icon} sx={{ width: 32, height: 32 }} />
              }
              key={`${item.label}_${index}`}
              label={item.label}
            />
          ))}
        </Stack>
        <LoanPaymentsGrid />
      </Stack>
    </Layout>
  );
});
