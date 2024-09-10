import { MutableRefObject, useCallback } from 'react';

export const useRenderPdf = (
  element: MutableRefObject<HTMLDivElement | null>,
) => {
  const renderFile = useCallback(
    (string: string) => {
      if (!element.current) {
        return;
      }
      if (!element.current?.shadowRoot) {
        element.current?.attachShadow({ mode: 'open' });
      }
      (element.current?.shadowRoot as ShadowRoot).innerHTML = `${string || ''}`;
    },
    [element],
  );

  return { renderFile };
};
