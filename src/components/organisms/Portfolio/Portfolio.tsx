import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PortfolioGrid } from '@/components/molecules';

import { Layout } from '@/components/molecules/Layout/Layout';

export const Portfolio: FC = observer(() => {
  return (
    <Layout isHomepage={false}>
      <PortfolioGrid />
    </Layout>
  );
});
