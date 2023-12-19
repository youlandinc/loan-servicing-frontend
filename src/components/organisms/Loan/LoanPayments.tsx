import { FC } from 'react';

import { Layout, SideMenu } from '@/components/molecules';

export const LoanPayments: FC = () => {
  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      LoanPayments
    </Layout>
  );
};
