import dynamic from 'next/dynamic';
import Head from 'next/head';

import { observer } from 'mobx-react-lite';

import { ServicingSide, StyledLayout } from '@/components/molecules';

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
        <meta content="Corepass Software Team" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <StyledLayout sideMenu={<ServicingSide />}>
        <DynamicLoanAOM />
      </StyledLayout>
    </>
  );
});

export default LoanPaymentsPage;
