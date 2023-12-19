import { FC } from 'react';

import { Layout, SideMenu } from '@/components/molecules';

export const LoanDocuments: FC = () => {
  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      LoanDocuments
    </Layout>
  );
};
