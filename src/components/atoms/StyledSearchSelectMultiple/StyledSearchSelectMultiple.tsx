import { StyledButton, StyledSelectMultiple } from '@/components/atoms';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Icon, Stack, SxProps, Typography } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';

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
  px: '6px !important',
  py: 1,
  height: 'auto !important',
  width: 'auto !important',
};

interface StyledSearchSelectMultipleProps {
  sx?: SxProps;
  onChange?: (e: any) => void;
  label?: ReactNode;
  value?: any[];
  options: Option[];
}

export const StyledSearchSelectMultiple: FC<
  StyledSearchSelectMultipleProps
> = ({ onChange, label, sx, value, options }) => {
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    if (value?.length) {
      const selectedOptions = value.filter((item: string) =>
        options.some((option) => option.value === item),
      );
      setSelected(selectedOptions);
    }
  }, [value, options]);

  return (
    <StyledButton
      // disabled={propertyAddressRef.current?.value !== ''}
      endIcon={
        <Icon
          component={KeyboardArrowDownIcon}
          sx={{ minWidth: 20, height: 20 }}
        />
      }
      sx={
        {
          ...BtnDefaultStyle,
          fontSize: 14,
          fontWeight: '400 !important',
          // ...sx,
          color: selected.length > 0 ? 'primary' : '#636A7C !important',
          p: '0 !important',
          height: 'auto !important',
          ...sx,
        } as SxProps
      }
      variant={'text'}
    >
      <Stack alignItems={'center'} direction={'row'}>
        <Typography
          color={
            /*     propertyAddressRef.current?.value !== ''
                            ? 'text.disabled'
                            : btnSelected.stageList
                                ? 'primary'
                                : 'text.primary'*/
            selected.length > 0 ? 'primary' : '#636A7C !important'
          }
          variant={'body2'}
        >
          {label}
        </Typography>
        {/* {activeStatus ||
                allStatus ||
                propertyAddressRef.current?.value !== '' ? null : (*/}
        <Typography
          bgcolor={'#95A8D7'}
          borderRadius={1}
          color={'text.white'}
          fontWeight={600}
          height={18}
          lineHeight={'18px'}
          minWidth={18}
          ml={1}
          px={0.5}
          variant={'body2'}
        >
          {selected.length}
        </Typography>
        {/*   )}*/}
      </Stack>

      <StyledSelectMultiple
        label={label}
        onValueChange={(e) => {
          setSelected(e);
          onChange?.(e);
        }}
        options={options}
        size={'small'}
        sx={{
          width: 'auto',
          opacity: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          zIndex: 1,
          // height: '40px !important',
        }}
        value={selected}
      />
    </StyledButton>
  );
};
