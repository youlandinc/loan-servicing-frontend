import { FC } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { StyledButton } from '@/components/atoms';

import BACK from './back.svg';

import MENU_LOGO_01 from './menu_01.svg';
import MENU_LOGO_02 from './menu_02.svg';
import MENU_LOGO_03 from './menu_03.svg';
import MENU_LOGO_04 from './menu_04.svg';
import MENU_LOGO_05 from './menu_05.svg';

const MENU_LIST = [
  {
    icon: MENU_LOGO_01,
    label: 'payments',
    key: 'LOAN_PAYMENTS',
    url: '/loan/payments',
  },
  {
    icon: MENU_LOGO_02,
    label: 'Extension request',
    key: 'LOAN_EXTENSION_REQUEST',
    url: '/loan/extension_request',
  },
  {
    icon: MENU_LOGO_03,
    label: 'Payoff',
    key: 'LOAN_PAYOFF',
    url: '/loan/payoff',
  },
  {
    icon: MENU_LOGO_04,
    label: 'loan details',
    key: 'LOAN_DETAILS',
    url: '/loan/details',
  },
  {
    icon: MENU_LOGO_05,
    label: 'Documents',
    key: 'LOAN_DOCUMENTS',
    url: '/loan/documents',
  },
];

export const SideMenu: FC = observer(() => {
  const router = useRouter();

  return (
    <Box
      flexShrink={0}
      overflow={'auto'}
      px={2.5}
      py={5.5}
      sx={{
        borderRight: '1px solid',
        borderColor: 'action.loading',
      }}
      width={{ lg: 320, xs: 280 }}
    >
      <Stack gap={1}>
        <StyledButton
          color={'info'}
          onClick={() => router.push('/portfolio')}
          sx={{
            mb: 3,
            fontSize: { xs: 14, xl: 16 },
          }}
          variant={'outlined'}
        >
          <Icon component={BACK} sx={{ width: 24, height: 24, mr: 1 }} />
          Back to portfolio
        </StyledButton>
        {MENU_LIST.map((item, index) => (
          <Typography
            border={'1px solid transparent'}
            borderRadius={3}
            className={router.pathname === item.url ? 'active' : ''}
            gap={1}
            key={`${item.key}_${index}`}
            onClick={() =>
              router.push({
                pathname: item.url,
                query: { id: router.query.id },
              })
            }
            p={'12px 24px'}
            sx={{
              transition: 'all .3s',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              '&:hover': {
                bgcolor: 'primary.background',
                color: 'primary.contrastBackground',
                svg: {
                  path: { fill: '#365EC6' },
                },
              },
              '&.active': {
                color: 'primary.main',
                bgcolor: 'primary.light',
                svg: {
                  path: { fill: '#5B76BC' },
                },
              },
              fontSize: { xs: 14, xl: 16 },
            }}
            variant={'body1'}
          >
            <Icon component={item.icon} sx={{ width: 24, height: 24 }} />
            {item.label}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
});
