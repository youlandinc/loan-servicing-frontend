export enum HttpVariantType {
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
}

export interface HttpError {
  message: string;
  header: string;
  variant: HttpVariantType;
}

export interface AddressData {
  id?: string;
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  postcode: string;
  lng?: number;
  lat?: number;
}
