import { FC, useEffect, useRef } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useDebounceFn } from '@/hooks';

import { StyledSearchTextFieldInput } from '@/components/atoms';
import {
  combineColumns,
  GridMoreIconButton,
  SortButton,
  YOULAND_COLUMNS,
} from '@/components/molecules';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

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

      {queryModel.sort.length > 0 && (
        <SortButton
          handleClear={(e) => {
            e.stopPropagation();
            queryModel.updateSort([]);
          }}
          handleClick={() => {
            queryModel.updateSort([
              {
                ...queryModel.sort[0],
                direction:
                  queryModel.sort[0].direction === SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC,
              },
            ]);
          }}
          sortItems={queryModel.sort[0]}
        />
      )}

      <GridMoreIconButton
        columns={combineColumns(YOULAND_COLUMNS(), orderColumns)}
        gridType={PortfolioGridTypeEnum.YOULAND}
        handleSave={(columns) => {
          updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
});
