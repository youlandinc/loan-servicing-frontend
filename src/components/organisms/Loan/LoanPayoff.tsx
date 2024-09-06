import { FC } from 'react';

import { Layout, SideMenu } from '@/components/molecules';

export const LoanPayoff: FC = () => {
  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      LoanPayoff
    </Layout>
  );
};
