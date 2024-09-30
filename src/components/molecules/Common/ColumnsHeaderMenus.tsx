import React, { FC, useState } from 'react';

import BorderLeftIcon from '@/svg/portfolio/freeze_pane.svg';
import BorderClearIcon from '@/svg/portfolio/unfreeze_pane.svg';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import { StyledActionsMenu, StyledActionsMenuProps } from '@/components/atoms';

interface ColumnsHeaderMenusProps extends StyledActionsMenuProps {
  // columns: MRT_ColumnDef<any>[];
  // selectedHeaderId: string;
  // selectedHeaderIndex: number;
  handleFreeze?: () => void;
  handleUnfreeze?: () => void;
  handleSort?: () => void;
  type?: 'group' | 'list';
}

export const ColumnsHeaderMenus: FC<ColumnsHeaderMenusProps> = ({
  open,
  anchorEl,
  onClose,
  // columns,
  // selectedHeaderId,
  // selectedHeaderIndex,
  handleFreeze,
  handleUnfreeze,
  handleSort,
  type,
}) => {
  const [freeze, setFreeze] = useState(false);
  const DefaultTableHeaderMenu = !freeze
    ? [
        {
          icon: BorderLeftIcon,
          label: 'Freeze pane',
          handleClick: () => {
            setFreeze(true);
            handleFreeze?.();
            onClose?.({}, 'backdropClick');
          },
          disabled: freeze,
        },
      ]
    : [
        {
          icon: BorderClearIcon,
          label: 'Unfreeze pane',
          handleClick: () => {
            setFreeze(false);
            handleUnfreeze?.();
            onClose?.({}, 'backdropClick');
          },
        },
      ];

  const TableHeaderSortMenu = [
    {
      icon: ImportExportIcon,
      label: 'Sort',
      handleClick: () => {
        handleSort?.();
        onClose?.({}, 'backdropClick');
      },
      // disabled: headerSortDisabled,
    },
  ];

  const menus =
    type === 'group'
      ? TableHeaderSortMenu
      : DefaultTableHeaderMenu.concat(TableHeaderSortMenu);

  return (
    <StyledActionsMenu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      menus={menus}
      onClose={onClose}
      open={open}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    />
  );
};
