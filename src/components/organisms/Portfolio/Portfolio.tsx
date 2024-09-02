import { FC } from 'react';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { StyledButton } from '@/components/atoms';
import { AllLoansGrid, Layout } from '@/components/molecules';

export const Portfolio: FC = observer(() => {
  return (
    <Layout isHomepage={false}>
      <Stack gap={1.5} pb={3} pt={3} px={6}>
        <Stack direction={'row'}>
          <StyledButton size={'small'} variant={'text'}>
            All loans
          </StyledButton>
        </Stack>
        <AllLoansGrid />
      </Stack>
    </Layout>
  );
});
