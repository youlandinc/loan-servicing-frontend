export const StyledSelectMultipleStyle = {
  checkboxSx: {
    '& .MuiCheckbox-root': {
      m: 0,
    },
  },
  root: {
    width: '100%',
    '& .Mui-disabled': {
      color: 'text.disabled',
      cursor: 'not-allowed',
    },
    '& .MuiInputBase-formControl': {
      borderRadius: 2,
    },
    '& .MuiInputLabel-formControl.Mui-focused': {
      color: 'text.primary',
    },
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid #202939 !important',
      },
      '& .MuiOutlinedInput-input': {
        background: 'transparent',
      },
    },
  },
  helperText: {
    p: 0,
    m: 0,
    fontSize: 12,
    color: 'error.main',
  },
} as const;
