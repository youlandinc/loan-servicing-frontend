import { useMst } from '@/models/Root';
import React, { FC, useEffect, useState } from 'react';
import { CircularProgress, Stack, SxProps, Typography } from '@mui/material';
import { useAsyncFn } from 'react-use';

import { StyledButton, StyledSelect } from '@/components/atoms';

import { useSwitch } from '@/hooks';
import { DelinquentTimeRangeOpt } from '@/constant';
import { _getDelinquentRangeOpt } from '@/request/portfolio/delinquen';
import { DelinquentTimeRangeEnum, PortfolioGridTypeEnum } from '@/types/enum';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface StyledDelinquentSelectProps {
  sx?: SxProps;
  value?: DelinquentTimeRangeEnum;
  onChange?: (value: DelinquentTimeRangeEnum) => void;
}

export const StyledDelinquentSelect: FC<StyledDelinquentSelectProps> = ({
  sx,
  value,
  onChange,
}) => {
  const {
    portfolio: { displayType: portfolioListType, delinquentGridModel },
  } = useMst();
  const [opts, setOpts] = useState<Option[]>(DelinquentTimeRangeOpt);

  const { visible, open, close } = useSwitch();

  // const [delinquentDays, setDelinquentDays] = useState<DelinquentTimeRangeEnum>(
  //   DelinquentTimeRangeEnum.ALL,
  // );

  // if (value && value !== delinquentDays) {
  //   setDelinquentDays(value);
  // }

  const [state, getDelinquentRangeOpt] = useAsyncFn(async () => {
    return await _getDelinquentRangeOpt().then((res) => {
      if (res.data) {
        setOpts(
          DelinquentTimeRangeOpt.map((item) => ({
            ...item,
            label: (
              <Stack alignItems={'center'} direction={'row'} gap={1}>
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
    getDelinquentRangeOpt();
  }, []);

  return (
    <StyledButton
      onClick={(e) => {
        e.stopPropagation();
      }}
      size={'small'}
      sx={{
        position: 'relative',
        fontSize: '14px !important',
        fontWeight: '400 !important',
        px: '8px !important',
        py: '4px !important',
        bgcolor: '#fff !important',
        height: '28px !important',
        borderRadius: '4px !important',
        ...sx,
      }}
      variant={'text'}
    >
      <Stack alignItems={'center'} direction={'row'} gap={1}>
        <Typography
          color={
            portfolioListType === PortfolioGridTypeEnum.DELINQUENT
              ? '#5B76BC'
              : '#636A7C'
          }
          variant={'body2'}
        >
          {
            DelinquentTimeRangeOpt.find(
              (item) =>
                item.value ===
                ((delinquentGridModel.queryModel.searchCondition
                  .delinquentDays as DelinquentTimeRangeEnum) ||
                  DelinquentTimeRangeEnum.ALL),
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
            (delinquentGridModel.queryModel.searchCondition
              .delinquentDays as DelinquentTimeRangeEnum) ||
              DelinquentTimeRangeEnum.ALL
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
          delinquentGridModel.queryModel.updateQueryCondition(
            'delinquentDays',
            e.target.value as DelinquentTimeRangeEnum,
          );
          onChange?.(e.target.value as DelinquentTimeRangeEnum);
        }}
        onClose={() => {
          close();
        }}
        onOpen={async (e) => {
          e.stopPropagation();
          if (portfolioListType === PortfolioGridTypeEnum.DELINQUENT) {
            await getDelinquentRangeOpt();
            open();
          }
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
        value={delinquentGridModel.queryModel.searchCondition.delinquentDays}
      />
    </StyledButton>
  );
};
