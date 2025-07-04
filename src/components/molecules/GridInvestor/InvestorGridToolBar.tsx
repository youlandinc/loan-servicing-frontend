import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { enqueueSnackbar } from 'notistack';
import { FC, useEffect, useRef } from 'react';
import useSWR from 'swr';

import {
  StyledSearchDateRange,
  StyledSearchLoanOfficer,
  StyledSearchSelectMultiple,
  StyledSearchTextFieldInput,
} from '@/components/atoms';
import {
  combineColumns,
  defaultColumns,
  GridMoreIconButton,
  SortButton,
} from '@/components/molecules';
import { useDebounceFn } from '@/hooks';
import { useMst } from '@/models/Root';
import { _getAllStatus } from '@/request';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

export const InvestorGridToolBar: FC = observer(() => {
  const {
    portfolio: { investorGridModel },
  } = useMst();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    investorGridModel.queryModel.updateQueryCondition,
    500,
  );

  const [, , updateQueryDateRangeDebounce] = useDebounceFn(
    investorGridModel.queryModel.updateQueryDateRange,
    500,
  );

  const { data } = useSWR('_getAllStatus', async () => {
    return await _getAllStatus().catch(({ message, variant, header }) => {
      close();
      enqueueSnackbar(message ?? 'error!', {
        variant,
        isSimple: !header,
        header,
      });
    });
  });

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        investorGridModel.queryModel.searchCondition.keyword || '';
    }
    return () => {
      // investorGridModel.queryModel.resetDefault();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <StyledSearchDateRange
        date={
          investorGridModel.queryModel.searchCondition.maturityStartDate
            ? new Date(
                investorGridModel.queryModel.searchCondition.maturityStartDate,
              )
            : null
        }
        handleClear={() => {
          updateQueryDateRangeDebounce({
            startDate: '',
            endDate: '',
          });
        }}
        onChange={() => {
          return;
        }}
        onSelect={(date) => {
          if (date) {
            updateQueryDateRangeDebounce({
              startDate: date.toISOString(),
              endDate: '',
            });
          }
        }}
      />

      <StyledSearchSelectMultiple
        label={'Status'}
        onChange={(e) => {
          updateQueryDebounce('repaymentStatusList', e);
        }}
        options={data?.data || []}
        value={[
          ...investorGridModel.queryModel.searchCondition.repaymentStatusList,
        ]}
      />
      <StyledSearchLoanOfficer
        defaultLabel={'Investor'}
        handleChange={(param) => {
          updateQueryDebounce('investors', [param]);
        }}
        handleClear={() => {
          updateQueryDebounce('investors', []);
        }}
      />
      {investorGridModel.queryModel.sort.length === 1 && (
        <SortButton
          handleClear={(e) => {
            e.stopPropagation();
            investorGridModel.queryModel.updateSort([]);
          }}
          handleClick={() => {
            investorGridModel.queryModel.updateSort([
              {
                ...investorGridModel.queryModel.sort[0],
                direction:
                  investorGridModel.queryModel.sort[0].direction ===
                  SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC,
              },
            ]);
          }}
          sortItems={investorGridModel.queryModel.sort[0]}
        />
      )}
      <GridMoreIconButton
        columns={combineColumns(defaultColumns, investorGridModel.orderColumns)}
        gridType={PortfolioGridTypeEnum.BY_INVESTOR}
        handleSave={(columns) => {
          investorGridModel.updateOrderColumns(columns);
        }}
      />
    </Stack>
  );
});
