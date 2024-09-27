import { FC, useEffect, useRef } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useDebounceFn } from '@/hooks';

import { StyledSearchTextFieldInput } from '@/components/atoms';
import {
  combineColumns,
  GridMoreIconButton,
  transferOrderColumns,
  YOULAND_COLUMNS,
} from '@/components/molecules';
import { IOrderColumnsItem } from '@/models/gridModel';
import { PortfolioGridTypeEnum } from '@/types/enum';

export const GridYoulandToolbar: FC = observer(() => {
  const {
    portfolio: {
      youlandGridModel: { updateOrderColumns, queryModel, orderColumns },
    },
  } = useMst();

  const keywordRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    queryModel.updateQueryCondition,
    500,
  );

  useEffect(
    () => {
      if (keywordRef.current) {
        keywordRef.current.value = queryModel.searchCondition.keyword;
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

      <GridMoreIconButton
        columns={transferOrderColumns(
          combineColumns(YOULAND_COLUMNS(), orderColumns),
        )}
        gridType={PortfolioGridTypeEnum.YOULAND}
        handleSave={(columns) => {
          updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
});
