import { CircularProgress, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';

import {
  StyledButton,
  StyledSearchTextFieldInput,
  StyledSelect,
} from '@/components/atoms';
import { MaturityTypeOpt } from '@/constant';
import { useDebounceFn, useSwitch } from '@/hooks';
import { useMst } from '@/models/Root';
import { _getMaturityRangeOpt } from '@/request/portfolio/maturity';
import { MaturityTimeRangeEnum } from '@/types/enum';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const MaturityGridToolBar: FC = observer((props) => {
  const {
    portfolio: { maturityGridQueryModel },
  } = useMst();

  const [opts, setOpts] = useState<Option[]>(MaturityTypeOpt);

  const { visible, open, close } = useSwitch();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    maturityGridQueryModel.updateQueryCondition,
    500,
  );

  const [state, getMaturityRangeOpt] = useAsyncFn(async () => {
    return await _getMaturityRangeOpt().then((res) => {
      if (res.data) {
        setOpts(
          MaturityTypeOpt.map((item) => ({
            ...item,
            label: (
              <Stack alignItems={'center'} direction={'row'} gap={0.5}>
                <Typography variant={'body2'}>{item.label}</Typography>
                <Typography
                  bgcolor={'#95A8D7'}
                  borderRadius={1}
                  color={'#fff'}
                  px={0.5}
                  variant={'subtitle3'}
                >
                  {res.data[item.value] || 0}
                </Typography>
              </Stack>
            ),
          })),
        );
      }
      return res;
    });
  }, []);

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        maturityGridQueryModel.searchCondition.propertyAddress;
    }
    getMaturityRangeOpt();
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
      {/*<StyledButton
        size={'small'}
        sx={{
          position: 'relative',
          fontSize: '14px !important',
          fontWeight: '400 !important',
        }}
        variant={'text'}
      >
        <Stack alignItems={'center'} direction={'row'} gap={0.5}>
          Maturity:
          <Typography variant={'body2'}>
            {
              MaturityTypeOpt.find(
                (item) =>
                  item.value ===
                  maturityGridQueryModel.searchCondition.maturityDays,
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
              maturityGridQueryModel.searchCondition
                .maturityDays as MaturityTimeRangeEnum
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
            maturityGridQueryModel.updateQueryCondition(
              'maturityDays',
              e.target.value as MaturityTimeRangeEnum,
            );
          }}
          onClose={() => {
            close();
          }}
          onOpen={async () => {
            await getMaturityRangeOpt();
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
          value={maturityGridQueryModel.searchCondition.maturityDays}
          variant={'filled'}
        />
      </StyledButton>*/}
    </Stack>
  );
});
