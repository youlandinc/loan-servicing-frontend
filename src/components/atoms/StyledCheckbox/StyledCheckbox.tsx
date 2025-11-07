import { FC } from 'react';

import { Checkbox, FormControlLabel, Icon } from '@mui/material';

import { useSessionStorageState } from '@/hooks';
import { POSFont } from '@/styles';
import { lightTheme as theme } from '@/theme';

import CHECKBOX_CHECKED from './checked.svg';
import { StyledCheckboxProps } from './index';
import CHECKBOX_INDETERMINATE from './intermediate.svg';
import CHECKBOX_STATIC from './static.svg';

export const StyledCheckbox: FC<StyledCheckboxProps> = ({
  checked = false,
  label,
  onChange,
  icon,
  checkedIcon,
  indeterminateIcon,
  indeterminate,
  sxCheckbox,
  sx,
  ...rest
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            checkedIcon={<Icon component={checkedIcon || CHECKBOX_CHECKED} />}
            disableRipple
            icon={<Icon component={icon || CHECKBOX_STATIC} />}
            indeterminate={indeterminate}
            indeterminateIcon={
              <Icon component={indeterminateIcon || CHECKBOX_INDETERMINATE} />
            }
            onChange={onChange}
            sx={{ ...sxCheckbox }}
            {...rest}
          />
        }
        label={label}
        sx={{
          alignItems: 'flex-start',
          // width: '100%',
          '& .MuiFormControlLabel-label': {
            width: '100%',
            ml: 1.5,
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            ...POSFont(14, 400, 1.5, 'text.primary'),
          },
          '& .Mui-checked': {
            '& svg > path': {
              fill: `hsla(${
                saasState?.posSettings?.h ?? 222
              },42%,55%,1) !important`,
            },
          },
          '& .MuiCheckbox-root': {
            mt: '-11px',
            mr: '-11px',
            '& svg > path': {
              fill: '#929292',
            },
          },
          '& .Mui-disabled': {
            '& svg > path': {
              fill: `${theme.palette.action.disabled} !important`,
            },
          },
          ...sx,
        }}
      />
    </>
  );
};
