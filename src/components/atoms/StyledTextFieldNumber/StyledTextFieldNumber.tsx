import {
  ComponentPropsWithoutRef,
  FC,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { SxProps } from '@mui/material';
import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from 'react-number-format';

import { utils } from '@/utils';

import { StyledTextFieldInput } from '@/components/atoms';

interface StyledTextFieldNumberProps {
  allowNegative?: boolean;
  onValueChange?: (values: NumberFormatValues) => void;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  label?: string;
  value: number | string | undefined;
  sx?: SxProps;
  required?: boolean;
  placeholder?: string;
  decimalScale?: number;
  disabled?: boolean;
  validate?: undefined | string[];
  percentage?: boolean;
  error?: boolean | undefined;
  id?: string;
}

export const StyledTextFieldNumber: FC<StyledTextFieldNumberProps> = ({
  allowNegative = false,
  onValueChange,
  prefix,
  suffix,
  value,
  sx,
  decimalScale = 2,
  thousandSeparator = true,
  percentage = false,
  id,
  ...rest
}) => {
  const [text, setText] = useState(value ?? 0);

  useEffect(() => {
    if (typeof value === 'number' || typeof value === 'string') {
      if (thousandSeparator) {
        setText(
          percentage
            ? utils.formatPercent((value as number) / 100)
            : utils.formatDollar(value as number),
        );
      } else {
        setText(value);
      }
    } else {
      setText('');
    }
  }, [percentage, thousandSeparator, value]);

  const handledChange = (e: {
    target: { name: string; value: NumberFormatValues };
  }) => {
    onValueChange?.(e.target.value);
  };

  return (
    <>
      <StyledTextFieldInput
        {...rest}
        id={id}
        InputProps={{
          inputComponent: NumericFormatCustom as never,
          inputProps: {
            allowNegative,
            onValueChange,
            prefix,
            suffix,
            value: text,
            sx,
            decimalScale,
            thousandSeparator,
            id,
          },
        }}
        name="numberformat"
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        onChange={handledChange}
        sx={{
          width: '100%',
          borderRadius: 3,
          padding: 0,
          '& label.Mui-focused': {
            color: 'text.secondary',
            '& span': {
              color: 'text.secondary',
            },
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            boxShadow: 'none',
            input: {
              '&::placeholder': {
                color: 'text.secondary',
              },
              color: 'text.primary',
              lineHeight: 1,
            },
            '& fieldset': {
              border: '1px solid',
              borderColor: 'border.normal',
            },
            '&:hover fieldset': {
              borderColor: 'border.focus',
              color: 'border.focus',
            },
            '&.Mui-focused fieldset': {
              border: '1px solid',
              borderColor: 'border.focus',
            },
          },
          '& .Mui-disabled.MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'border.disabled',
            },
          },
          '& .Mui-disabled': {
            cursor: 'not-allowed',
            '&:hover fieldset': {
              borderColor: 'border.normal',
            },
          },
          '& .MuiFormHelperText-root': {
            margin: 0,
            fontSize: 12,
          },
          ...sx,
        }}
        value={text}
        variant="outlined"
      />
    </>
  );
};

interface CustomProps {
  onChange: (event: {
    target: { name: string; value: NumberFormatValues };
  }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    // Type error issue fix: https://github.com/s-yadav/react-number-format/issues/880
    return (
      <NumericFormat<
        Omit<
          ComponentPropsWithoutRef<'input'>,
          'defaultValue' | 'value' | 'children'
        >
      >
        fixedDecimalScale
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values,
            },
          });
        }}
        valueIsNumericString
        {...other}
      />
    );
  },
);
