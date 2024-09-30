import { LoginWithToken } from '@/components/atoms/LoginWithToken';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

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
        <meta content="YouLand Software Team" name="description" />
        <meta content="YouLand Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <LoginWithToken>
        <DynamicLoanOverview />
      </LoginWithToken>
    </>
  );
});

export default LoanOverviewPage;
