import { Stack } from '@mui/material';
import { isValid } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef } from 'react';

import {
  StyledSearchDateRange,
  StyledSearchLoanOfficer,
  StyledSearchSelectMultiple,
  StyledSearchTextFieldInput,
} from '@/components/atoms';

import { PIPELINE_STATUS } from '@/constant';
import { useDebounceFn } from '@/hooks';
import { useMst } from '@/models/Root';

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

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        investorGridModel.queryModel.searchCondition.keyword;
    }
    return () => {
      // investorGridModel.queryModel.resetDefault();
    };
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
        dateRange={[
          isValid(
            new Date(
              investorGridModel.queryModel.searchCondition.maturityStartDate,
            ),
          )
            ? new Date(
                investorGridModel.queryModel.searchCondition.maturityStartDate,
              )
            : null,
          isValid(
            new Date(
              investorGridModel.queryModel.searchCondition.maturityEndDate,
            ),
          )
            ? new Date(
                investorGridModel.queryModel.searchCondition.maturityEndDate,
              )
            : null,
        ]}
        hanelClear={() => {
          updateQueryDateRangeDebounce({
            startDate: '',
            endDate: '',
          });
        }}
        onChange={(date) => {
          updateQueryDateRangeDebounce({
            startDate: isValid(date[0]) ? date[0]?.toISOString() : '',
            endDate: isValid(date[1]) ? date[1]?.toISOString() : '',
          });
        }}
      />

      <StyledSearchSelectMultiple
        label={'Status'}
        onChange={(e) => {
          updateQueryDebounce('status', e);
        }}
        options={PIPELINE_STATUS}
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
    </Stack>
  );
});
