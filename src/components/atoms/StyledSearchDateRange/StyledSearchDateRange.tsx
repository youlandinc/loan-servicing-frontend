import { FC, forwardRef, useEffect, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Stack, Typography } from '@mui/material';

import {
  StyledButton,
  StyledDateRange,
  StyledDateRangeProps,
} from '@/components/atoms';

const BtnDefaultStyle = {
  position: 'relative',
  fontSize: 14,
  fontWeight: 400,
  // color: 'text.primary',
  lineHeight: '20px',
  borderRadius: 2,
  '& .MuiButton-endIcon': {
    ml: 0.5,
  },
};

interface StyledSearchDateRangeProps extends StyledDateRangeProps {
  handleClear?: () => void;
}

export const StyledSearchDateRange: FC<StyledSearchDateRangeProps> = ({
  date,
  onSelect,
  handleClear,
}) => {
  const [closingDate, setClosingDate] = useState<Date | null>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CustomInput = forwardRef((props: any, _ref) => {
    const { onClear, ...rest } = props;
    return (
      <StyledButton
        size={'small'}
        sx={{
          ...BtnDefaultStyle,
          pl: 1.25,
          color: rest.value !== '' ? 'primary' : '#636A7C !important',
          '&:hover': {
            bgcolor:
              rest.value !== '' ? 'transparent' : 'rgba(54, 94, 198, 0.04)',
          },
          p: '0 !important',
          height: 'auto !important',
        }}
        variant={'text'}
        {...rest}
      >
        <Stack alignItems={'center'} direction={'row'} spacing={0.5}>
          <Typography variant={'body2'}>
            {props.value && props.value !== '' ? props.value : 'Maturity date'}
          </Typography>
          {props.value && props.value !== '' ? (
            <ClearIcon
              onClick={(e) => {
                e.stopPropagation();
                onClear(e);
              }}
              sx={{ fontSize: 20 }}
            />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          )}
        </Stack>
      </StyledButton>
    );
  });

  useEffect(() => {
    setClosingDate(date);
  }, [date]);

  return (
    <StyledDateRange
      customInput={
        <CustomInput
          onClear={() => {
            setClosingDate(null);
            handleClear?.();
          }}
        />
      }
      label={'Maturity date'}
      onChange={() => {
        return;
      }}
      onSelect={(date, event) => {
        setClosingDate(date);
        onSelect?.(date, event);
      }}
      placeholderText={'Maturity date'}
      popperPlacement={'bottom-start'}
      selected={closingDate}
      selectsRange={false as any}
      showMonthYearPicker
      sx={{
        display: 'flex',
        alignItems: 'center',
        '& .react-datepicker-wrapper': {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        },
        '& .react-datepicker__close-icon': {
          zIndex: -100,
        },
        flexShrink: 0,
      }}
    />
  );
};
