import { FC, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { TRADE_STATUS_OPTIONS } from '@/constant';
import { useDebounceFn } from '@/hooks';

import {
  StyledSearchSelectMultiple,
  StyledSearchTextFieldInput,
} from '@/components/atoms';
import {
  CASH_FLOW_COLUMNS,
  combineColumns,
  GridMoreIconButton,
  SortButton,
} from '@/components/molecules';

import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';
import { _fetchInvestorData } from '@/request';

export const GridCashFlowToolbar: FC = observer(() => {
  const {
    portfolio: {
      displayType,
      cashFlowGridModel: { queryModel, orderColumns, updateOrderColumns },
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

  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string; color: string }>
  >([]);

  useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.CASH_FLOW) {
      return;
    }
    const { data } = await _fetchInvestorData({});
    const temp = data.reduce(
      (acc, cur) => {
        acc.push({
          label: cur.investorName,
          value: cur.investorName,
          key: cur.id,
          bgColor: cur.bgColor,
          color: cur.color,
        });
        return acc;
      },
      [] as Array<Option & { bgColor: string; color: string }>,
    );
    temp.unshift({
      label: 'None',
      value: 'None',
      key: NaN,
      bgColor: 'transparent',
      color: 'rgba(0,0,0,.87)',
    });
    setInvestorData(temp);
  }, [displayType]);

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

      <StyledSearchSelectMultiple
        label={'Trade status'}
        onChange={(e) => {
          updateQueryDebounce('tradeStatus', e);
        }}
        options={TRADE_STATUS_OPTIONS}
        value={[...queryModel.searchCondition.tradeStatus]}
      />

      <StyledSearchSelectMultiple
        label={'Prospective buyer'}
        onChange={(e) => {
          updateQueryDebounce('prospectiveBuyers', e);
        }}
        options={investorData}
        value={[...queryModel.searchCondition.prospectiveBuyers]}
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
        columns={combineColumns(CASH_FLOW_COLUMNS(), orderColumns)}
        gridType={PortfolioGridTypeEnum.CASH_FLOW}
        handleSave={(columns) => {
          updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
});
