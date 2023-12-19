import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Layout, PortfolioGrid } from '@/components/molecules';

export const Portfolio: FC = observer(() => {
  return (
    <Layout isHomepage={false}>
      <PortfolioGrid />
    </Layout>
  );
});
