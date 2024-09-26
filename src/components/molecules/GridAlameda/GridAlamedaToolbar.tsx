import { FC, useEffect, useRef } from 'react';
import { Stack } from '@mui/material';

import { useMst } from '@/models/Root';

import { StyledSearchTextFieldInput } from '@/components/atoms';
import { observer } from 'mobx-react-lite';
import { useDebounceFn } from '@/hooks';

export const GridAlamedaToolbar: FC = observer(() => {
  const {
    portfolio: { alamedaGridModel },
  } = useMst();

  const keywordRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    alamedaGridModel.queryModel.updateQueryCondition,
    500,
  );

  useEffect(
    () => {
      if (keywordRef.current) {
        keywordRef.current.value =
          alamedaGridModel.queryModel.searchCondition.keyword;
      }

      return () => {
        // allLoansGridModel.queryModel.resetDefault();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Stack alignItems={'center'} direction={'row'} gap={1.5}>
      <StyledSearchTextFieldInput
        handleClear={() => {
          keywordRef.current!.value = '';
          updateQueryDebounce('keyword', '');
        }}
        inputProps={{ ref: keywordRef, autoComplete: 'off' }}
        onChange={(e) => {
          updateQueryDebounce('keyword', e.target.value);
        }}
        variant={'outlined'}
      />
    </Stack>
  );
});
