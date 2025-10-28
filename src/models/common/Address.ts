import { AddressData } from '@/types';
import { formatPropertyAddress } from '@/utils/FormatUtils';
import { destroy, Instance, SnapshotOut, types } from 'mobx-state-tree';

type AddressError = Partial<AddressData>;

export const Address = types
  .model({
    id: types.maybe(types.string),
    formatAddress: types.string,
    state: types.string,
    street: types.string,
    aptNumber: types.string,
    city: types.string,
    postcode: types.string,
    lng: types.maybe(types.number),
    lat: types.maybe(types.number),
    errors: types.frozen<AddressError>(),
    isValid: types.boolean,
  })
  .views((self) => ({
    get checkAddressValid() {
      return !!self.formatAddress && !!self.state && self.postcode.length === 5;
    },
    get checkFuzzyAddress() {
      return !!self.state && self.postcode.length === 5;
    },
    get checkRefinanceValid() {
      return (
        !!self.state &&
        !!self.formatAddress &&
        !!self.city &&
        !!self.postcode &&
        self.postcode.length === 5
      );
    },
    get isStateValid() {
      return !!self.state;
    },
    get computedFormatAddress() {
      return formatPropertyAddress(
        self?.formatAddress,
        self?.aptNumber,
        self?.city,
        self?.state,
        self?.postcode,
      );
    },
  }))
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: (typeof self)[T],
    ) {
      const errors = {}; // validate({ [key]: value });
      self.errors = { ...self.errors, ...(errors || {}) };
      if (self.errors[key as keyof typeof self.errors] && errors === void 0) {
        destroy(self.errors[key as keyof typeof self.errors]);
      }
      self.isValid = Object.keys(self.errors).length === 0;
      self[key] = value;
    },
    validateForm() {
      const errors = {}; // validate(self);
      self.isValid = !errors;
      self.errors = errors || {};
    },
    injectServerData(value: AddressData) {
      const { address, aptNumber, city, state, postcode, lng, lat } = value;
      self.formatAddress = address ?? '';
      self.aptNumber = aptNumber ?? '';
      self.city = city ?? '';
      self.state = state ?? '';
      self.postcode = postcode ?? '';
      self.lat = lat ?? void 0;
      self.lng = lng ?? void 0;
      self.isValid = Object.keys(self).some((item) => item);
    },
    getPostData(): AddressData {
      const {
        formatAddress: address,
        aptNumber,
        city,
        state,
        postcode,
        lat,
        lng,
      } = self;
      return {
        address,
        aptNumber,
        city,
        state,
        lat,
        lng,
        postcode,
      };
    },

    reset(): void {
      self.id = void 0;
      self.formatAddress = '';
      self.state = '';
      self.street = '';
      self.aptNumber = '';
      self.city = '';
      self.postcode = '';
      self.lng = void 0;
      self.lat = void 0;
      self.errors = {} as AddressError;
      self.isValid = false;
    },
  }));

export type IAddress = Instance<typeof Address>;
export type SAddress = SnapshotOut<typeof Address>;
