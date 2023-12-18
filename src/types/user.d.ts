import { AddressData, TaskFiles } from './common';
import {
  BizType,
  FreeTrialState,
  LoginType,
  ServiceType,
  UserType,
} from './enum';

declare namespace User {
  interface BaseUserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }

  interface BorrowerInfo extends BaseUserInfo {
    address: AddressData;
  }

  interface TeamMemberInfo extends BaseUserInfo {
    title?: string;
    profile: string;
    NMSLNumber?: string;
  }

  interface IFetchUserParam {
    tenantId: string;
    accountId: number;
    email: string;
  }

  interface UserDetail {
    id: string;
    tenantId: string;
    appId: string;
    account: string;
    userId: string;
    accountType: string;
    loginType: string;
    source: string;
    parentAccountId: string;
    userInfo: UserInfo;
    inviteCode: string;
    lastLoginTime: string;
    paymentMethod: IPaymentMethod | null;
    billingAddress: IBillingAddress | null;
    // organizationInfo: IOrganizationInfo;
    notificationRule: INotificationsRule | null;
    tenantConfig: IOrganizationInfo | null;

    enabled: number;
    roles?: IRoleDetail[];
    gmtCreate: string;
    gmtModified: string;
    creator: string;
    editor: string;
    userName: string;
    channel: string | null;
  }

  interface IRoleDetail {
    id: number;
    tenantId: string;
    name: string;
    rolePermissions: RolePermissionInfo[];
    description: string;
    extInfo: {
      additionalProp1: object;
      additionalProp2: object;
      additionalProp3: object;
    };
    accountList: UserDetail[];
  }

  interface UserSetting {
    lastSelectedProcessId: string | undefined;
  }

  interface BaseParam {
    appkey: string;
  }

  interface UserSignIn extends BaseParam {
    loginType: LoginType;
    emailParam?: {
      account: string;
      password: string;
    };
    googleParam?: {
      idToken: string;
    };
  }

  interface UserSignUp extends BaseParam {
    emailParam: {
      email: string;
      password: string;
      userType: UserType;
    };
  }

  interface UserSignInRequest extends UserRefreshTokenRequest {
    userProfile: Partial<UserProfile>;
  }

  interface UserProfile {
    account: string;
    accountId: string;
    address: AddressData | null;
    avatar: string | null;
    email: string | undefined;
    loginType: LoginType;
    name: string;
    phone: string | null;
    tenantId: string;
    userId: string | undefined;
    userType: UserType;
  }

  interface UserRefreshTokenParams {
    refreshToken: string;
    appkey: string;
  }

  interface UserRefreshTokenRequest {
    accessToken: string;
    expiredIn?: number;
    refreshToken: string;
  }

  interface UserResetPasswordParams {
    newPass: string;
    appkey: string;
    verifyCode: string;
    email: string;
  }

  interface UserChangePasswordParams {
    newPass: string;
    oldPass: string;
  }

  interface UserChangeEmailParams {
    oldEmail: string;
    newEmail: string;
  }

  interface UserSendCodeParams {
    email: string;
    appkey: string;
    bizType: BizType;
  }

  interface UserVerifyCodeParams {
    code: string;
    appkey: string;
    email: string;
    bizType: string;
  }

  interface UserResetPassParams {
    newPass: string;
    appkey: string;
    verifyCode: string;
    email: string;
  }

  interface TenantConfigRequest {
    id: number;
    tenantId: string;
    logoUrl: string;
    organizationName: string;
    organizationInfo: OrganizationInfo;
    phone: string;
    signOffEmail: string;
    replyEmail: string;
    saasUrl: string;
    extInfo: ExtInfo$3Type;
  }

  interface OrganizationInfo {
    id: number;
    tenantId: string;
    logoUrl?: string;
    faviconUrl?: string;
    organizationInfo?: {
      name: string;
    };
    organizationName: string;
    email: string;
    phone: string;
    signOffEmail?: string;
    replyEmail?: string;
    saasUrl?: string;
    extInfo?: {
      posSettings?: IPosSettings;
    };
    posSettings?: IPosSettings;
    address: AddressData;
    whiteLabelUrl: string;
    losSettings: {
      customFee: FeeSettings | null;
    };
    useTimes: number;
    freeTrialState: FreeTrialState;

    serviceTypeEnum: ServiceType;
    serviceSelected: boolean;
    website: null | string;
  }

  interface FeeSettings {
    lenderOriginationFee: number;
    floodCertification: number;
    underwritingFee: number;
    documentPreparationFee: number;
    creditReport: number;
    projectOversightFee: number;
    backgroundCheck: number;
    miscFee: number;
  }

  interface PosSettings {
    phone: string;
    email: string;
    members: Partial<UserInfo>[];
    workingDays: string;
    workingHours: string;
    h?: number;
    l?: number;
    s?: number;
    domains?: DomainDetails[];
    customFee?: POSCustomFee;
    isWarning?: boolean;
  }

  type UserUploadRequest = TaskFiles;
}
