import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicLoanDocuments = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanDocuments').then(
      (mod) => mod.LoanDocuments,
    ),
  {
    ssr: true,
  },
);

const LoanDocumentsPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="YouLand Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicLoanDocuments />
    </>
  );
});

export default LoanDocumentsPage;
