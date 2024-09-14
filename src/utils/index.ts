import { format } from 'date-fns';
import { ReactNode } from 'react';

export * from './Handler';
export * from './TypeOf';

export const utils = {
  findLabel: (
    options: Option[],
    val: number | string | undefined,
  ): string | ReactNode => {
    return options.find((item) => item.value === val)?.label || '';
  },
  formatDollar: (amount: number | undefined | null, digit = 2): string => {
    if (!amount) {
      return '$0.00';
    }
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: digit,
    });
  },
  formatPercent: (
    percentageValue: number | undefined | string,
    radix = 3,
  ): string => {
    if (!percentageValue) {
      if (radix === 0) {
        return '0%';
      }
      return '0.000%';
    }
    let target = percentageValue;
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (this?.TypeOf(target) === 'String') {
      target = parseFloat(target as string);
    }
    return (
      ((Math.floor((target as number) * 1000000) / 1000000) * 100).toFixed(
        radix,
      ) + '%'
    );
  },
  formatDate: (
    date: string | Date | null,
    timeFormat = 'MM/dd/yyyy',
    options?: {
      locale?: Locale;
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: number;
      useAdditionalWeekYearTokens?: boolean;
      useAdditionalDayOfYearTokens?: boolean;
    },
  ): string => {
    if (!date) {
      return '-';
    }
    return format(new Date(date), timeFormat, options);
  },
  formatUSPhoneToText: (entry = '') => {
    if (utils.TypeOf(entry) === 'Null') {
      return '';
    }
    const cleaned: string = ('' + entry).replace(/\D/g, '');
    const match: RegExpMatchArray | null = cleaned.match(
      /^(\d{3})?(\d{3})(\d{4})$/,
    );
    if (match) {
      const areaCode: string = match[1] ? `(${match[1]}) ` : '';
      const formattedNumber = `${areaCode}${match[2]}-${match[3]}`;
      return formattedNumber;
    }
    return cleaned;
  },
  getParamsFromUrl(url: string): Record<string, string> {
    const params: Record<string, string> = {};
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },
  TypeOf(input: unknown): string {
    return Object.prototype.toString.call(input).slice(8, -1);
  },
  notUndefined(value: unknown): boolean {
    return Object.prototype.toString.call(value).slice(8, -1) !== 'Undefined';
  },
  formatPhoneNumber: (number: string | undefined | null) => {
    return typeof number === 'string' && number.length === 10
      ? `(${number.slice(0, 3)}) ${number.slice(3 - 6)}-${number.slice(6)}`
      : number;
  },
  formatSsn: (ssn: string | null | undefined) => {
    if (typeof ssn !== 'string') {
      return '';
    }
    const strArr = [...ssn];
    strArr.splice(3, 0, '-');
    strArr.splice(6, 0, '-');
    return strArr.join('');
  },
  notNull(value: unknown): boolean {
    return Object.prototype.toString.call(value).slice(8, -1) !== 'Null';
  },
  isYouland: (id: string) => {
    return id === '1000052022092800000102';
  },
  isTestUser: (id: string) => {
    return id === '1000052023032900000107';
  },
};
