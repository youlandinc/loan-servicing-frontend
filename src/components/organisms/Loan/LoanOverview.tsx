import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { utils } from '@/utils';
import {
  AUTO_HIDE_DURATION,
  LOAN_PRODUCT_CATEGORY,
  LOAN_PURPOSE,
} from '@/constant';

import {
  Layout,
  LoanOverviewCard,
  LoanOverviewCardProps,
  SideMenu,
} from '@/components/molecules';

import { HttpError } from '@/types/common';
import { _fetchOverviewDetails } from '@/request/loan/overview';

import OVERVIEW_CURRENT_BALANCE from '@/svg/loan/overview/overview-current-balance.svg';
import OVERVIEW_LOAN_INFORMATION from '@/svg/loan/overview/overview-loan-information.svg';
import OVERVIEW_BORROWER_INFORMATION from '@/svg/loan/overview/overview-borrower-information.svg';
import OVERVIEW_BROKER_INFORMATION from '@/svg/loan/overview/overview-broker-information.svg';
import OVERVIEW_NEXT_DUE_DATE from '@/svg/loan/overview/overview-next-due-date.svg';
import OVERVIEW_MATURITY_DATE from '@/svg/loan/overview/overview-maturity-date.svg';

const INITIAL: LoanOverviewCardProps = {
  header: '',
  theme: 'light',
  headerValue: '',
  headerIcon: OVERVIEW_CURRENT_BALANCE,
  listData: [],
};

export const LoanOverview: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { loading } = useAsync(async () => {
    const { loanId } = utils.getParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const { data } = await _fetchOverviewDetails(loanId);
      setCurrenBalance({
        theme: 'dark',
        header: 'Current balance',
        headerValue: utils.formatDollar(data.currentBalance),
        headerIcon: OVERVIEW_CURRENT_BALANCE,
        listData: [
          {
            label: 'Original balance',
            value: utils.formatDollar(data.principalBalance),
          },
          {
            label: 'Note rate',
            value: `${data.interestRate ?? ''}%`,
          },
          {
            label: 'Term',
            value: `${data.loanTerm ?? ''} months`,
          },
          {
            label: 'Monthly payment',
            value: utils.formatDollar(data.monthlyPayment),
          },
        ],
      });
      setLoanInfo({
        theme: 'light',
        header: 'Loan information',
        headerValue: utils.findLabel(
          LOAN_PRODUCT_CATEGORY,
          data.productCategory,
        ),
        headerIcon: OVERVIEW_LOAN_INFORMATION,
        listData: [
          {
            label: 'Loan purpose',
            value: utils.findLabel(LOAN_PURPOSE, data.loanPurpose),
          },
          {
            label: 'Rehab cost',
            value: '',
          },
          {
            label: 'Cash-out amount',
            value: '',
          },
          {
            label: 'Loan to value',
            value: '',
          },
          {
            label: 'Loan to cost',
            value: '',
          },
        ],
        tailData: [
          {
            label: 'Investor',
            value: data.investor,
          },
        ],
      });
      setBorrowerInfo({
        theme: 'light',
        header: 'Borrower information',
        headerValue: data.borrowerName,
        headerIcon: OVERVIEW_BORROWER_INFORMATION,
        listData: [
          {
            label: `Phone: ${
              data.borrowerPhone
                ? utils.formatUSPhoneToText(data.borrowerPhone)
                : '-'
            }`,
            value: '',
          },
          {
            label: `Email: ${data.borrowerEmail ?? '-'}`,
            value: '',
          },
        ],
      });

      const { brokerDetail } = data;
      setBrokerInfo({
        theme: 'light',
        header: 'Broker information',
        headerValue: brokerDetail?.name,
        headerIcon: OVERVIEW_BROKER_INFORMATION,
        listData: [
          {
            label: `Phone: ${
              brokerDetail.phone
                ? utils.formatUSPhoneToText(brokerDetail.phone)
                : '-'
            }`,
            value: '',
          },
          {
            label: `Email: ${brokerDetail.email ?? '-'}`,
            value: '',
          },
        ],
      });

      setNextDueDate({
        theme: 'light',
        header: 'Next due date',
        headerValue: utils.formatDate(data.nextDueDate),
        headerIcon: OVERVIEW_NEXT_DUE_DATE,
        listData: [
          {
            label: `Paid to ${utils.formatDate(data.nextPaymentDate)}`,
            value: '',
          },
        ],
      });
      setMaturityDate({
        theme: 'light',
        header: 'Maturity date',
        headerValue: utils.formatDate(data.fciMaturityDate),
        headerIcon: OVERVIEW_MATURITY_DATE,
        listData: [
          { label: <Typography>Check the extension</Typography>, value: '' },
        ],
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  const [currentBalance, setCurrenBalance] =
    useState<LoanOverviewCardProps>(INITIAL);
  const [loanInfo, setLoanInfo] = useState<LoanOverviewCardProps>(INITIAL);
  const [borrowerInfo, setBorrowerInfo] =
    useState<LoanOverviewCardProps>(INITIAL);
  const [brokerInfo, setBrokerInfo] = useState<LoanOverviewCardProps>(INITIAL);
  const [maturityDate, setMaturityDate] =
    useState<LoanOverviewCardProps>(INITIAL);
  const [nextDueDate, setNextDueDate] =
    useState<LoanOverviewCardProps>(INITIAL);

  return (
    <Layout isHomepage={false} isInside={true} sideMenu={<SideMenu />}>
      <Fade in={!loading}>
        <Stack flexDirection={'row'} gap={3} overflow={'auto'}>
          <Stack flexShrink={0} gap={3} width={{ xs: 320, xl: 400 }}>
            <LoanOverviewCard {...currentBalance} />
            <LoanOverviewCard {...loanInfo} />
            <LoanOverviewCard {...borrowerInfo} />
            <LoanOverviewCard {...brokerInfo} />
          </Stack>
          <Stack flex={1} gap={3} minWidth={800}>
            <Stack flexDirection={'row'} gap={3} width={'100%'}>
              <LoanOverviewCard {...nextDueDate} />
              <LoanOverviewCard {...maturityDate} />
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </Layout>
  );
};
