import React, { FC, useState } from 'react';
import {
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { useSwitch } from '@/hooks';
import { ColumnsOrderDialog, StyledActionsMenu } from '@/components/atoms';
import { transferOrderColumns } from '@/components/molecules';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

export const GridMoreIconButton: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const { visible, open, close } = useSwitch();

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        sx={{ p: 0 }}
      >
        <MoreHorizIcon
          sx={{ fontSize: 24, cursor: 'pointer', color: '#202939' }}
        />
      </IconButton>
      <StyledActionsMenu
        anchorEl={anchorEl}
        menus={[
          {
            label: 'Change Order of Columns',
            icon: <VerticalSplitIcon />,
            handleClick: open,
          },
        ]}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
      />
      <ColumnsOrderDialog
        columns={transferOrderColumns}
        onClose={close}
        open={visible}
      />
    </>
  );
};
