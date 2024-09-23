import React, { FC, useState } from 'react';
import { CircularProgress, Icon, Menu, MenuItem, Stack } from '@mui/material';
import { utils } from '@/utils';

import LOGO_EXPEND_MORE from '@/components/molecules/GridYouland/logo-expend-more.svg';
import { _updateTableData } from '@/request';
import { GridYoulandItem } from '@/types/pipeline/youland';
import { HttpError } from '@/types/common';
import { AUTO_HIDE_DURATION } from '@/constant';
import { useSnackbar } from 'notistack';

interface GridDropDownProps {
  status: string;
  options: Option[];
  bgPalette: Record<string, string>;
  colorPalette?: Record<string, string>;
  cb?: () => Promise<void>;
  paramsKey: string;
  tableData?: Partial<GridYoulandItem>;
  loanId: number | string;
}

export const GridDropDown: FC<GridDropDownProps> = ({
  options,
  status,
  bgPalette,
  colorPalette,
  cb,
  paramsKey,
  tableData,
  loanId,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const open = Boolean(target);

  const onClickToClose = () => {
    setTarget(null);
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
            onClick={async () => {
              if (status === item.key) {
                return;
              }
              const postData = {
                loanId,
                [paramsKey]: item.key,
              };
              setActiveIndex(index);
              setLoading(true);
              try {
                await _updateTableData(postData);
                await cb?.();
              } catch (err) {
                const { header, message, variant } = err as HttpError;
                enqueueSnackbar(message, {
                  variant: variant || 'error',
                  autoHideDuration: AUTO_HIDE_DURATION,
                  isSimple: !header,
                  header,
                });
              } finally {
                onClickToClose();
                setLoading(false);
                setActiveIndex(-1);
              }
            }}
            selected={loading ? activeIndex === index : item.key === status}
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
            {loading && activeIndex === index ? (
              <CircularProgress
                size={20}
                sx={{ m: '0 auto', color: '#E3E3EE' }}
              />
            ) : (
              <Stack
                alignItems={'center'}
                bgcolor={bgPalette[item.key]}
                borderRadius={1}
                color={colorPalette ? colorPalette[item.key] : '#ffffff'}
                fontSize={12}
                height={20}
                justifyContent={'center'}
                width={100}
              >
                {item.label}
              </Stack>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
