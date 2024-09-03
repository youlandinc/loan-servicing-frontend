import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import ListIcon from '@/svg/portfolio/all_loans_list.svg';

import { StyledButton } from '@/components/atoms';
import {
  AllLoansGrid,
  AllLoansGridToolBar,
  Layout,
} from '@/components/molecules';

export const Portfolio: FC = observer(() => {
  return (
    <Layout isHomepage={false}>
      <Stack gap={1.5} pb={3} pt={3} px={6}>
        <Stack
          alignItems={'center'}
          direction={'row'}
          justifyContent={'space-between'}
        >
          <StyledButton
            size={'small'}
            sx={{
              backgroundColor: 'rgba(91, 118, 188, 0.15) !important',
              fontWeight: '400 !important',
            }}
            variant={'text'}
          >
            <Stack alignItems={'center'} direction={'row'} gap={0.5}>
              <Icon component={ListIcon} sx={{ width: 16, height: 16 }} />
              <Typography variant={'body2'}>All loans</Typography>
            </Stack>
          </StyledButton>
          <AllLoansGridToolBar />
        </Stack>
        <AllLoansGrid />
      </Stack>
    </Layout>
  );
});
