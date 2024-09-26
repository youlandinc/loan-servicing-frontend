import { useMst } from '@/models/Root';
import { MRT_ColumnDef } from 'material-react-table';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Icon } from '@mui/material';

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

export const ColumnsHeaderMenus: FC<ColumnsHeaderMenusProps> = observer(
  ({
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
    const {
      portfolio: { allLoansGridModel },
    } = useMst();
    const [freeze, setFreeze] = useState(false);
    const DefaultTableHeaderMenu = [
      {
        icon: <Icon component={BorderLeftIcon} sx={{ fontSize: 24 }} />,
        label: 'Freeze pane',
        handleClick: () => {
          setFreeze(true);
          handleFreeze?.();
          onClose?.({}, 'backdropClick');
        },
        disabled: freeze,
      },
      {
        icon: <Icon component={BorderClearIcon} sx={{ fontSize: 24 }} />,
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
        icon: <ImportExportIcon sx={{ fontSize: 24 }} />,
        label: 'Sort',
        handleClick: () => {
          handleSort?.();
          onClose?.({}, 'backdropClick');
          /*   setAnchorElHeader(null);
                updatePipelineSearchParam({
                    ...pipelineSearchParam,
                    sort: [
                        {
                            property: headerColumn?.id || '',
                            direction: SortDirection.DESC,
                            ignoreCase: null,
                            label: headerColumn?.columnDef.header,
                        },
                        ...(PipelineSortOpts[0].value as any),
                    ] as any,
                });*/
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
  },
);
