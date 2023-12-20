import { FC, ReactNode, useEffect } from 'react';
import { Box, Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { LayoutHeader, LayoutSide } from './components';

interface LayoutProps {
  isHomepage: boolean;
  sideMenu?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = observer(
  ({ isHomepage, actions, sideMenu, children }) => {
    const store = useMst();
    const { userSetting, session } = store;
    const { fetchUserSetting, fetchUserLicensedProduct, initialized } =
      userSetting;

    useEffect(
      () => {
        const token =
          session?.accessToken ||
          localStorage?.getItem('USER_LOGIN_INFORMATION');
        if (!token) {
          return store.logout();
        }
        if (!initialized) {
          fetchUserSetting();
          fetchUserLicensedProduct();
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return (
      <Stack height={'100vh'} minHeight={'100vh'} width={'100%'}>
        <LayoutHeader actions={actions} isHomepage={isHomepage} />
        <Stack
          flex={1}
          flexDirection={'row'}
          height={{ xl: 'calc(100% - 88px)', xs: 'calc(100% - 60px)' }}
          overflow={'hidden'}
          width={'100%'}
        >
          {isHomepage ? <LayoutSide /> : sideMenu}
          <Box
            bgcolor={'primary.lighter'}
            height={'100%'}
            overflow={'auto'}
            px={{ lg: '7.5%', xs: 6 }}
            py={6}
            width={'100%'}
          >
            {children}
          </Box>
        </Stack>
      </Stack>
    );
  },
);
