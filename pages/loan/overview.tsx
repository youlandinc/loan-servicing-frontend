import dynamic from 'next/dynamic';
import Head from 'next/head';

import { observer } from 'mobx-react-lite';

import { LoginWithToken } from '@/components/atoms/LoginWithToken';

const DynamicLoanOverview = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanOverview').then(
      (mod) => mod.LoanOverview,
    ),
  {
    ssr: false,
  },
);

const LoanOverviewPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="Corepass Software Team" name="description" />
        <meta content="Loan Servicing System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <LoginWithToken>
        <DynamicLoanOverview />
      </LoginWithToken>
    </>
  );
});

export default LoanOverviewPage;
