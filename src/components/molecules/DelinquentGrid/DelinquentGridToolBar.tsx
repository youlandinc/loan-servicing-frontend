import { StyledSearchTextFieldInput, StyledSelect } from '@/components/atoms';
import { DelinquentTimeRangeOpt } from '@/constant';
import { useDebounceFn } from '@/hooks';
import { useMst } from '@/models/Root';
import { Stack } from '@mui/material';
import { FC, useEffect, useRef } from 'react';

export const DelinquentGridToolBar: FC = () => {
  const {
    portfolio: { delinquentGridQueryModel },
  } = useMst();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    delinquentGridQueryModel.updateQueryCondition,
    500,
  );

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        delinquentGridQueryModel.searchCondition.propertyAddress;
    }
  }, []);

  return (
    <Stack alignItems={'center'} direction={'row'} gap={1.5}>
      <StyledSearchTextFieldInput
        handleClear={() => {
          propertyAddressRef.current!.value = '';
          updateQueryDebounce('propertyAddress', '');
        }}
        inputProps={{ ref: propertyAddressRef }}
        onChange={(e) => {
          updateQueryDebounce('propertyAddress', e.target.value);
        }}
        variant={'outlined'}
      />
      {/*    <StyledSelect
        onChange={(e) => {
          updateQueryDebounce(
            'delinquentDays',
            e.target.value === '' ? undefined : e.target.value,
          );
        }}
        options={DelinquentTimeRangeOpt}
        value={delinquentGridQueryModel.searchCondition.delinquentDays}
      />*/}
    </Stack>
  );
};
