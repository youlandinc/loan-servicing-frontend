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

const CustomInput = forwardRef((props: any, ref) => {
  const { onClear, ...rest } = props;
  return (
    <StyledButton
      sx={{
        ...BtnDefaultStyle,
        pl: 1.25,
        color: btnSelected.timeRange ? 'primary' : 'text.primary',
        '&:hover': {
          bgcolor: btnSelected.timeRange
            ? 'transparent'
            : 'rgba(54, 94, 198, 0.04)',
        },
      }}
      variant={'text'}
      {...rest}
      onClick={() => {
        setBtnSelected({ ...btnSelected, timeRange: true });
      }}
      ref={ref}
    >
      <Stack alignItems={'center'} direction={'row'} spacing={0.5}>
        <Typography variant={'subtitle1'}>
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

export const StyledSearchDateRange: FC = () => {
  const [closingDate, setClosingDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  return (
    <StyledDateRange
      customInput={
        <CustomInput
          onClear={() => {
            setClosingDate([null, null]);
          }}
        />
      }
      dateRange={closingDate}
      label={'Est. closing date'}
      onCalendarClose={() => {
        setBtnSelected({ ...btnSelected, timeRange: false });
      }}
      onChange={(date: [Date | null, Date | null]) => {
        setClosingDate(date);
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
