import { TOption } from '@/types';
import { format } from 'date-fns';

export * from './Handler';
export * from './TypeOf';

export const utils = {
  findLabel: (options: TOption[], val: number | string | undefined): string => {
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
    timeFormat = 'yyyy/MM/dd',
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
};
