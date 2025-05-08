import { IconButton } from '@mui/material';
import React, { FC, ReactNode, useState } from 'react';

import {
  ActionMenuProps,
  ColumnsOrderDialog,
  StyledActionsMenu,
} from '@/components/atoms';

import { useSwitch } from '@/hooks';
import { IOrderColumnsItem } from '@/models/gridModel';
import { PortfolioGridTypeEnum } from '@/types/enum';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

interface GridMoreIconButtonProps {
  columns: IOrderColumnsItem[];
  handleSave?: (param: IOrderColumnsItem[]) => void;
  gridType: PortfolioGridTypeEnum;
  menus?: ActionMenuProps[];
}

export const GridMoreIconButton: FC<GridMoreIconButtonProps> = ({
  columns,
  handleSave,
  gridType,
  menus,
}) => {
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
        menus={(
          [
            {
              label: 'Edit columns',
              icon: VerticalSplitIcon,
              handleClick: open,
            },
          ] as ActionMenuProps[]
        )
          .concat(menus ?? [])
          .map((item) => ({
            ...item,
            handleClick: () => {
              item?.handleClick?.();
              setAnchorEl(null);
            },
          }))}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
      />
      <ColumnsOrderDialog
        columns={columns}
        gridType={gridType}
        handleSave={(columns) => {
          handleSave?.(columns);
          close();
          setAnchorEl(null);
        }}
        onClose={() => {
          close();
          setAnchorEl(null);
        }}
        open={visible}
      />
    </>
  );
};
