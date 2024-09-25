import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicLoanAOM = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanAOM').then((mod) => mod.LoanAOM),
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
      <DynamicLoanAOM />
    </>
  );
});

export default LoanPaymentsPage;
