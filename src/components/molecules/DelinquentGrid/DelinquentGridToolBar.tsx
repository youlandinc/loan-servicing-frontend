import {
  StyledButton,
  StyledSearchTextFieldInput,
  StyledSelect,
} from '@/components/atoms';
import { DelinquentTimeRangeOpt } from '@/constant';
import { useDebounceFn, useSwitch } from '@/hooks';
import { useMst } from '@/models/Root';
import { _getDelinquentRangeOpt } from '@/request/portfolio/delinquen';
import { DelinquentTimeRangeEnum } from '@/types/enum';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CircularProgress, Stack, Typography } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';

export const DelinquentGridToolBar: FC = () => {
  const {
    portfolio: { delinquentGridQueryModel },
  } = useMst();

  const [opts, setOpts] = useState<Option[]>(DelinquentTimeRangeOpt);

  const { visible, open, close } = useSwitch();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    delinquentGridQueryModel.updateQueryCondition,
    500,
  );

  const [state, getDelinquentRangeOpt] = useAsyncFn(async () => {
    return await _getDelinquentRangeOpt().then((res) => {
      if (res.data) {
        setOpts(
          DelinquentTimeRangeOpt.map((item) => ({
            ...item,
            label: `${item.label}(${res.data[item.value] || 0})`,
          })),
        );
      }
      return res;
    });
  }, []);

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        delinquentGridQueryModel.searchCondition.propertyAddress;
    }
    getDelinquentRangeOpt();
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
      <StyledButton
        size={'small'}
        sx={{
          position: 'relative',
          fontSize: '14px !important',
          fontWeight: '400 !important',
        }}
        variant={'text'}
      >
        <Stack alignItems={'center'} direction={'row'} gap={0.5}>
          Delinquent:
          <Typography variant={'body2'}>
            {
              DelinquentTimeRangeOpt.find(
                (item) =>
                  item.value ===
                  delinquentGridQueryModel.searchCondition.delinquentDays,
              )?.label
            }
          </Typography>
          <Typography
            bgcolor={'#95A8D7'}
            borderRadius={1}
            color={'#fff'}
            px={0.5}
            variant={'subtitle3'}
          >
            {state.value?.data?.[
              delinquentGridQueryModel.searchCondition
                .delinquentDays as DelinquentTimeRangeEnum
            ] || 0}
          </Typography>
          {state.loading ? (
            <CircularProgress color="inherit" size={12} />
          ) : (
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 12,
                right: 0,
              }}
            />
          )}
        </Stack>
        <StyledSelect
          onChange={(e) => {
            delinquentGridQueryModel.updateQueryCondition(
              'delinquentDays',
              e.target.value as DelinquentTimeRangeEnum,
            );
          }}
          onClose={() => {
            close();
          }}
          onOpen={async () => {
            await getDelinquentRangeOpt();
            open();
          }}
          open={visible}
          options={opts}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            '& .MuiSelect-outlined': {
              padding: '0 !important',
              height: '100%',
            },
            '& .MuiInputBase-root': {
              height: '100%',
            },
          }}
          value={delinquentGridQueryModel.searchCondition.delinquentDays}
        />
      </StyledButton>
    </Stack>
  );
};
