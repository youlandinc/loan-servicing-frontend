import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicLoanDetails = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanDetails').then(
      (mod) => mod.LoanDetails,
    ),
  {
    ssr: true,
  },
);

const LoanDetailsPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="YouLand Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicLoanDetails />
    </>
  );
});

export default LoanDetailsPage;
