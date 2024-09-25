import { allLoansModel, IOrderColumnsItem } from '@/models/gridModel';
import { PortfolioGridTypeEnum } from '@/types/enum';
import { IconButton } from '@mui/material';
import React, { FC, useState } from 'react';

import { ColumnsOrderDialog, StyledActionsMenu } from '@/components/atoms';
import { transferOrderColumns } from '@/components/molecules';

import { useSwitch } from '@/hooks';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';

interface GridMoreIconButtonProps {
  columns: IOrderColumnsItem[];
  handleSave?: (param: IOrderColumnsItem[]) => void;
  gridType: PortfolioGridTypeEnum;
}

export const GridMoreIconButton: FC<GridMoreIconButtonProps> = ({
  columns,
  handleSave,
  gridType,
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
        menus={[
          {
            label: 'Edit columns',
            icon: <VerticalSplitIcon />,
            handleClick: open,
          },
        ]}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
      />
      <ColumnsOrderDialog
        columns={columns}
        gridType={gridType}
        handleSave={(columns) => {
          handleSave?.(columns);
          close();
        }}
        onClose={close}
        open={visible}
      />
    </>
  );
};
