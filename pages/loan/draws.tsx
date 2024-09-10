import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicLoanDraws = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanDraws').then(
      (mod) => mod.LoanDraws,
    ),
  {
    ssr: true,
  },
);

const LoanDrawsPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="YouLand Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicLoanDraws />
    </>
  );
});

export default LoanDrawsPage;