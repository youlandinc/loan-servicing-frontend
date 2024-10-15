import { ElementType, FC } from 'react';
import { Icon, Menu, MenuItem, PopoverProps } from '@mui/material';

interface GridActionsProps {
  target: PopoverProps['anchorEl'];
  open: boolean;
  close: () => void;
  options: Array<
    Option & { action: () => Promise<void> | void; icon: ElementType }
  >;
}

export const GridActions: FC<GridActionsProps> = ({
  target,
  close,
  open,
  options,
}) => {
  return (
    <Menu
      anchorEl={target}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
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
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
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
