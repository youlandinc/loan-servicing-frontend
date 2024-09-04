import { FC } from 'react';

import { Layout, SideMenu } from '@/components/molecules';

export const LoanOverview: FC = () => {
  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      LoanOverview
    </Layout>
  );
};
