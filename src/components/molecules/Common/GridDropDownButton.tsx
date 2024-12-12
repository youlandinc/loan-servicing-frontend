import React, { FC, useMemo, useState } from 'react';
import {
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constant';

import { HttpError } from '@/types/common';
import { _updateTableData } from '@/request';

import LOGO_EXPEND_MORE from '@/components/molecules/GridYouland/logo-expend-more.svg';

interface GridDropDownButtonProps {
  options?: Array<Option & { bgColor: string; color: string }>;
  status?: string | null | number;
  cb?: () => Promise<void>;
  paramsKey: string;
  loanId: number | string;
  originalData?: any;
}

export const GridDropDownButton: FC<GridDropDownButtonProps> = ({
  status = '',
  options = [],
  cb,
  paramsKey,
  loanId,
  originalData,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const [target, setTarget] = useState<HTMLElement | null>(null);
  const open = Boolean(target);

  const onClickToClose = () => {
    setTarget(null);
  };

  const condition = useMemo(() => {
    return status && status !== 'None';
  }, [status]);

  return (
    <>
      <Stack
        alignItems={'center'}
        borderRadius={1}
        flexDirection={'row'}
        flexShrink={0}
        height={24}
        justifyContent={'center'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setTarget(e.currentTarget);
        }}
        sx={{
          bgcolor: condition
            ? options.find((item) => item.label === status)?.bgColor ||
              'hsla(223, 45%, 72%, .2)'
            : 'transparent',
          color: condition
            ? options.find((item) => item.label === status)?.color ||
              'hsla(223, 45%, 72%, 1)'
            : '#2B52B6',
          textDecoration: condition ? 'none' : 'underline',
          textDecorationColor: '#2B52B6',
          cursor: 'pointer',
        }}
        width={120}
      >
        <Typography
          color={
            condition
              ? options.find((item) => item.label === status)?.color ||
                'hsla(223, 45%, 72%, 1)'
              : '#2B52B6'
          }
          ml={1}
          sx={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
          variant={'subtitle3'}
          width={76}
        >
          {condition
            ? options.find((item) => item.label === status)?.label || status
            : 'Add'}
        </Typography>
        {condition && (
          <Icon
            component={LOGO_EXPEND_MORE}
            sx={{
              width: 18,
              height: 18,
              ml: 0.25,
              '& path': {
                fill:
                  options.find((item) => item.label === status)?.bgColor ||
                  'hsla(223, 45%, 72%, 1)',
              },
            }}
          />
        )}
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
        onClose={(e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          onClickToClose();
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
          vertical: 'top',
          horizontal: 'center',
        }}
        transitionDuration={0}
      >
        {options.map((item, index) => (
          <MenuItem
            key={`${item.key}-${index}`}
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              if (status === item.key) {
                return;
              }
              const postData = {
                loanId,
              };
              if (paramsKey === 'prospectiveBuyer') {
                if (item.value === 'None' || item.key === null) {
                  Object.assign(postData, {
                    ...originalData,
                    prospectiveBuyer: item.value,
                    prospectiveBuyerId: item.key,
                    estSaleDate: null,
                  });
                } else {
                  Object.assign(postData, {
                    ...originalData,
                    prospectiveBuyer: item.value,
                    prospectiveBuyerId: item.key,
                  });
                }
              }
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
                size={24}
                sx={{ m: '0 auto', color: '#E3E3EE' }}
              />
            ) : (
              <Tooltip title={item.label}>
                <Typography
                  bgcolor={item.bgColor || 'hsla(223, 45%, 72%, .2)'}
                  borderRadius={1}
                  color={item.color || 'hsla(223, 45%, 72%, 1)'}
                  height={24}
                  justifyContent={'center'}
                  lineHeight={'24px'}
                  px={1}
                  sx={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                  textAlign={'center'}
                  variant={'subtitle3'}
                  width={120}
                >
                  {item.label}
                </Typography>
              </Tooltip>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
