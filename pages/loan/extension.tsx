import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';
import { ServicingSide, StyledLayout } from '@/components/molecules';

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
        <meta content="Corepass Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <StyledLayout isHomepage={false} sideMenu={<ServicingSide />}>
        <DynamicLoanExtensionRequest />
      </StyledLayout>
    </>
  );
});

export default LoanExtensionRequestPage;
