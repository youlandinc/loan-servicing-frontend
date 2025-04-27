import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicLoanPayoff = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanPayoff').then(
      (mod) => mod.LoanPayoff,
    ),
  {
    ssr: false,
  },
);

const LoanPaymentsPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="Corepass Software Team" name="description" />
        <meta content="Corepass Loan Servicing System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicLoanPayoff />
    </>
  );
});

export default LoanPaymentsPage;
