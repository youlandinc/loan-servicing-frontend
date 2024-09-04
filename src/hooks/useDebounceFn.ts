import { useTimeoutFunction } from '@/hooks/useTimeoutFunction';

// eslint-disable-next-line @typescript-eslint/ban-types
export const useDebounceFn = (fn: Function, ms = 0) => {
  return useTimeoutFunction(fn, ms);
};
