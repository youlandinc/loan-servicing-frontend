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

export type TOption = {
  key: string;
  value: string | number;
  label: string;
};
