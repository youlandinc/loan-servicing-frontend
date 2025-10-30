import { ElementType, FC } from 'react';

import { Icon, Menu, MenuItem, PopoverProps } from '@mui/material';

interface GridActionsProps {
  target: PopoverProps['anchorEl'];
  open: boolean;
  close: () => void;
  options: Array<
    Option & { action: () => Promise<void> | void; icon: ElementType }
  >;
  anchorOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'center' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

export const GridActions: FC<GridActionsProps> = ({
  target,
  close,
  open,
  options,
  anchorOrigin = {
    vertical: 'center',
    horizontal: 'right',
  },
  transformOrigin = {
    vertical: 'center',
    horizontal: 'left',
  },
}) => {
  return (
    <Menu
      anchorEl={target}
      anchorOrigin={anchorOrigin}
      id={'basic-menu1'}
      MenuListProps={{
        'aria-labelledby': 'basic-div1',
        disablePadding: true,
        sx: {
          borderRadius: 2,
        },
      }}
      onClose={(e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        close();
      }}
      open={open}
      slotProps={{
        paper: {
          sx: {
            mt: 0.25,
            background: 'background.white',
            p: 0,
            borderRadius: 2,
            boxShadow:
              '0px 0px 2px 0px rgba(17, 52, 227, 0.10), 0px 10px 10px 0px rgba(17, 52, 227, 0.10)',
          },
        },
      }}
      transformOrigin={transformOrigin}
      transitionDuration={0}
    >
      {options.map((item, index) => (
        <MenuItem
          key={`${item.key}-${index}`}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            item.action();
          }}
          sx={{
            px: 3,
            py: 1.5,
            width: 180,
            bgcolor: 'transparent !important',
            '&.Mui-selected': {
              bgcolor: '#EFF2FB !important',
              '&:hover': {
                bgcolor: '#E7EBF8 !important',
              },
            },
            '&:hover': {
              bgcolor: '#F5F6FA !important',
            },
            gap: 1.25,
          }}
        >
          <Icon component={item.icon} sx={{ width: 24, height: 24 }} />
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};
