import { FC, ReactNode, useEffect } from 'react';
import { Stack } from '@mui/material';

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
    const { fetchUserSetting, fetchUserLicensedProduct } = userSetting;

    useEffect(
      () => {
        const token =
          session?.accessToken ||
          localStorage?.getItem('USER_LOGIN_INFORMATION');
        if (!token) {
          return store.logout();
        }
        fetchUserSetting();
        fetchUserLicensedProduct();
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
        >
          {isHomepage ? <LayoutSide /> : sideMenu}
          <Stack flex={1} minWidth={996} overflow={'auto'} py={6}>
            {children}
          </Stack>
        </Stack>
      </Stack>
    );
  },
);
