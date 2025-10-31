import React, { FC, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CircularProgress, Stack, SxProps, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import useSWR from 'swr';

import { useMst } from '@/models/Root';

import { MaturityTypeOpt } from '@/constant';
import { useSwitch } from '@/hooks';

import { StyledButton, StyledSelect } from '@/components/atoms';

import { _getMaturityRangeOpt } from '@/request/portfolio/maturity';
import { MaturityTimeRangeEnum, PortfolioGridTypeEnum } from '@/types/enum';

interface StyledMaturitySelectProps {
  sx?: SxProps;
  value?: MaturityTimeRangeEnum;
  onChange?: (value: MaturityTimeRangeEnum) => void;
}

export const StyledMaturitySelect: FC<StyledMaturitySelectProps> = observer(
  ({ sx, onChange }) => {
    const {
      portfolio: { displayType: portfolioListType, maturityGridModel },
    } = useMst();

    const [opts, setOpts] = useState<Option[]>(MaturityTypeOpt);

    const { visible, open, close } = useSwitch();

    /* const [maturityDays, setMaturityDays] = useState<MaturityTimeRangeEnum>(
      MaturityTimeRangeEnum.ALREADY_END,
    );

    if (value && value !== maturityDays) {
      setMaturityDays(value);
    } */

    /* const [state, getMaturityRangeOpt] = useAsyncFn(
      async (status: string[]) => {
        return await _getMaturityRangeOpt({
          searchCondition: {
            repaymentStatusList: status,
          },
        }).then((res) => {
          if (res.data) {
            setOpts(
              MaturityTypeOpt.map((item) => ({
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
      },
      [],
    ); */

    const { data, isLoading } = useSWR(
      portfolioListType === PortfolioGridTypeEnum.MATURITY
        ? [
            {
              searchCondition: {
                repaymentStatusList:
                  maturityGridModel.queryModel.searchCondition
                    .repaymentStatusList,
              },
            },
          ]
        : null,
      async ([p]) => {
        return await _getMaturityRangeOpt(p).then((res) => {
          if (res.data) {
            setOpts(
              MaturityTypeOpt.map((item) => ({
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
      },
    );

    /*
    useEffect(
      () => {
        getMaturityRangeOpt(
          maturityGridModel.queryModel.searchCondition
            .repaymentStatusList as unknown as string[],
        ).catch(({ message, variant, header }) => {
          enqueueSnackbar(message, {
            variant,
            isSimple: !header,
            header,
          });
        });
      },
      //eslint-disable-next-line react-hooks/exhaustive-deps
      [
        //eslint-disable-next-line react-hooks/exhaustive-deps
        maturityGridModel.queryModel.searchCondition.repaymentStatusList?.join(
          '',
        ),
      ],
    );
*/

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
          color:
            portfolioListType === PortfolioGridTypeEnum.MATURITY
              ? 'red'
              : 'black',
          ...sx,
        }}
        variant={'text'}
      >
        <Stack alignItems={'center'} direction={'row'} gap={1}>
          <Typography
            color={
              portfolioListType === PortfolioGridTypeEnum.MATURITY
                ? '#5B76BC'
                : '#636A7C'
            }
            variant={'body2'}
          >
            {
              MaturityTypeOpt.find(
                (item) =>
                  item.value ===
                  maturityGridModel.queryModel.searchCondition.maturityDays,
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
            {data?.data?.[
              maturityGridModel.queryModel.searchCondition
                .maturityDays as MaturityTimeRangeEnum
            ] || 0}
          </Typography>
          {isLoading ? (
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
            maturityGridModel.queryModel.updateQueryCondition(
              'maturityDays',
              e.target.value as MaturityTimeRangeEnum,
            );
            onChange?.(e.target.value as MaturityTimeRangeEnum);
          }}
          onClose={() => {
            close();
          }}
          onOpen={async () => {
            if (portfolioListType === PortfolioGridTypeEnum.MATURITY) {
              /* await getMaturityRangeOpt(
                maturityGridModel.queryModel.searchCondition
                  .repaymentStatusList as unknown as string[],
              ); */
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
          value={maturityGridModel.queryModel.searchCondition.maturityDays}
        />
      </StyledButton>
    );
  },
);
