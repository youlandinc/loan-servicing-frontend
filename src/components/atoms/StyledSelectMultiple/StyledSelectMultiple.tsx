import { FC, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import { useBreakpoints, useSessionStorageState } from '@/hooks';

import { StyledSelectMultipleProps, StyledSelectMultipleStyle } from './index';

import { POSFindLabel, POSTypeOf } from '@/utils';
import { StyledCheckbox } from '@/components/atoms';

export const StyledSelectMultiple: FC<StyledSelectMultipleProps> = ({
  options = [],
  validate,
  value = [],
  onValueChange,
  label,
  disabled,
  sxList,
  sx,
  sxHelperText,
  ...rest
}) => {
  const [selectValue, setSelectValue] = useState(['']);
  const { saasState } = useSessionStorageState('tenantConfig');
  const breakpoints = useBreakpoints();

  const handledChange = (e: any) => {
    const {
      target: { value },
    } = e;
    const result = POSTypeOf(value) === 'String' ? value.split(',') : value;

    setSelectValue(result);

    onValueChange(result);
  };

  useEffect(
    () => {
      const result = POSTypeOf(value) === 'String' ? value.split(',') : value;
      setSelectValue(result);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <FormControl
        error={!!(validate?.length && validate[0])}
        sx={{
          ...StyledSelectMultipleStyle.root,
          ...sx,
        }}
        variant={'outlined'}
      >
        <InputLabel sx={{ width: 'auto' }}>{label}</InputLabel>
        <Select
          disabled={disabled}
          inputProps={{
            MenuProps: {
              MenuListProps: {
                sx: {
                  width: 'auto',
                  p: 0,
                  mt: 0,
                  '& .MuiMenuItem-root:hover': {
                    bgcolor: 'rgba(144, 149, 163, 0.1) !important',
                  },
                  '& .MuiMenuItem-root.Mui-selected': {
                    bgcolor: `hsla(${
                      saasState?.posSettings?.h ?? 222
                    },100%,95%,1) !important`,
                  },
                  '& .Mui-selected:hover': {
                    bgcolor: `hsla(${
                      saasState?.posSettings?.h ?? 222
                    },100%,92%,1) !important`,
                  },
                  '& .MuiMenuItem-root': {
                    fontSize: 14,
                    color: 'text.primary',
                    bgcolor: 'transparent !important',
                  },
                  '& .MuiButtonBase-root': {
                    '& .MuiFormControlLabel-root': {
                      width: 'auto',
                    },
                  },
                  ...sxList,
                },
              },
              PaperProps: {
                style: { marginTop: 12, maxHeight: 500 },
              },
            },
          }}
          label={label}
          MenuProps={{
            disableScrollLock: true,
          }}
          multiple
          onChange={handledChange}
          renderValue={(selected: any) =>
            selected
              .reduce((acc: unknown[], item: number | string) => {
                POSFindLabel(options, item) &&
                  acc.push(POSFindLabel(options, item));
                return acc;
              }, [])
              .join(', ')
          }
          // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
          value={selectValue}
          {...rest}
        >
          {options.map((opt: Option) => (
            <MenuItem disableRipple key={opt.key} value={opt.value}>
              <StyledCheckbox
                checked={selectValue.indexOf(opt.value as any) > -1}
                sx={StyledSelectMultipleStyle.checkboxSx}
              />
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {validate?.length && validate[0] && (
          <FormHelperText
            sx={{
              ...StyledSelectMultipleStyle.helperText,
              ...sxHelperText,
            }}
          >
            {validate?.length
              ? validate.map((item, index) => (
                  <Box
                    component={'span'}
                    key={item + '_' + index}
                    sx={{ display: 'block', m: 0 }}
                  >
                    {item}
                  </Box>
                ))
              : validate
                ? validate[0]
                : undefined}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};
