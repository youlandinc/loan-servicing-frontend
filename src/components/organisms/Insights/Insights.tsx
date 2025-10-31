import React, { FC, useState } from 'react';

import Router from 'next/router';

import {
  Box,
  Icon,
  LinearProgress,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  useGridApiContext,
} from '@mui/x-data-grid';

import { observer } from 'mobx-react-lite';

import { PieTooltipProps, ResponsivePie } from '@nivo/pie';
import { PieCustomLayerProps } from '@nivo/pie/dist/types/types';
import { enqueueSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { rootStore, useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constant';
import { utils } from '@/utils';

import { StyledLayout } from '@/components/molecules';

import { _getAllGridConfig, setDisplayType } from '@/request';
import {
  _fetchInsightsData,
  InsightsEnum,
  InsightsResponseItemData,
} from '@/request/insights';
import { _getGroupDelinquent } from '@/request/portfolio/delinquen';
import { HttpError } from '@/types/common';
import { PortfolioGridTypeEnum } from '@/types/enum';

import ICON_PIE from './assets/icon_pie.svg';

const LegendProps = {
  translateX: 8,
  itemsSpacing: 24,
  itemWidth: 64,
  itemHeight: 24,
  itemTextColor: 'rgba(0,0,0,.87)',
  itemOpacity: 1,
  symbolSize: 12,
};

const SeriesColors = [
  'rgba(91, 118, 188, 1)',
  'rgba(255, 206, 158, 1)',
  'rgba(251, 149, 50, 1)',
  'rgba(229, 103, 49, 1)',
  'rgba(161, 0, 0, 1)',
  'rgba(115, 0, 0, 1)',
];

const MAP: {
  [key in InsightsEnum]: {
    label: string;
    color: string;
    index: number;
  };
} = {
  [InsightsEnum.current]: {
    label: 'Current',
    color: 'rgba(91, 118, 188, 1)',
    index: 0,
  },
  [InsightsEnum.dq_1_30]: {
    label: 'DQ 1-30',
    color: 'rgba(255, 206, 158, 1)',
    index: 1,
  },
  [InsightsEnum.dq_31_60]: {
    label: 'DQ 31-60',
    color: 'rgba(251, 149, 50, 1)',
    index: 2,
  },
  [InsightsEnum.dq_61_90]: {
    label: 'DQ 61-90',
    color: 'rgba(229, 103, 49, 1)',
    index: 3,
  },
  [InsightsEnum.dq_91_120]: {
    label: 'DQ 91-120',
    color: 'rgba(161, 0, 0, 1)',
    index: 4,
  },
  [InsightsEnum.dq_121_plus]: {
    label: 'DQ 121+',
    color: 'rgba(115, 0, 0, 1)',
    index: 5,
  },
};

type InsightsData = InsightsResponseItemData & {
  id: string;
  value: number;
  color: string;
  label: string;
};

export const Insights: FC = observer(() => {
  const store = useMst();
  const { loading } = useAsync(async () => {
    try {
      const { data } = await _fetchInsightsData();
      const { data: tableData } = await _getAllGridConfig();
      store.portfolio.injectConfig(tableData);
      const result = data.reduce((acc, cur) => {
        if (cur && cur.insightsStatus !== InsightsEnum.dq_1_30) {
          acc.push({
            ...cur,
            id: MAP[cur.insightsStatus].label,
            value: cur.numberOfDays,
            color: MAP[cur.insightsStatus].color,
            label: MAP[cur.insightsStatus].label,
          });
        }

        return acc;
      }, [] as InsightsData[]);

      setInsightsData(result);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  const [activeId, setActiveId] = useState<string | number>('');
  const [insightsData, setInsightsData] = useState<InsightsData[]>([]);

  return (
    <StyledLayout isHomepage={false}>
      <Stack
        alignSelf={'center'}
        gap={3}
        maxWidth={1480}
        overflow={'auto'}
        pt={6}
        px={{ xs: 6, lg: 0 }}
        width={'100%'}
      >
        <Stack gap={1.5}>
          <Typography variant={'h6'}>Insights</Typography>
          <Typography variant={'body2'}>
            View detailed insights and trends for the loans in your portfolio
          </Typography>
        </Stack>

        <Stack
          bgcolor={'white'}
          border={'1px solid #E4E7EF'}
          borderRadius={2}
          gap={3}
          p={3}
        >
          <Typography variant={'subtitle2'}>Loan delinquent</Typography>

          <Stack flexDirection={'row'} gap={12}>
            <Stack height={350} width={300}>
              {loading ? (
                <Stack height={'100%'} width={'100%'}>
                  <Icon
                    component={ICON_PIE}
                    sx={{
                      width: 252,
                      height: 252,
                      mx: 'auto',
                      mt: 2.45,
                    }}
                  />
                  <Skeleton sx={{ mt: 2.5 }} />
                  <Skeleton />
                </Stack>
              ) : (
                <ResponsivePie
                  activeId={activeId}
                  activeOuterRadiusOffset={12}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]],
                  }}
                  borderWidth={1}
                  colors={SeriesColors}
                  cornerRadius={3}
                  data={insightsData}
                  enableArcLabels={false}
                  enableArcLinkLabels={false}
                  innerRadius={0.7}
                  layers={[
                    'arcs',
                    'arcLabels',
                    'arcLinkLabels',
                    'legends',
                    CustomerPie(activeId),
                  ]}
                  legends={[
                    insightsData.length <= 3
                      ? {
                          ...LegendProps,
                          anchor: 'bottom',
                          direction: 'row',
                          itemDirection: 'left-to-right',
                          symbolShape: 'circle',
                          translateY: 40,
                          onClick: (data) => {
                            if (activeId === data.id) {
                              return setActiveId('');
                            }
                            setActiveId(data.id);
                          },
                          effects: [
                            {
                              on: 'hover',
                              style: {
                                itemTextColor: 'rgba(0,0,0,.34)',
                              },
                            },
                          ],
                        }
                      : {
                          ...LegendProps,
                          anchor: 'bottom',
                          direction: 'row',
                          itemDirection: 'left-to-right',
                          symbolShape: 'circle',
                          translateY: 40,
                          onClick: (data) => {
                            if (activeId === data.id) {
                              return setActiveId('');
                            }
                            setActiveId(data.id);
                          },

                          data: insightsData
                            .slice(0, Math.floor(insightsData.length / 2))
                            .map((cur, index) => ({
                              id: cur.id,
                              label: cur.id,
                              color: SeriesColors.slice(
                                0,
                                Math.floor(insightsData.length / 2),
                              )[index],
                            })),
                        },
                    {
                      ...LegendProps,
                      anchor: 'bottom',
                      direction: 'row',
                      itemDirection: 'left-to-right',
                      symbolShape: 'circle',
                      translateY: 64,
                      onClick: (data) => {
                        if (activeId === data.id) {
                          return setActiveId('');
                        }
                        setActiveId(data.id);
                      },
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: 'rgba(0,0,0,.34)',
                          },
                        },
                      ],
                      data: insightsData
                        .slice(Math.floor(insightsData.length / 2))
                        .map((cur, index) => ({
                          id: cur.id,
                          label: cur.id,
                          color: SeriesColors.slice(
                            Math.floor(insightsData.length / 2),
                          )[index],
                        })),
                    },
                  ]}
                  margin={{ top: 24, bottom: 72, left: 24, right: 24 }}
                  onClick={(data) => {
                    setActiveId(data.id);
                  }}
                  padAngle={1}
                  tooltip={(props) => CustomerTooltip(props)}
                />
              )}
            </Stack>

            <Stack
              alignSelf={'center'}
              height={300}
              width={'calc(100% - 396px)'}
            >
              <InsightsTable
                insightsTableData={insightsData}
                loading={loading}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </StyledLayout>
  );
});

const CustomerTooltip: FC<
  PieTooltipProps<{
    insightsStatus: string;
    numberOfDays: number;
    totalPercentage: number;
    upb: number;
    upbPercentage: number;
    id: string;
    value: number;
    color: string;
    label: string;
  }>
> = ({ datum }) => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#ffffff'}
      borderRadius={1}
      boxShadow={'0px 4px 8px rgba(0, 0, 0, 0.3)'}
      flexDirection={'row'}
      gap={1}
      px={1.5}
      py={1}
    >
      <Stack bgcolor={datum.color} borderRadius={1} height={16} width={16} />
      <Typography variant={'body1'}>{datum.label}:</Typography>
      <Typography fontWeight={500} variant={'body1'}>
        {datum.value}
      </Typography>
    </Stack>
  );
};

const CustomerPie =
  (activeId: string | number) =>
  (layerProps: PieCustomLayerProps<InsightsData>) => {
    const { centerX, centerY, dataWithArc } = layerProps;
    const activeData = dataWithArc.find((item) => item.data.id === activeId);

    return (
      <>
        <text
          dominantBaseline="central"
          style={{
            fontSize: '16px',
            fill: 'rgba(0,0,0,.87)',
          }}
          textAnchor="middle"
          x={centerX}
          y={centerY - 12}
        >
          {activeData?.id}
        </text>
        <text
          dominantBaseline="central"
          style={{
            fontSize: '24px',
            fontWeight: '600',
            fill: 'rgba(0,0,0,.87)',
          }}
          textAnchor="middle"
          x={centerX}
          y={centerY + 16}
        >
          {utils.formatPercentHundred(activeData?.data.totalPercentage)}
        </text>
      </>
    );
  };

const columns: GridColDef[] = [
  {
    field: 'insightsStatus',
    headerName: 'DQ status',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography
        onClick={async () => {
          const { queryModel } = rootStore.portfolio.delinquentGridModel;
          queryModel.updateQueryCondition('delinquentDays', value);
          await _getGroupDelinquent(queryModel);
          await setDisplayType(PortfolioGridTypeEnum.DELINQUENT);
          await Router.push('/portfolio');
        }}
        sx={{
          textDecoration: value !== InsightsEnum.current ? 'underline' : 'none',
          textUnderlineOffset: '2px',
          cursor: value !== InsightsEnum.current ? 'pointer' : 'default',
        }}
        variant={'body3'}
      >
        {MAP[value as InsightsEnum].label}
      </Typography>
    ),
  },
  {
    field: 'numberOfDays',
    headerName: 'Number of loans',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{value}</Typography>
    ),
  },
  {
    field: 'totalPercentage',
    headerName: 'Total percentage',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>
        {utils.formatPercentHundred(value)}
      </Typography>
    ),
  },
  {
    field: 'upb',
    headerName: 'Unpaid balance',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>{utils.formatDollar(value)}</Typography>
    ),
  },
  {
    field: 'upbPercentage',
    headerName: 'Percentage of unpaid balance',
    sortable: false,
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    minWidth: 150,
    renderCell: ({ value }) => (
      <Typography variant={'body3'}>
        {utils.formatPercentHundred(value)}
      </Typography>
    ),
  },
];

const TEMP = [
  {
    insightsStatus: InsightsEnum.current,
    numberOfDays: 322,
    totalPercentage: 22,
    upb: 322,
    upbPercentage: 22,
    color: 'rgba(91, 118, 188, 1)',
  },
];

function mulberry32(a: number): () => number {
  return () => {
    /* eslint-disable */
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    /* eslint-enable */
  };
}

function randomBetween(seed: number, min: number, max: number): () => number {
  const random = mulberry32(seed);
  return () => min + (max - min) * random();
}

const SkeletonCell = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: '1px solid #D2D6E1',
}));

function SkeletonLoadingOverlay() {
  const apiRef = useGridApiContext();

  const dimensions = apiRef.current?.getRootDimensions();
  const viewportHeight = dimensions?.viewportInnerSize.height ?? 0;

  const rowHeight = 40;
  const skeletonRowsCount = Math.ceil(viewportHeight / rowHeight);

  const totalWidth = gridColumnsTotalWidthSelector(apiRef);
  const positions = gridColumnPositionsSelector(apiRef);
  const inViewportCount = React.useMemo(
    () => positions.filter((value) => value <= totalWidth).length,
    [totalWidth, positions],
  );
  const columns = apiRef.current.getVisibleColumns().slice(0, inViewportCount);

  const children = React.useMemo(() => {
    // reseed random number generator to create stable lines betwen renders
    const random = randomBetween(12345, 25, 75);
    const array: React.ReactNode[] = [];

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      for (const column of columns) {
        const width = Math.round(random());
        array.push(
          <SkeletonCell
            key={`col-${column.field}-${i}`}
            sx={{ justifyContent: column.align }}
          >
            <Skeleton sx={{ mx: 1 }} width={`${width}%`} />
          </SkeletonCell>,
        );
      }
      array.push(<SkeletonCell key={`fill-${i}`} />);
    }
    return array;
  }, [skeletonRowsCount, columns]);

  const rowsCount = apiRef.current.getRowsCount();

  return rowsCount > 0 ? (
    <LinearProgress />
  ) : (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${columns
          .map(({ computedWidth }) => `${computedWidth}px`)
          .join(' ')} 1fr`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {children}
    </div>
  );
}

const InsightsTable: FC<{
  loading: boolean;
  insightsTableData?: InsightsData[];
}> = ({ loading, insightsTableData = TEMP }) => {
  const lastChildIndex = columns.length;

  return (
    <DataGrid
      columnHeaderHeight={40}
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      disableColumnSelector
      disableDensitySelector
      disableRowSelectionOnClick
      getRowId={(row) => row.insightsStatus}
      hideFooter
      loading={loading}
      pagination
      rows={insightsTableData}
      showCellVerticalBorder
      slots={{
        noRowsOverlay: () => (
          <Stack height={'100%'} pl={8} pt={4} width={'100%'}>
            <Typography color={'text.secondary'} mt={1.5} variant={'subtitle2'}>
              No outstanding payables
            </Typography>
          </Stack>
        ),
        loadingOverlay: SkeletonLoadingOverlay,
      }}
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'white',
        borderColor: '#D2D6E1',
        '.MuiDataGrid-columnHeader': {
          bgcolor: 'background.homepage',
        },
        '.MuiDataGrid-columnHeader:focus-within': {
          outline: 'none !important',
        },
        '.MuiDataGrid-columnHeaders': {
          borderBottom: 'none',
        },
        '.MuiDataGrid-columnSeparator': {
          visibility: 'visible',
        },
        '.MuiDataGrid-columnHeadersInner': {
          [`.MuiDataGrid-columnHeader:nth-of-type(${lastChildIndex}) > .MuiDataGrid-columnSeparator`]:
            {
              visibility: 'hidden',
            },
        },
        '.MuiDataGrid-cell': {
          '&:focus': {
            outline: 0,
          },
          '&:last-of-type': {
            borderRight: 'none',
          },
        },
        '.MuiDataGrid-row': {
          '.MuiDataGrid-row--lastVisible': {
            borderBottom: 'none',
          },
        },
      }}
    />
  );
};
