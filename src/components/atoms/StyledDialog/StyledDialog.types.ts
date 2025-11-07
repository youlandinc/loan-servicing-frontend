import { ReactNode } from 'react';

import { DialogProps } from '@mui/material';

export interface StyledDialogProps
  extends Omit<DialogProps, 'maxWidth' | 'content' | 'header' | 'footer'> {
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
}
