import { FC, forwardRef, useRef } from 'react';

import {
  ArrowDropDown,
  ArrowDropUp,
  Close,
  DateRange,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { getMonth, getYear } from 'date-fns';
import { range } from 'lodash';
import ReactDatePicker, {
  CalendarContainer,
  CalendarContainerProps,
  ReactDatePickerCustomHeaderProps,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useBreakpoints, useSwitch } from '@/hooks';

import {
  StyledDateRangeProps,
  StyledDateRangeStyles,
  StyledTextFieldStyles,
} from './index';

export const StyledDateRange: FC<StyledDateRangeProps> = ({
  sx,
  label,
  dateRange = [null, null],
  ...rest
}) => {
  const breakpoint = useBreakpoints();

  const inputRef = useRef(null);
  const selected = useRef<any>(null);
  const { visible, close, toggle } = useSwitch(false);

  const onOpen = () => {
    toggle();
    setTimeout(() => {
      selected.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }, 100);
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const years = range(1900, getYear(new Date()) + 100, 1);

  const CustomHeader = ({
    date,
    changeYear,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: ReactDatePickerCustomHeaderProps) => (
    <>
      <Box
        sx={{
          py: 2,
          px: 3,
          mt: visible ? 1 : 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography onClick={onOpen} variant={'subtitle1'}>
          {months[getMonth(date)]}
          {`  ${getYear(date)}`}
          <IconButton>
            {visible ? <ArrowDropDown /> : <ArrowDropUp />}
          </IconButton>
        </Typography>
        {!visible && (
          <Box>
            <IconButton
              disabled={prevMonthButtonDisabled}
              onClick={decreaseMonth}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              disabled={nextMonthButtonDisabled}
              onClick={increaseMonth}
              sx={{
                ml: 3,
              }}
            >
              <KeyboardArrowRight />
            </IconButton>
          </Box>
        )}
      </Box>
      {visible && (
        <Box className="years-box" component={'ul'}>
          {years.map((item) => {
            return (
              <Box
                className={getYear(date) === item ? 'isSelected' : ''}
                component={'li'}
                key={item}
                onClick={() => {
                  changeYear(item);
                  close();
                }}
                ref={getYear(date) === item ? selected : null}
              >
                {item}
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );

  const CustomInput = forwardRef((props: any, ref) => {
    return (
      <>
        <TextField
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                {dateRange[1] && (
                  <IconButton edge="end" size="small" tabIndex={-1}>
                    <Close />
                  </IconButton>
                )}
                <IconButton edge="end" onClick={props.onClick} tabIndex={-1}>
                  <DateRange sx={{ color: 'text.grey_blue' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={StyledTextFieldStyles}
          variant="outlined"
          {...props}
          ref={ref}
        />
      </>
    );
  });

  function Container({ className, children }: CalendarContainerProps) {
    return (
      <CalendarContainer className={className}>
        <div style={{ position: 'relative' }}>
          {visible
            ? children &&
              (children as unknown as any)[3][0]?.props.children[0].props
                .children[0]
            : children}
        </div>
      </CalendarContainer>
    );
  }

  return (
    <Box
      sx={{
        ...StyledDateRangeStyles,
        ...sx,
        '& .react-datepicker-popper': {
          zIndex: 10,
        },
      }}
    >
      <ReactDatePicker
        calendarContainer={Container}
        customInput={<CustomInput inputRef={inputRef} label={label} />}
        endDate={dateRange[1]}
        isClearable
        popperPlacement={'bottom'}
        renderCustomHeader={CustomHeader}
        selectsRange
        startDate={dateRange[0]}
        withPortal={['xs', 'sm'].includes(breakpoint)}
        {...rest}
      >
        {rest.children}
      </ReactDatePicker>
    </Box>
  );
};
