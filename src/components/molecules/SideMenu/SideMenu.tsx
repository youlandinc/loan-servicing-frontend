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
import MENU_LOGO_07 from './menu-07.svg';

const MENU_LIST = [
  {
    icon: MENU_LOGO_01,
    label: 'Overview',
    key: 'LOAN_OVERVIEW',
    url: '/loan/overview',
  },
  {
    icon: MENU_LOGO_07,
    label: 'AOM',
    key: 'LOAN_AOM',
    url: '/loan/aom',
  },
  {
    icon: MENU_LOGO_02,
    label: 'Payments',
    key: 'LOAN_PAYMENTS',
    url: '/loan/payments',
  },

  // {
  //   icon: MENU_LOGO_03,
  //   label: 'Draws',
  //   key: 'LOAN_DRAWS',
  //   url: '/loan/draws',
  // },
  {
    icon: MENU_LOGO_04,
    label: 'Extension',
    key: 'LOAN_EXTENSION',
    url: '/loan/extension',
  },
  // {
  //   icon: MENU_LOGO_05,
  //   label: 'Payoff',
  //   key: 'LOAN_PAYOFF',
  //   url: '/loan/payoff',
  // },
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
      px={1.5}
      py={3}
      sx={{
        borderRight: '1px solid',
        borderColor: 'action.loading',
      }}
      width={245}
    >
      <Stack gap={1}>
        <StyledButton
          color={'info'}
          onClick={() => router.push('/portfolio')}
          size={'small'}
          sx={{
            fontSize: 14,
            fontWeight: '400 !important',
            borderColor: 'transparent !important',
            justifyContent: 'flex-start !important',
            pl: '6px !important',
          }}
          variant={'outlined'}
        >
          <Icon component={BACK} sx={{ width: 24, height: 24, mr: 1 }} />
          Back to portfolio
        </StyledButton>

        <Stack
          bgcolor={'#D2D6E1'}
          height={'1px'}
          mb={1.5}
          mt={0.5}
          width={'100%'}
        />

        {MENU_LIST.map((item, index) => (
          <Typography
            border={'1px solid transparent'}
            borderRadius={3}
            className={router.pathname === item.url ? 'active' : ''}
            gap={1}
            height={40}
            key={`${item.key}_${index}`}
            onClick={() =>
              router.push({
                pathname: item.url,
                query: { loanId: router.query.loanId },
              })
            }
            pl={2.5}
            py={1.5}
            sx={{
              transition: 'all .3s',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
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
              fontSize: 14,
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
