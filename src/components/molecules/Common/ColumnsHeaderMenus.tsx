import React, { FC } from 'react';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

import { StyledActionsMenu, StyledActionsMenuProps } from '@/components/atoms';

export const ColumnsHeaderMenus: FC<StyledActionsMenuProps> = ({
  menus,
  open,
  anchorEl,
  onClose,
}) => {
  return (
    <StyledActionsMenu
      anchorEl={anchorEl}
      menus={
        menus || [
          {
            label: 'Change Order of Columns',
            icon: <VerticalSplitIcon />,
            handleClick: () => {
              return;
            },
          },
        ]
      }
      onClose={onClose}
      open={open}
    />
  );
};
