import React, { FC, useRef } from 'react';
import { Stack } from '@mui/material';

import { StyledSearchTextFieldInput } from '@/components/atoms';

export const GridCashFlowToolbar: FC = () => {
  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  return (
    <Stack alignItems={'center'} direction={'row'} gap={1.5}>
      <StyledSearchTextFieldInput
        handleClear={() => {
          //propertyAddressRef.current!.value = '';
          //updateQueryDebounce('propertyAddress', '');
        }}
        inputProps={{ ref: propertyAddressRef, autoComplete: 'off' }}
        onChange={(e) => {
          //updateQueryDebounce('propertyAddress', e.target.value);
        }}
        variant={'outlined'}
      />
    </Stack>
  );
};
