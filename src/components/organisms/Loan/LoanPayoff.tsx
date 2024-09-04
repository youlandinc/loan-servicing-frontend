import { FC } from 'react';

import { Layout, SideMenu } from '@/components/molecules';

export const LoanPayoff: FC = () => {
  return (
    <Layout isHomepage={false} isInside={true} sideMenu={<SideMenu />}>
      LoanPayoff
    </Layout>
  );
};
