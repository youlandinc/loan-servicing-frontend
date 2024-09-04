import { FC, forwardRef, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { StyledButton, StyledDateRange } from '@/components/atoms';

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

interface StyledSearchDateRangeProps {
  onChange?: (date: [Date | null, Date | null]) => void;
  hanelClear?: () => void;
}

export const StyledSearchDateRange: FC<StyledSearchDateRangeProps> = ({
  onChange,
  hanelClear,
}) => {
  const [closingDate, setClosingDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const CustomInput = forwardRef((props: any, ref) => {
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
            {props.value && props.value !== ''
              ? props.value
              : 'Est. closing date'}
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

  return (
    <StyledDateRange
      customInput={
        <CustomInput
          onClear={() => {
            setClosingDate([null, null]);
            hanelClear?.();
          }}
        />
      }
      dateRange={closingDate}
      label={'Est. closing date'}
      onCalendarClose={() => {
        // setBtnSelected({ ...btnSelected, timeRange: false });
      }}
      onChange={(date: [Date | null, Date | null]) => {
        setClosingDate(date);
        onChange?.(date);
      }}
      placeholderText={'Est. closing date'}
      popperPlacement={'bottom-start'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        '& .react-datepicker-wrapper': {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        },
      }}
    />
  );
};
