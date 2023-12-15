import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PortfolioGrid } from '@/components/molecules';

import { Layout } from '@/components/molecules/Layout/Layout';
import { StyledButton } from '@/components/atoms';

export const Portfolio: FC = observer(() => {
  return (
    <Layout
      actions={<StyledButton size={'small'}>123</StyledButton>}
      isHomepage={false}
      //sideMenu={
      //  <Stack width={300} border={'1px solid'}>
      //    123123123123
      //  </Stack>
      //}
    >
      <PortfolioGrid />
    </Layout>
  );
});
