import { FC } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { StyledDialogProps, StyledDialogStyles } from './index';

export const StyledDialog: FC<StyledDialogProps> = ({
  header,
  content,
  footer,
  sx,
  open,
  ...rest
}) => {
  const handledClass = (name: string) => {
    switch (name) {
      case 'dialog_header':
        return `dialog_header ${content || footer ? 'POS_pb_0' : ' POS_pb_3'}`;
      case 'dialog_content':
        return `dialog_content ${header ? 'POS_pt_0' : ' POS_pt_3'} ${
          footer ? 'POS_pb_0' : ' POS_pb_3'
        }`;
      case 'dialog_footer':
        return `dialog_footer ${content || header ? 'POS_pt_0' : ' POS_pt_3'}`;
    }
  };

  return (
    <Dialog
      fullWidth
      open={open}
      sx={{
        ...StyledDialogStyles,
        ...sx,
      }}
      {...rest}
    >
      {header && (
        <DialogTitle
          className={handledClass('dialog_header')}
          component={'div'}
        >
          {header}
        </DialogTitle>
      )}
      {content && (
        <DialogContent className={handledClass('dialog_content')}>
          {content}
        </DialogContent>
      )}
      {footer && (
        <DialogActions className={handledClass('dialog_footer')}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};
