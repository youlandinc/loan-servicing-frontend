import { FC, useEffect, useRef, useState } from 'react';

import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { useAsync } from 'react-use';

import { useMst } from '@/models/Root';

import { REPAYMENT_STATUS_OPTIONS, TRADE_STATUS_OPTIONS } from '@/constant';
import { useDebounceFn } from '@/hooks';

import {
  StyledSearchSelectMultiple,
  StyledSearchTextFieldInput,
} from '@/components/atoms';
import {
  combineColumns,
  GridMoreIconButton,
  SortButton,
  YOULAND_COLUMNS,
} from '@/components/molecules';

import { _fetchInvestorData } from '@/request';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';
import { TableTypeEnum } from '@/types/pipeline/youland';

export const GridYoulandToolbar: FC = observer(() => {
  const {
    portfolio: {
      displayType,
      youlandGridModel: { updateOrderColumns, queryModel, orderColumns },
    },
  } = useMst();

  const keywordRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    queryModel.updateQueryCondition,
    500,
  );

  const [investorData, setInvestorData] = useState<
    Array<Option & { bgColor: string; color: string }>
  >([]);

  useAsync(async () => {
    if (displayType !== PortfolioGridTypeEnum.YOULAND) {
      return;
    }
    const { data } = await _fetchInvestorData({
      investorName: TableTypeEnum.youland,
    });
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
      key: null,
      bgColor: 'transparent',
      color: 'rgba(0,0,0,.87)',
    });
    setInvestorData(temp);
  }, [displayType]);

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

      <StyledSearchSelectMultiple
        label={'Status'}
        onChange={(e) => {
          updateQueryDebounce('repaymentStatusList', e);
        }}
        options={REPAYMENT_STATUS_OPTIONS}
        value={[...queryModel.searchCondition.repaymentStatusList]}
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

      {queryModel.sort.length === 1 && (
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
          YOULAND_COLUMNS().filter((item) => item.header),
          orderColumns,
        )}
        gridType={PortfolioGridTypeEnum.YOULAND}
        handleSave={(columns) => {
          updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
});
