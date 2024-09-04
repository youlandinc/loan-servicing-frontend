import { FC } from 'react';

import { Layout, SideMenu } from '@/components/molecules';

export const LoanDraws: FC = () => {
  return (
    <Layout isHomepage={false} isInside={true} sideMenu={<SideMenu />}>
      LoanDraws
    </Layout>
  );
};
