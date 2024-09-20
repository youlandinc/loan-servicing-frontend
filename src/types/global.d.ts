interface Option {
  key: string | number;
  value: string | number;
  label: string | React.ReactNode;
  subComponent?: React.ReactNode;
}

interface UserSession {
  accessToken: {
    jwtToken: string;
  };
  idToken: {
    jwtToken: string;
  };
  refreshToken: {
    token: string;
  };
}

interface ClientUserProfile {
  username?: string | undefined;
  email?: string | undefined;
  userType?: import('@/types/enum.ts').UserType | undefined;
  loginType?: import('@/types/enum').LoginType | undefined;
  accountId?: string;
  tenantId?: string;
}
