import { FC, useEffect, useRef } from 'react';

import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { enqueueSnackbar } from 'notistack';
import useSWR from 'swr';

import { useMst } from '@/models/Root';

import { useDebounceFn } from '@/hooks';

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

import { _getAllStatus } from '@/request';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

import ExitToAppIcon from './assets/icon_export.svg';

export const AllLoansGridToolBar: FC = observer(() => {
  const {
    portfolio: { allLoansGridModel },
  } = useMst();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    allLoansGridModel.queryModel.updateQueryCondition,
    500,
  );

  const [, , updateQueryDateRangeDebounce] = useDebounceFn(
    allLoansGridModel.queryModel.updateQueryDateRange,
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
        allLoansGridModel.queryModel.searchCondition.keyword || '';
    }
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
          allLoansGridModel.queryModel.searchCondition.maturityStartDate
            ? new Date(
                allLoansGridModel.queryModel.searchCondition.maturityStartDate,
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
        value={allLoansGridModel.queryModel.searchCondition.repaymentStatusList}
      />
      <StyledSearchLoanOfficer
        defaultLabel={'Investor'}
        handleChange={(param) => {
          updateQueryDebounce('investors', [param]);
        }}
        handleClear={() => {
          updateQueryDebounce('investors', []);
        }}
        value={allLoansGridModel.queryModel.searchCondition.investors[0]}
      />
      {allLoansGridModel.queryModel.sort.length === 1 && (
        <SortButton
          handleClear={(e) => {
            e.stopPropagation();
            allLoansGridModel.queryModel.updateSort([]);
          }}
          handleClick={() => {
            allLoansGridModel.queryModel.updateSort([
              {
                ...allLoansGridModel.queryModel.sort[0],
                direction:
                  allLoansGridModel.queryModel.sort[0].direction ===
                  SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC,
              },
            ]);
          }}
          sortItems={allLoansGridModel.queryModel.sort[0]}
        />
      )}

      <GridMoreIconButton
        columns={combineColumns(defaultColumns, allLoansGridModel.orderColumns)}
        gridType={PortfolioGridTypeEnum.ALL_LOANS}
        handleSave={(columns) => {
          allLoansGridModel.updateOrderColumns(columns);
        }}
        menus={[
          {
            label: 'Export',
            icon: ExitToAppIcon,
            handleClick: () => {
              allLoansGridModel.updateIsExported(true);
            },
          },
        ]}
      />
    </Stack>
  );
});
