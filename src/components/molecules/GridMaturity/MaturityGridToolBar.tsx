import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef } from 'react';

import { StyledSearchTextFieldInput } from '@/components/atoms';
import {
  combineColumns,
  GridMoreIconButton,
  maturityColumns,
  SortButton,
  transferOrderColumns,
} from '@/components/molecules';
import { useDebounceFn } from '@/hooks';
import { IOrderColumnsItem } from '@/models/gridModel';
import { useMst } from '@/models/Root';
import {
  MaturityTimeRangeEnum,
  PortfolioGridTypeEnum,
  SortDirection,
} from '@/types/enum';

export const MaturityGridToolBar: FC = observer(() => {
  const {
    portfolio: { maturityGridModel },
  } = useMst();

  // const [opts, setOpts] = useState<Option[]>(MaturityTypeOpt);

  // const { visible, open, close } = useSwitch();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    maturityGridModel.queryModel.updateQueryCondition,
    500,
  );

  /* const [state, getMaturityRangeOpt] = useAsyncFn(async () => {
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
  }, []);*/

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        maturityGridModel.queryModel.searchCondition.keyword;
    }
    // getMaturityRangeOpt();
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
      {maturityGridModel.queryModel.sort.length > 0 && (
        <SortButton
          handleClear={(e) => {
            e.stopPropagation();
            maturityGridModel.queryModel.updateSort([]);
          }}
          handleClick={() => {
            maturityGridModel.queryModel.updateSort([
              {
                ...maturityGridModel.queryModel.sort[0],
                direction:
                  maturityGridModel.queryModel.sort[0].direction ===
                  SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC,
              },
            ]);
          }}
          sortItems={maturityGridModel.queryModel.sort[0]}
        />
      )}
      <GridMoreIconButton
        columns={
          transferOrderColumns(
            combineColumns(
              maturityColumns(
                maturityGridModel.queryModel.searchCondition
                  .maturityDays as MaturityTimeRangeEnum,
              ),
              maturityGridModel.orderColumns,
            ),
          ) as IOrderColumnsItem[]
        }
        gridType={PortfolioGridTypeEnum.MATURITY}
        handleSave={(columns) => {
          maturityGridModel.updateOrderColumns(columns);
        }}
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
            {state.value?.data?.[
              maturityGridModel.queryModel.searchCondition
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
            maturityGridModel.queryModel.updateQueryCondition(
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
          value={maturityGridModel.queryModel.searchCondition.maturityDays}
          variant={'filled'}
        />
      </StyledButton>*/}
    </Stack>
  );
});
