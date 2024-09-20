import { FC, useState } from 'react';
import { Icon, Menu, MenuItem, Stack } from '@mui/material';
import { utils } from '@/utils';

import LOGO_EXPEND_MORE from '@/components/molecules/GridYouland/logo-expend-more.svg';

interface GridDropDownProps {
  status: string;
  options: Option[];
  bgPalette: Record<string, string>;
  colorPalette?: Record<string, string>;
  cb?: () => void;
}

export const GridDropDown: FC<GridDropDownProps> = ({
  options,
  status,
  bgPalette,
  colorPalette,
  cb,
}) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const open = Boolean(target);

  const onClickToClose = async () => {
    try {
    } catch (err) {}
    setTarget(null);
    cb?.();
  };

  return (
    <>
      <Stack
        alignItems={'center'}
        bgcolor={bgPalette[status]}
        borderRadius={1}
        color={colorPalette ? colorPalette[status] : '#ffffff'}
        flexDirection={'row'}
        fontSize={12}
        height={20}
        justifyContent={'center'}
        onClick={(e) => setTarget(e.currentTarget)}
        sx={{
          cursor: 'pointer',
        }}
        width={100}
      >
        {utils.findLabel(options, status) || '-'}
        <Icon
          component={LOGO_EXPEND_MORE}
          sx={{
            width: 12,
            height: 12,
            '& path': { fill: colorPalette ? colorPalette[status] : '#ffffff' },
          }}
        />
      </Stack>
      <Menu
        anchorEl={target}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        id={'basic-menu1'}
        MenuListProps={{
          'aria-labelledby': 'basic-div1',
          disablePadding: true,
          sx: {
            borderRadius: 2,
          },
        }}
        onClose={onClickToClose}
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
          vertical: 'top',
          horizontal: 'center',
        }}
        transitionDuration={0}
      >
        {options.map((item, index) => (
          <MenuItem
            key={`${item.key}-${index}`}
            onClick={onClickToClose}
            selected={item.key === status}
            sx={{
              px: 3,
              py: 1.5,
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
            }}
          >
            <Stack
              alignItems={'center'}
              bgcolor={bgPalette[item.key]}
              borderRadius={1}
              color={colorPalette ? colorPalette[status] : '#ffffff'}
              fontSize={12}
              height={20}
              justifyContent={'center'}
              width={100}
            >
              {item.label}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
