import { PIPELINE_STATUS } from '@/constant';
import { PipelineStatusEnum } from '@/types/enum';
import { isValid } from 'date-fns';
import { FC, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Stack } from '@mui/material';

import {
  StyledHeaderAddressInfo,
  StyledSearchDateRange,
  StyledSearchLoanOfficer,
  StyledSearchSelectMultiple,
  StyledSearchTextFieldInput,
  StyledSelectMultiple,
} from '@/components/atoms';

import { useMst } from '@/models/Root';
import { useDebounceFn } from '@/hooks';

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
      <StyledHeaderAddressInfo
        address={'5804 Shenandoah Ave, Los Angeles, CA 90056'}
        loanNumber={'20240807-236C'}
        status={PipelineStatusEnum.PERFORMING}
      />
    </Stack>
  );
});
