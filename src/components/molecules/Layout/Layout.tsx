import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { LayoutHeader, LayoutSide } from './components';

interface LayoutProps {
  isHomepage: boolean;
  sideMenu?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = observer(
  ({ isHomepage, actions, sideMenu, children }) => {
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
