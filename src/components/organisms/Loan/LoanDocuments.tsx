import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';

import { utils } from '@/utils';

import { StyledButton } from '@/components/atoms';
import { Layout, LoanDocumentsGrid, SideMenu } from '@/components/molecules';

export const LoanDocuments: FC = () => {
  const router = useRouter();

  const [id, setId] = useState<string>('');

  useEffect(
    () => {
      const { id } = utils.getParamsFromUrl(location.href);

      if (!id) {
        router.push('/portfolio');
        return;
      }

      setId(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      <Stack
        gap={3}
        height={'100%'}
        m={'0 auto'}
        maxWidth={{ lg: 1600, xs: 'auto' }}
        minWidth={{ lg: 'auto', xs: 990 }}
        width={'100%'}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography variant={'h6'}>Documents</Typography>
          <Stack flexDirection={'row'} gap={1.25}>
            <StyledButton
              color={'info'}
              sx={{ width: 100 }}
              variant={'outlined'}
            >
              Refresh
            </StyledButton>
            <StyledButton sx={{ width: 100 }}>Export</StyledButton>
          </Stack>
        </Stack>
        <LoanDocumentsGrid />
      </Stack>
    </Layout>
  );
};
