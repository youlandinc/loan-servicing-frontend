import { Stack } from '@mui/material';
import React, { FC, useEffect, useRef } from 'react';

import { StyledSearchTextFieldInput } from '@/components/atoms';
import {
  combineColumns,
  delinquentColumns,
  GridMoreIconButton,
  SortButton,
  transferOrderColumns,
} from '@/components/molecules';
import { useDebounceFn } from '@/hooks';
import { IOrderColumnsItem } from '@/models/gridModel';
import { useMst } from '@/models/Root';
import { PortfolioGridTypeEnum, SortDirection } from '@/types/enum';

export const DelinquentGridToolBar: FC = () => {
  const {
    portfolio: { delinquentGridModel },
  } = useMst();

  // const [opts, setOpts] = useState<Option[]>(DelinquentTimeRangeOpt);

  // const { visible, open, close } = useSwitch();

  const propertyAddressRef = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(
    delinquentGridModel.queryModel.updateQueryCondition,
    500,
  );

  // const [state, getDelinquentRangeOpt] = useAsyncFn(async () => {
  //   return await _getDelinquentRangeOpt().then((res) => {
  //     if (res.data) {
  //       setOpts(
  //         DelinquentTimeRangeOpt.map((item) => ({
  //           ...item,
  //           label: (
  //             <Stack alignItems={'center'} direction={'row'} gap={0.5}>
  //               <Typography variant={'body2'}>{item.label}</Typography>
  //               <Typography
  //                 bgcolor={'#95A8D7'}
  //                 borderRadius={1}
  //                 color={'#fff'}
  //                 px={0.5}
  //                 variant={'subtitle3'}
  //               >
  //                 {res.data[item.value] || 0}
  //               </Typography>
  //             </Stack>
  //           ),
  //         })),
  //       );
  //     }
  //     return res;
  //   });
  // }, []);

  useEffect(() => {
    if (propertyAddressRef.current) {
      propertyAddressRef.current.value =
        delinquentGridModel.queryModel.searchCondition.keyword;
    }
    // getDelinquentRangeOpt();
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
      {delinquentGridModel.queryModel.sort.length > 0 && (
        <SortButton
          handleClear={(e) => {
            e.stopPropagation();
            delinquentGridModel.queryModel.updateSort([]);
          }}
          handleClick={() => {
            delinquentGridModel.queryModel.updateSort([
              {
                ...delinquentGridModel.queryModel.sort[0],
                direction:
                  delinquentGridModel.queryModel.sort[0].direction ===
                  SortDirection.DESC
                    ? SortDirection.ASC
                    : SortDirection.DESC,
              },
            ]);
          }}
          sortItems={delinquentGridModel.queryModel.sort[0]}
        />
      )}
      <GridMoreIconButton
        columns={
          transferOrderColumns(
            combineColumns(delinquentColumns, delinquentGridModel.orderColumns),
          ) as IOrderColumnsItem[]
        }
        gridType={PortfolioGridTypeEnum.DELINQUENT}
        handleSave={(columns) => {
          delinquentGridModel.updateOrderColumns(columns);
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
          Delinquent:
          <Typography variant={'body2'}>
            {
              DelinquentTimeRangeOpt.find(
                (item) =>
                  item.value ===
                  delinquentGridModel.queryModel.searchCondition.delinquentDays,
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
              delinquentGridModel.queryModel.searchCondition
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
            delinquentGridModel.queryModel.updateQueryCondition(
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
          value={delinquentGridModel.queryModel.searchCondition.delinquentDays}
        />
      </StyledButton>*/}
    </Stack>
  );
};
