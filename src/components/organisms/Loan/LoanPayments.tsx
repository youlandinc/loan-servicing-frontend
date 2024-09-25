import { FC, useState } from 'react';
//import { useRouter } from 'next/router';
import { CircularProgress, Fade, Icon, Stack } from '@mui/material';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import { utils } from '@/utils';

import { StyledHeaderAddressInfo } from '@/components/atoms';
import {
  Layout,
  LoanPaymentsCard,
  LoanPaymentsGrid,
  SideMenu,
} from '@/components/molecules';

import { PipelineStatusEnum } from '@/types/enum';
import { _fetchPaymentsDetails } from '@/request/loan/payments';

import LOAN_CARD_01 from '@/svg/loan/payments/payment_card_01.svg';
import LOAN_CARD_02 from '@/svg/loan/payments/payment_card_02.svg';
import LOAN_CARD_03 from '@/svg/loan/payments/payment_card_03.svg';
import LOAN_CARD_04 from '@/svg/loan/payments/payment_card_04.svg';

export const LoanPayments: FC = observer(() => {
  //const router = useRouter();

  const { loading } = useAsync(async () => {
    const { loanId } = utils.getParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }

    const { data } = await _fetchPaymentsDetails(loanId);
    setHeaderAddressInfo({
      address: data.propertyFullAddress,
      loanNumber: data.loanNumber,
      status: data.repaymentStatus as string as PipelineStatusEnum,
    });

    setSummaries([
      {
        label: 'Interest received',
        icon: LOAN_CARD_01,
        content: utils.formatDollar(data.interestReceived),
      },
      {
        label: 'Reserve balance',
        icon: LOAN_CARD_02,
        content: utils.formatDollar(data.reserveBalance),
      },
      {
        label: 'Late charges',
        icon: LOAN_CARD_03,
        content: utils.formatDollar(data.lateChargesReceived),
      },
      {
        label: 'Next due date',
        icon: LOAN_CARD_04,
        content: utils.formatDate(data.nextDueDate, 'dd/MM/yyyy'),
      },
    ]);
  }, []);

  const [headerAddressInfo, setHeaderAddressInfo] = useState({
    address: '',
    loanNumber: '',
    status: PipelineStatusEnum.PERFORMING,
  });
  const [summaries, setSummaries] = useState<
    Array<{ label: string; icon: any; content: string }>
  >([]);

  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      {loading ? (
        <Stack
          alignItems={'center'}
          height={'100%'}
          justifyContent={'center'}
          width={'100%'}
        >
          <CircularProgress sx={{ color: '#E3E3EE' }} />
        </Stack>
      ) : (
        <Fade in={!loading}>
          <Stack gap={3} height={'100%'} pt={6} width={'100%'}>
            <Stack px={6} width={'100%'}>
              <StyledHeaderAddressInfo {...headerAddressInfo} />
            </Stack>

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              px={6}
              width={'100%'}
            >
              {summaries.map((item, index) => (
                <LoanPaymentsCard
                  content={item.content}
                  icon={
                    <Icon
                      component={item.icon}
                      sx={{ width: 32, height: 32 }}
                    />
                  }
                  key={`${item.label}_${index}`}
                  label={item.label}
                />
              ))}
            </Stack>

            <Stack
              bgcolor={'white'}
              border={'1px solid #E4E7EF'}
              borderRadius={2}
              maxHeight={'calc(100% - 305px)'}
              mx={6}
            >
              <LoanPaymentsGrid maxHeight={'calc(100% - 2px)'} />
            </Stack>
          </Stack>
        </Fade>
      )}
    </Layout>
  );
});
