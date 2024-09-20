import { FC, useState } from 'react';
import { Menu, MenuItem, Stack } from '@mui/material';

interface GridDropDownButtonProps {
  options?: Option[];
  status?: string;
}

export const GridDropDownButton: FC<GridDropDownButtonProps> = ({
  status = '',
  options = [
    { label: 'Option 1', key: 'option1', value: 1 },
    { label: 'Option 2', key: 'option2', value: 2 },
  ],
}) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const open = Boolean(target);

  const onClickToClose = () => {
    setTarget(null);
  };

  return (
    <>
      <Stack
        color={'#2B52B6'}
        fontSize={12}
        onClick={(e) => setTarget(e.currentTarget)}
        sx={{
          textDecoration: 'underline',
          textDecorationColor: '#2B52B6',
          cursor: 'pointer',
        }}
      >
        Add
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
              //bgcolor={bgPalette[item.key]}
              borderRadius={1}
              //color={colorPalette ? colorPalette[status] : '#ffffff'}
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
