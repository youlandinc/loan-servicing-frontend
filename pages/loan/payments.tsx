import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicLoanPayments = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanPayments').then(
      (mod) => mod.LoanPayments,
    ),
  {
    ssr: false,
  },
);

const LoanPaymentsPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="YouLand Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicLoanPayments />
    </>
  );
});

export default LoanPaymentsPage;
