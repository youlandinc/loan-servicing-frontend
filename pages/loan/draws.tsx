import dynamic from 'next/dynamic';
import Head from 'next/head';

import { observer } from 'mobx-react-lite';

const DynamicLoanDraws = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanDraws').then(
      (mod) => mod.LoanDraws,
    ),
  {
    ssr: false,
  },
);

const LoanDrawsPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="Corepass Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicLoanDraws />
    </>
  );
});

export default LoanDrawsPage;
