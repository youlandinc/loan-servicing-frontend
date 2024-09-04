import { FC } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { StyledButton } from '@/components/atoms';

import BACK from './back.svg';

import MENU_LOGO_01 from './menu-01.svg';
import MENU_LOGO_02 from './menu-02.svg';
import MENU_LOGO_03 from './menu-03.svg';
import MENU_LOGO_04 from './menu-04.svg';
import MENU_LOGO_05 from './menu-05.svg';
import MENU_LOGO_06 from './menu-06.svg';

const MENU_LIST = [
  {
    icon: MENU_LOGO_01,
    label: 'Overview',
    key: 'LOAN_OVERVIEW',
    url: '/loan/overview',
  },
  {
    icon: MENU_LOGO_02,
    label: 'Payments',
    key: 'LOAN_PAYMENTS',
    url: '/loan/payments',
  },
  {
    icon: MENU_LOGO_03,
    label: 'Draws',
    key: 'LOAN_DRAWS',
    url: '/loan/draws',
  },
  {
    icon: MENU_LOGO_04,
    label: 'Extension',
    key: 'LOAN_EXTENSION',
    url: '/loan/extension',
  },
  {
    icon: MENU_LOGO_05,
    label: 'Payoff',
    key: 'LOAN_PAYOFF',
    url: '/loan/payoff',
  },
  {
    icon: MENU_LOGO_06,
    label: 'Loan details',
    key: 'LOAN_DETAILS',
    url: '/loan/details',
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
                query: { loanId: router.query.loanId },
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
