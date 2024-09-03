import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const ellipsisStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const POSFont = <
  S extends CSSProperties['fontSize'] | Omit<SxProps, 'fontSize'>,
  W extends CSSProperties['fontWeight'] | Omit<SxProps, 'fontWeight'>,
  L extends CSSProperties['lineHeight'] | Omit<SxProps, 'lightHeight'>,
  C extends CSSProperties['color'] | Omit<SxProps, 'color'>,
>(
  fontSize?: S,
  fontWeight?: W,
  lineHeight?: L,
  color?: C,
): {
  color: C | undefined;
  fontSize: S | undefined;
  lineHeight: L | undefined;
  fontWeight: W | undefined;
} => {
  return {
    fontSize,
    fontWeight,
    color,
    lineHeight,
  };
};
