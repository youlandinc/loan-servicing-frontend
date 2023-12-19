import { FC } from 'react';

import { Layout, SideMenu } from '@/components/molecules';

export const LoanDetails: FC = () => {
  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      LoanDetails
    </Layout>
  );
};
