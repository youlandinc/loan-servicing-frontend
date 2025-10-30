import { FC, PropsWithChildren } from 'react';
import { useAsync } from 'react-use';

import { CircularProgress, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { rootStore, useMst } from '@/models/Root';
import { _fetchUserInfoWithToken } from '@/request/user';
import { utils } from '@/utils';

export type LoginWithTokenProps = {
  success?: () => void;
  routeTo?: string;
};

export const LoginWithToken: FC<PropsWithChildren<LoginWithTokenProps>> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  routeTo,
  children,
}) => {
  const router = useRouter();

  const store = useMst();

  const { userSetting } = store;
  const { loading } = useAsync(async () => {
    const { token, loanId } = utils.getParamsFromUrl(location.href);
    if (token) {
      await _fetchUserInfoWithToken(token)
        .then((res) => {
          const {
            data: { accessToken, refreshToken, userProfile },
          } = res;
          store.injectCognitoUserSession({ accessToken, refreshToken });
          store.injectCognitoUserProfile(userProfile);
          localStorage.setItem('USER_LOGIN_INFORMATION', accessToken);
          localStorage.setItem(
            'USER_PROFILE_INFORMATION',
            userProfile.accountId,
          );
          userSetting.setAccountId(userProfile.accountId);
          routeTo
            ? router.push(routeTo)
            : router.push(`${router.pathname}?loanId=${loanId}`);
        })
        .catch(() => {
          rootStore.logout();
        });
    }
  }, []);

  return (
    <>
      {router.query?.token ? (
        loading ? (
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
        ) : (
          children
        )
      ) : (
        children
      )}
    </>
  );
};
