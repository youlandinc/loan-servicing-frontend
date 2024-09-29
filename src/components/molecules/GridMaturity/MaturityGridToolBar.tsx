import {
  StyledSearchLoanOfficer,
  StyledSearchSelectMultiple,
  StyledSearchTextFieldInput,
} from '@/components/atoms';
import {
  combineColumns,
  GridMoreIconButton,
  maturityColumns,
  SortButton,
} from '@/components/molecules';
import { PIPELINE_STATUS } from '@/constant';
import { useDebounceFn } from '@/hooks';
import { useMst } from '@/models/Root';
import {
  MaturityTimeRangeEnum,
  PortfolioGridTypeEnum,
  SortDirection,
} from '@/types/enum';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef } from 'react';

export const MaturityGridToolBar: FC = observer(() => {
  const {
    portfolio: { maturityGridModel },
  } = useMst();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    maturityGridModel.queryModel.updateQueryCondition,
    500,
  );

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        maturityGridModel.queryModel.searchCondition.keyword;
    }
    // getMaturityRangeOpt();
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
      <StyledSearchSelectMultiple
        label={'Status'}
        onChange={(e) => {
          updateQueryDebounce('repaymentStatusList', e);
        }}
        options={PIPELINE_STATUS}
        value={maturityGridModel.queryModel.searchCondition.repaymentStatusList}
      />
      {maturityGridModel.queryModel.sort.length > 0 && (
        <SortButton
          handleClear={(e) => {
            e.stopPropagation();
            maturityGridModel.queryModel.updateSort([]);
          }}
          handleClick={() => {
            maturityGridModel.queryModel.updateSort([
              {
                ...maturityGridModel.queryModel.sort[0],
                direction:
                  maturityGridModel.queryModel.sort[0].direction ===
                  SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC,
              },
            ]);
          }}
          sortItems={maturityGridModel.queryModel.sort[0]}
        />
      )}
      <GridMoreIconButton
        columns={combineColumns(
          maturityColumns(
            maturityGridModel.queryModel.searchCondition
              .maturityDays as MaturityTimeRangeEnum,
          ),
          maturityGridModel.orderColumns,
        )}
        gridType={PortfolioGridTypeEnum.MATURITY}
        handleSave={(columns) => {
          maturityGridModel.updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
});
