import { FC, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { ResponsivePie } from '@nivo/pie';
import { PieCustomLayerProps } from '@nivo/pie/dist/types/types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { utils } from '@/utils';
import Router from 'next/router';
import { enqueueSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { rootStore, useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constant';

import { StyledLayout } from '@/components/molecules';

import {
  _fetchInsightsData,
  InsightsEnum,
  InsightsResponseItemData,
} from '@/request/insights';
import { PortfolioGridTypeEnum } from '@/types/enum';

import { HttpError } from '@/types/common';
import { _getAllGridConfig, setDisplayType } from '@/request';
import { _getGroupDelinquent } from '@/request/portfolio/delinquen';

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
        if (cur) {
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
          <Typography variant={'subtitle2'}>Loan delinquency</Typography>

          <Stack flexDirection={'row'} gap={12}>
            <Stack height={350} width={300}>
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
              />
            </Stack>

            <Stack width={'calc(100% - 396px)'}>
              <InsightsTable insightsTableData={insightsData} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </StyledLayout>
  );
});

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

const InsightsTable: FC<{
  insightsTableData?: InsightsData[];
}> = ({ insightsTableData = TEMP }) => {
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
      hideFooter={true}
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
