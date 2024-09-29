import { FC, useEffect, useRef } from 'react';
import { Stack } from '@mui/material';

import { useMst } from '@/models/Root';

import { StyledSearchTextFieldInput } from '@/components/atoms';
import { observer } from 'mobx-react-lite';
import { useDebounceFn } from '@/hooks';
import {
  ALAMEDA_COLUMNS,
  combineColumns,
  GridMoreIconButton,
  SortButton,
} from '@/components/molecules';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

export const GridAlamedaToolbar: FC = observer(() => {
  const {
    portfolio: {
      alamedaGridModel: { queryModel, orderColumns, updateOrderColumns },
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
        columns={combineColumns(
          ALAMEDA_COLUMNS().filter((item) => item.header),
          orderColumns,
        )}
        gridType={PortfolioGridTypeEnum.ALAMEDA}
        handleSave={(columns) => {
          updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
});
