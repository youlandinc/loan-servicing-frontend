import axios from 'axios';
import { post } from './axios';
import { User } from '@/types/user';

export const _fetchUserInfoWithToken = (token: string) => {
  return axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/usercenter/api/user/fetchUserInfo`,
  });
};

export const _fetchUserLicensedProduct = () => {
  return post<{ functions: { name: string }[] }>(
    '/usercenter/api/tenant/queryTenantServicePackage',
    {},
  );
};

export const _fetchUserDetailByAccountId = (param: { accountId: string }) => {
  return post<User.UserDetail>('/usercenter/api/user/query/detail', param);
};
