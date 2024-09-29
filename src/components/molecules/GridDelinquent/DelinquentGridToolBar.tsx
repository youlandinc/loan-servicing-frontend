import { Stack } from '@mui/material';
import React, { FC, useEffect, useRef } from 'react';

import { StyledSearchTextFieldInput } from '@/components/atoms';
import {
  combineColumns,
  delinquentColumns,
  GridMoreIconButton,
  SortButton,
  transferOrderColumns,
} from '@/components/molecules';
import { useDebounceFn } from '@/hooks';
import { IOrderColumnsItem } from '@/models/gridModel';
import { useMst } from '@/models/Root';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

export const DelinquentGridToolBar: FC = () => {
  const {
    portfolio: { delinquentGridModel },
  } = useMst();

  // const [opts, setOpts] = useState<Option[]>(DelinquentTimeRangeOpt);

  // const { visible, open, close } = useSwitch();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    delinquentGridModel.queryModel.updateQueryCondition,
    500,
  );

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        delinquentGridModel.queryModel.searchCondition.keyword;
    }
    // getDelinquentRangeOpt();
  }, []);

  return (
    <Stack alignItems={'center'} direction={'row'} gap={1.5}>
      <StyledSearchTextFieldInput
        handleClear={() => {
          propertyAddressRef.current!.value = '';
          updateQueryDebounce('keyword', '');
        }}
        inputProps={{ ref: propertyAddressRef }}
        onChange={(e) => {
          updateQueryDebounce('keyword', e.target.value);
        }}
        variant={'outlined'}
      />
      {delinquentGridModel.queryModel.sort.length > 0 && (
        <SortButton
          handleClear={(e) => {
            e.stopPropagation();
            delinquentGridModel.queryModel.updateSort([]);
          }}
          handleClick={() => {
            delinquentGridModel.queryModel.updateSort([
              {
                ...delinquentGridModel.queryModel.sort[0],
                direction:
                  delinquentGridModel.queryModel.sort[0].direction ===
                  SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC,
              },
            ]);
          }}
          sortItems={delinquentGridModel.queryModel.sort[0]}
        />
      )}
      <GridMoreIconButton
        columns={combineColumns(
          delinquentColumns,
          delinquentGridModel.orderColumns,
        )}
        gridType={PortfolioGridTypeEnum.DELINQUENT}
        handleSave={(columns) => {
          delinquentGridModel.updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
};
