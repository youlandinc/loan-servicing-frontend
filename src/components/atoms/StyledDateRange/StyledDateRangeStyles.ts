import { POSFont } from '@/styles';

export const StyledDateRangeStyles = {
  '& .react-datepicker-wrapper': { width: '100%' },
  '& .react-datepicker__portal': {
    bgcolor: 'rgba(0, 0, 0, 0.5)',
  },
  '& .react-datepicker__close-icon': {
    right: 42,
    '&::after': {
      color: 'text.primary',
      bgcolor: 'transparent',
      content: '""',
    },
  },
  '& .react-datepicker-popper': {
    zIndex: 2,
  },
  '& .MuiInputBase-input': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .react-datepicker': {
    minWidth: 320,
    border: 'none',
    bgcolor: 'background.white',
    boxShadow:
      '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
    borderRadius: 1,
    '& .react-datepicker__day-name': {
      width: 36,
      fontSize: 0,
      color: 'text.secondary',
      '&:first-letter': {
        fontSize: 14,
      },
    },
    '& .react-datepicker__day--today': {
      borderRadius: '50% !important',
      bgcolor: 'transparent',
      border: '1px solid',
      borderColor: 'text.secondary',
    },
    '& .react-datepicker__day': {
      width: 36,
      height: 36,
      lineHeight: '34px',
      fontSize: 14,
      borderRadius: '50%',
      color: 'text.primary',
      '&:hover': {
        borderRadius: '50% !important',
        bgcolor: 'info.darker',
        color: 'text.primary',
      },
    },
    '& .react-datepicker__triangle::after, .react-datepicker__triangle::before':
      {
        display: 'none',
      },
    '& .react-datepicker__day--in-range': {
      borderRadius: '50%',
      bgcolor: 'primary.main',
      color: 'text.white',
      '&:hover': {
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
      },
    },
    '& .react-datepicker__day--in-selecting-range': {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      borderRadius: '50% !important',
      '&:hover': {
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
      },
    },
    '& .react-datepicker__header': {
      bgcolor: 'background.white',
      border: 'none',
      '& .MuiIconButton-root': {
        // p: 0,
      },
    },
    '& .react-datepicker__month-container': { width: '100%' },
    '& .years-box': {
      maxHeight: 300,
      width: 300,
      overflow: 'auto',
      display: 'flex',
      flexWrap: 'wrap',
      px: 0,
      pb: 3,
      '& li': {
        py: 0.5,
        px: 2,
        my: 1,
        mx: 0.5,
        cursor: 'pointer',
        borderRadius: 8,
        ...POSFont(14, 400, 1.5, 'text.primary'),
        '&:hover': {
          bgcolor: 'info.darker',
        },
        '&.isSelected': {
          bgcolor: 'primary.main',
          color: 'text.white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        },
      },
    },
    '& .react-datepicker__month': { px: 3, m: 0, pb: 3 },
    '& .react-datepicker__month-text': {
      width: 75,
      py: 1,
      borderRadius: '23px',
      fontSize: 16,
      fontWeight: 600,
      fontFamily: 'Inter',
      m: '4px',
    },
    '& .react-datepicker__month-text--keyboard-selected': {
      bgcolor: 'primary.dark',
      color: '#FFF',
    },
  },
} as const;

export const StyledTextFieldStyles = {
  width: '100%',
  borderRadius: 2,
  padding: 0,
  '& label.Mui-focused': {
    color: 'text.focus',
    '& span': {
      color: 'text.focus',
    },
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    boxShadow: 'none',
    input: {
      '&::placeholder': {
        color: 'text.placeholder',
      },
      color: 'text.primary',
      lineHeight: 1,
    },
    '& fieldset': {
      borderColor: 'background.border_default',
    },
    '&:hover fieldset': {
      borderColor: 'background.border_hover',
      color: 'background.border_hover',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid',
      borderColor: 'background.border_focus',
    },
  },
  '& .Mui-disabled.MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'background.border_disabled',
    },
  },
  '& .Mui-disabled': {
    cursor: 'not-allowed',
    '&:hover fieldset': {
      borderColor: 'background.border_default',
    },
  },
  '& .MuiFormHelperText-root': {
    margin: 0,
    fontSize: 12,
  },
} as const;
