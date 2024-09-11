import { StyledSearchTextFieldInput } from '@/components/atoms';
import { useDebounceFn } from '@/hooks';
import { useMst } from '@/models/Root';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef } from 'react';

export const MaturityGridToolBar: FC = observer((props) => {
  const {
    portfolio: { maturityGridQueryModel },
  } = useMst();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    maturityGridQueryModel.updateQueryCondition,
    500,
  );

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        maturityGridQueryModel.searchCondition.propertyAddress;
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
    </Stack>
  );
});
