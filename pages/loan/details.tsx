import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { ServicingSide, StyledLayout } from '@/components/molecules';

const DynamicLoanDetails = dynamic(
  () =>
    import('@/components/organisms/Loan/LoanDetails').then(
      (mod) => mod.LoanDetails,
    ),
  {
    ssr: false,
  },
);

const LoanDetailsPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="Corepass Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <StyledLayout isHomepage={false} sideMenu={<ServicingSide />}>
        <DynamicLoanDetails />
      </StyledLayout>
    </>
  );
});

export default LoanDetailsPage;
