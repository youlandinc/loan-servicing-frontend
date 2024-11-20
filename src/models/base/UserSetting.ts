import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { enqueueSnackbar } from 'notistack';

import { User } from '@/types/user';
import { HttpError } from '@/types/common';

import { AUTO_HIDE_DURATION } from '@/constant';

import { LayoutProductTypeEnum, RoleTypeEnum } from '@/types/enum';
import {
  _fetchUserDetailByAccountId,
  _fetchUserLicensedProduct,
} from '@/request/user';

export const UserSetting = types
  .model({
    accountId: types.string,
    setting: types.frozen<User.UserDetail>(),
    loading: types.boolean,
    initialized: types.boolean,
    licensedProduct: types.array(
      types.model({
        name: types.string,
        productType: types.union(
          types.literal(LayoutProductTypeEnum.pos),
          types.literal(LayoutProductTypeEnum.los),
          types.literal(LayoutProductTypeEnum.doc),
          types.literal(LayoutProductTypeEnum.pricing),
          types.literal(LayoutProductTypeEnum.servicing),
          types.literal(LayoutProductTypeEnum.customer),
        ),
      }),
    ),
    domain: types.string,
    role: types.maybe(
      types.union(
        types.literal(RoleTypeEnum.admin),
        types.literal(RoleTypeEnum.loan_officer),
        types.literal(RoleTypeEnum.executive),
      ),
    ),
  })
  .actions((self) => ({
    setUserSetting(setting: User.UserDetail) {
      self.setting = setting;
    },
    setAccountId(accountId: string) {
      self.accountId = accountId;
    },
    initState() {
      self.initialized = false;
      self.loading = true;
    },
  }))
  .actions((self) => {
    const fetchUserSetting = flow(function* () {
      self.loading = true;
      const accountId =
        self.accountId ||
        (localStorage.getItem('USER_PROFILE_INFORMATION') as string);
      try {
        const { data } = yield _fetchUserDetailByAccountId({ accountId });
        self.setUserSetting(data);
        self.loading = false;
        self.domain = data?.tenantConfig?.domain;
        self.role = data?.tenantConfig?.role;
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      }
    });

    const fetchUserLicensedProduct = flow(function* () {
      self.loading = true;
      try {
        const { data } = yield _fetchUserLicensedProduct();
        self.licensedProduct = data?.functions;
        self.initialized = true;
        self.loading = false;
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
        self.initialized = false;
      }
    });
    return { fetchUserSetting, fetchUserLicensedProduct };
  });

export type IUserSetting = Instance<typeof UserSetting>;
export type SUserSetting = SnapshotOut<typeof UserSetting>;
