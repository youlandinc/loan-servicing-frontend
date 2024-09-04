import { SetStateAction, useCallback, useEffect, useState } from 'react';

export const useSessionStorageState = (key: string) => {
  const [saasState, setSaasState] = useState<any>(undefined);

  const removeItem = useCallback(() => {
    sessionStorage.removeItem(key);
  }, [key]);

  const clear = useCallback(() => {
    sessionStorage.clear();
  }, []);

  const getItem = useCallback(() => {
    if (!sessionStorage) {
      return;
    }
    if (window.sessionStorage.getItem(key)) {
      setSaasState(JSON.parse(window.sessionStorage.getItem(key) as string));
    }

    if (typeof window !== 'undefined') {
      setSaasState(JSON.parse(window.sessionStorage.getItem(key) as string));
    }
  }, [key]);

  const setItem = useCallback(
    (data: SetStateAction<any>) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(data));
        setSaasState(data);
      }
    },
    [key],
  );

  useEffect(() => {
    getItem();
  }, [getItem]);

  return {
    saasState,
    removeItem,
    clear,
    setItem,
  };
};
