import React, { FC, useState } from 'react';
import {
  Avatar,
  CircularProgress,
  MenuItem,
  PopoverOrigin,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { StyledButton } from '@/components/atoms';
import { useSwitch } from '@/hooks';

type StyledBtnLoanOfficerProps = {
  autoCompleteLoading?: boolean;
  label?: string;
  handleOpen?: () => void;
  loanOfficersList: any[];
  handleChange?: (param: any) => void;
  handleClear?: () => void;
  defaultLabel?: string | null;
  value?: string | null;
};

const DefaultMenuProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  } as PopoverOrigin,
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  } as PopoverOrigin,
  disableScrollLock: true,
  disableAutoFocusItem: true,
  autoFocus: false,
};

const BtnChildrenDefaultStyle = {
  opacity: 0,
  position: 'absolute',
  left: 0,
  right: 0,
  // top: 0,
  // bottom: 0,
  zIndex: 1,
};

export const StyledBtnLoanOfficer: FC<StyledBtnLoanOfficerProps> = ({
  autoCompleteLoading,
  handleOpen,
  loanOfficersList,
  handleChange,
  handleClear,
  defaultLabel,
  value,
}) => {
  const { open, close, visible } = useSwitch();

  const [userInfo, setUserInfo] = useState<any | null>(null);

  // const {
  //   visible: autoCompleteLoading,
  //   open: openLoading,
  //   close: closeLoading,
  // } = useSwitch();

  return (
    <StyledButton
      sx={{
        position: 'relative',
        fontSize: 14,
        fontWeight: 400,
        lineHeight: '20px',
        borderRadius: 2,
        color: userInfo || value ? 'primary' : '#636A7C !important',
      }}
      variant={'text'}
    >
      <Stack alignItems={'center'} direction={'row'} spacing={0.5}>
        <Typography variant={'body2'}>
          {userInfo ? userInfo : defaultLabel || 'Loan officer'}
        </Typography>
        {autoCompleteLoading ? (
          <CircularProgress color="inherit" size={20} />
        ) : userInfo || value ? (
          <ClearIcon
            onClick={(e) => {
              e.stopPropagation();
              setUserInfo(null);
              handleClear?.();
            }}
            sx={{
              fontSize: 20,
              zIndex: 10,
              right: 0,
            }}
          />
        ) : (
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 20,
              right: 0,
            }}
          />
        )}
      </Stack>
      <Select
        MenuProps={DefaultMenuProps}
        onClose={() => {
          close();
        }}
        onOpen={async () => {
          await handleOpen?.();
          open();
        }}
        open={visible}
        sx={{
          ...BtnChildrenDefaultStyle,
          height: '100%',
          '& .MuiSelect-select': {
            height: '100% !important',
            p: 0,
          },
        }}
        //fixed mui warning
        value={value || ''}
      >
        {loanOfficersList.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              setUserInfo(item);
              handleChange?.(item);
            }}
            sx={{ fontSize: 14 }}
          >
            <Typography ml={1} variant={'subtitle1'}>
              {item}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </StyledButton>
  );
};
