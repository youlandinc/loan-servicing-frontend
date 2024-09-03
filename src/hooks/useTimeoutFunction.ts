import { useCallback, useEffect, useRef } from 'react';

export type UseTimeoutFnReturn = [
  () => boolean | null,
  () => void,
  (...args: any[]) => void,
];

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTimeoutFunction(fn: Function, ms = 0): UseTimeoutFnReturn {
  const ready = useRef<boolean | null>(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(fn);

  const isReady = useCallback(() => ready.current, []);

  const set = useCallback(
    (...args: any[]) => {
      ready.current = false;
      timeout.current && clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        ready.current = true;
        callback.current(...args);
      }, ms);
    },
    [ms],
  );

  const clear = useCallback(() => {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []);

  // update ref when function changes
  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // set on mount, clear on unmount
  useEffect(() => {
    // set();

    return clear;
  }, [clear, ms]);

  return [isReady, clear, set];
}
