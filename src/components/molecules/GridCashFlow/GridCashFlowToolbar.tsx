import { FC, useEffect, useRef } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useDebounceFn } from '@/hooks';

import { StyledSearchTextFieldInput } from '@/components/atoms';

export const GridCashFlowToolbar: FC = observer(() => {
  const {
    portfolio: { cashFlowGridModel },
  } = useMst();

  const keywordRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    cashFlowGridModel.queryModel.updateQueryCondition,
    500,
  );

  useEffect(
    () => {
      if (keywordRef.current) {
        keywordRef.current.value =
          cashFlowGridModel.queryModel.searchCondition.keyword;
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
