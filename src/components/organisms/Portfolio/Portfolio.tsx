import { FC } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { PortfolioGrid } from '@/components/molecules';

import { Layout } from '@/components/molecules/Layout/Layout';

export const Portfolio: FC = observer(() => {
  return (
    <Layout isHomepage={false}>
      <Stack p={{ xs: 3 }}>
        <PortfolioGrid />
      </Stack>
    </Layout>
  );
});
