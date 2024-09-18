import { FC, useEffect, useRef } from 'react';
import { Stack } from '@mui/material';
import { isValid } from 'date-fns';
import { observer } from 'mobx-react-lite';

import {
  StyledSearchDateRange,
  StyledSearchLoanOfficer,
  StyledSearchSelectMultiple,
  StyledSearchTextFieldInput,
} from '@/components/atoms';
import { PIPELINE_STATUS } from '@/constant';
import { useDebounceFn } from '@/hooks';

import { useMst } from '@/models/Root';

export const AllLoansGridToolBar: FC = observer(() => {
  const {
    portfolio: { allLoansGridQueryModel },
  } = useMst();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    allLoansGridQueryModel.updateQueryCondition,
    500,
  );

  const [, , updateQueryDateRangeDebounce] = useDebounceFn(
    allLoansGridQueryModel.updateQueryDateRange,
    500,
  );

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        allLoansGridQueryModel.searchCondition.propertyAddress;
    }

    return () => {
      // allLoansGridQueryModel.resetDefault();
    };
  }, []);

  return (
    <Stack alignItems={'center'} direction={'row'} gap={1.5}>
      <StyledSearchTextFieldInput
        handleClear={() => {
          propertyAddressRef.current!.value = '';
          updateQueryDebounce('propertyAddress', '');
        }}
        inputProps={{ ref: propertyAddressRef }}
        onChange={(e) => {
          updateQueryDebounce('propertyAddress', e.target.value);
        }}
        variant={'outlined'}
      />
      <StyledSearchDateRange
        dateRange={[
          isValid(
            new Date(allLoansGridQueryModel.searchCondition.maturityStartDate),
          )
            ? new Date(allLoansGridQueryModel.searchCondition.maturityStartDate)
            : null,
          isValid(
            new Date(allLoansGridQueryModel.searchCondition.maturityEndDate),
          )
            ? new Date(allLoansGridQueryModel.searchCondition.maturityEndDate)
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
          updateQueryDebounce('repaymentStatusList', e);
        }}
        options={PIPELINE_STATUS}
        value={allLoansGridQueryModel.searchCondition.repaymentStatusList}
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
