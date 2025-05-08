import { FC } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { rootStore, useMst } from '@/models/Root';

import { utils } from '@/utils';

import { _fetchUserInfoWithToken } from '@/request/user';

export const SignIn: FC = observer(() => {
  const router = useRouter();

  const store = useMst();

  const { userSetting } = store;
  const { loading } = useAsync(async () => {
    const { token } = utils.getParamsFromUrl(location.href);
    if (!token) {
      return rootStore.logout();
    }
    await _fetchUserInfoWithToken(token)
      .then((res) => {
        const {
          data: { accessToken, refreshToken, userProfile },
        } = res;
        store.injectCognitoUserSession({ accessToken, refreshToken });
        store.injectCognitoUserProfile(userProfile);
        localStorage.setItem('USER_LOGIN_INFORMATION', accessToken);
        localStorage.setItem('USER_PROFILE_INFORMATION', userProfile.accountId);
        userSetting.setAccountId(userProfile.accountId);
        router.push('/portfolio');
      })
      .catch(() => {
        rootStore.logout();
      });
  }, []);

  return !loading ? (
    <Stack
      alignItems={'center'}
      height={'100vh'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100vw'}
    >
      <CircularProgress
        sx={{
          width: 24,
          height: 24,
          background: 'background.white',
          color: 'action.loading',
        }}
      />
    </Stack>
  ) : null;
});
