import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicLoanExtensionRequest = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanExtensionRequest').then(
      (mod) => mod.LoanExtensionRequest,
    ),
  {
    ssr: false,
  },
);

const LoanExtensionRequestPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="YouLand Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicLoanExtensionRequest />
    </>
  );
});

export default LoanExtensionRequestPage;
