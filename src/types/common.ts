import { PortfolioGridTypeEnum } from '@/types/enum';

export interface TaskFiles {
  originalFileName: string;
  fileName: string;
  url: string;
  uploadTime: string;
}

export interface AddressData {
  address: string;
  aptNumber: string;
  city: string;
  state: string;
  postcode: string;
}

export enum HttpErrorType {
  tokenExpired = '40001',
}

export enum HttpVariant {
  error = 'error',
  success = 'success',
  warning = 'warning',
  info = 'info',
}

export interface HttpError {
  message: string;
  header: string;
  variant: HttpVariant;
}

export interface ListPaginationReturn<T = any> {
  content: T[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export enum RequestBizType {
  for_servicing = 'for_servicing',
  for_loan = 'for_loan',
}

export interface SetColumnWidthParam {
  pageColumn: PortfolioGridTypeEnum;
  columnWidths: {
    field: string;
    columnWidth: number;
  }[];
}
