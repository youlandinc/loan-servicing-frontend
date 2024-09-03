import { StyledSearchLoanOfficer } from '@/components/atoms/StyledSearchLoanOfficer';
import { PIPELINE_STATUS } from '@/constant';
import { isValid } from 'date-fns';
import { FC, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {
  StyledButton,
  StyledCheckbox,
  StyledDateRange,
  StyledSearchTextFieldInput,
  StyledSelect,
  StyledSelectMultiple,
} from '@/components/atoms';

import { useMst } from '@/models/Root';
import { useDebounceFn } from '@/hooks';

export const AllLoansGridToolBar: FC = observer(() => {
  const {
    portfolio: { allLoansGridQueryModel },
  } = useMst();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [closingDate, setClosingDate] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [, , updateQueryDebounce] = useDebounceFn(
    allLoansGridQueryModel.updateQueryCondition,
    500,
  );

  return (
    <Stack direction={'row'} gap={1.5}>
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
      <StyledDateRange
        /*    customInput={
          <CustomInput
            onClear={() => {
              setClosingDate([null, null]);
              updateSearchParam({
                ...searchParam,
                searchCondition: {
                  ...searchParam.searchCondition,
                  estClosingStartDate: null,
                  estClosingEndDate: null,
                },
              });
            }}
          />
        }*/
        dateRange={closingDate}
        label={'Est. closing date'}
        // onCalendarClose={() => {
        //   setBtnSelected({ ...btnSelected, timeRange: false });
        // }}
        onChange={(date: [Date | null, Date | null]) => {
          setClosingDate(date);
          isValid(date[0]) &&
            updateQueryDebounce('maturityStartDate', date[0]?.toISOString());
          isValid(date[1]) &&
            updateQueryDebounce('maturityEndDate', date[1]?.toISOString());
        }}
        placeholderText={'Est. closing date'}
        popperPlacement={'bottom-start'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& .react-datepicker-wrapper': {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />
      <StyledSelectMultiple
        label={'Status'}
        onValueChange={(e) => {
          updateQueryDebounce('status', e);
        }}
        options={PIPELINE_STATUS}
        sx={{ width: 150, maxHeight: 500 }}
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
