import {
  StyledActionsMenu,
  StyledButton,
  StyledDelinquentSelect,
  StyledMaturitySelect,
} from '@/components/atoms';
import { Layout } from '@/components/molecules';

import { useDebounceFn } from '@/hooks';
import { useMst } from '@/models/Root';
import { _getAllGridConfig, _getAllStatus, setDisplayType } from '@/request';

import ListIcon from '@/svg/portfolio/all_loans_list.svg';
import InvestorIcon from '@/svg/portfolio/by_investor_list.svg';
import DelinquentIcon from '@/svg/portfolio/delinquent_list.svg';
import LOGO_ALAMEDA from '@/svg/portfolio/logo-alameda.svg';
import LOGO_CASH_FLOW from '@/svg/portfolio/logo-cash-flow.svg';
import LOGO_YOULAND from '@/svg/portfolio/logo-youland.svg';
import MaturityIcon from '@/svg/portfolio/maturity_list.svg';

import { PortfolioGridTypeEnum } from '@/types/enum';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Fade, Icon, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { enqueueSnackbar } from 'notistack';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import useSWR from 'swr';

const GridYouland = dynamic(
  () =>
    import('@/components/molecules/GridYouland').then(
      (mode) => mode.GridYouland,
    ),
  { ssr: false },
);

const GridYoulandToolbar = dynamic(
  () =>
    import('@/components/molecules/GridYouland').then(
      (mode) => mode.GridYoulandToolbar,
    ),
  { ssr: false },
);

const GridCashFlow = dynamic(
  () =>
    import('@/components/molecules/GridCashFlow').then(
      (mode) => mode.GridCashFlow,
    ),
  { ssr: false },
);
const GridCashFlowToolbar = dynamic(
  () =>
    import('@/components/molecules/GridCashFlow').then(
      (mode) => mode.GridCashFlowToolbar,
    ),
  { ssr: false },
);

const GridAlameda = dynamic(
  () =>
    import('@/components/molecules/GridAlameda').then(
      (mode) => mode.GridAlameda,
    ),
  { ssr: false },
);

const GridAlamedaToolbar = dynamic(
  () =>
    import('@/components/molecules/GridAlameda').then(
      (mode) => mode.GridAlamedaToolbar,
    ),
  { ssr: false },
);

const AllLoansGrid = dynamic(
  () =>
    import('@/components/molecules/GridAllLoans').then(
      (mode) => mode.AllLoansGrid,
    ),
  { ssr: false },
);
const AllLoansGridToolBar = dynamic(
  () =>
    import('@/components/molecules/GridAllLoans').then(
      (mode) => mode.AllLoansGridToolBar,
    ),
  { ssr: false },
);

const InvestorGrid = dynamic(
  () =>
    import('@/components/molecules/GridInvestor').then(
      (mode) => mode.InvestorGrid,
    ),
  { ssr: false },
);
const InvestorGridToolBar = dynamic(
  () =>
    import('@/components/molecules/GridInvestor').then(
      (mode) => mode.InvestorGridToolBar,
    ),
  { ssr: false },
);

const DelinquentGrid = dynamic(
  () =>
    import('@/components/molecules/GridDelinquent').then(
      (mode) => mode.DelinquentGrid,
    ),
  { ssr: false },
);
const DelinquentGridToolBar = dynamic(
  () =>
    import('@/components/molecules/GridDelinquent').then(
      (mode) => mode.DelinquentGridToolBar,
    ),
  { ssr: false },
);

const MaturityGrid = dynamic(
  () =>
    import('@/components/molecules/GridMaturity').then(
      (mode) => mode.MaturityGrid,
    ),
  { ssr: false },
);
const MaturityGridToolBar = dynamic(
  () =>
    import('@/components/molecules/GridMaturity').then(
      (mode) => mode.MaturityGridToolBar,
    ),
  { ssr: false },
);

export const Portfolio: FC = observer(() => {
  const {
    portfolio: {
      displayType: portfolioListType,
      updateDisplayType: setPortfolioListType,
      allLoansGridModel,
      injectConfig,
    },
  } = useMst();

  const [anchor, setAnchor] = useState<null | HTMLElement>();

  const [, , updateDisplayDebounce] = useDebounceFn(
    allLoansGridModel.queryModel.updateQueryCondition,
    500,
  );

  const [, updateMode] = useAsyncFn(
    async (displayMode: PortfolioGridTypeEnum) => {
      await setDisplayType(displayMode);
    },
  );

  const [, , set] = useDebounceFn(
    async (displayMode: PortfolioGridTypeEnum) => {
      await updateMode(displayMode);
    },
    500,
  );

  const { loading } = useAsync(async () => {
    return await _getAllGridConfig().then((res) => {
      if (res.data) {
        injectConfig(res.data);
      }
      return res;
    });
  }, []);

  useSWR(
    portfolioListType === PortfolioGridTypeEnum.ALL_LOANS ||
      portfolioListType === PortfolioGridTypeEnum.BY_INVESTOR ||
      portfolioListType === PortfolioGridTypeEnum.MATURITY
      ? '_getAllStatus'
      : null,
    async () => {
      return await _getAllStatus().catch(({ message, variant, header }) => {
        close();
        enqueueSnackbar(message ?? 'error!', {
          variant,
          isSimple: !header,
          header,
        });
      });
    },
  );

  const menus = useMemo(
    () => [
      {
        icon: LOGO_YOULAND,
        label: 'Youland',
        key: PortfolioGridTypeEnum.YOULAND,
        queryComponent: <GridYoulandToolbar />,
        component: <GridYouland />,
      },
      {
        icon: LOGO_CASH_FLOW,
        label: 'Cash flow',
        key: PortfolioGridTypeEnum.CASH_FLOW,
        queryComponent: <GridCashFlowToolbar />,
        component: <GridCashFlow />,
      },
      {
        icon: LOGO_ALAMEDA,
        label: 'Alameda',
        key: PortfolioGridTypeEnum.ALAMEDA,
        queryComponent: <GridAlamedaToolbar />,
        component: <GridAlameda />,
      },
      {
        icon: ListIcon,
        label: 'All loans',
        key: PortfolioGridTypeEnum.ALL_LOANS,
        queryComponent: <AllLoansGridToolBar />,
        component: <AllLoansGrid />,
      },
      {
        icon: InvestorIcon,
        label: 'By investor',
        key: PortfolioGridTypeEnum.BY_INVESTOR,
        queryComponent: <InvestorGridToolBar />,
        component: <InvestorGrid />,
      },
      {
        icon: DelinquentIcon,
        label:
          portfolioListType === PortfolioGridTypeEnum.DELINQUENT ? (
            <>
              Days delinquent <StyledDelinquentSelect />
            </>
          ) : (
            'Days delinquent'
          ),
        key: PortfolioGridTypeEnum.DELINQUENT,
        queryComponent: <DelinquentGridToolBar />,
        component: <DelinquentGrid />,
      },
      {
        icon: MaturityIcon,
        label:
          portfolioListType === PortfolioGridTypeEnum.MATURITY ? (
            <>
              Maturity <StyledMaturitySelect />
            </>
          ) : (
            'Maturity'
          ),
        queryComponent: <MaturityGridToolBar />,
        key: PortfolioGridTypeEnum.MATURITY,
        component: <MaturityGrid />,
      },
    ],
    [portfolioListType],
  );

  useEffect(() => {
    // getAllGridConfig();
  }, []);

  return (
    <Layout isHomepage={false}>
      {!loading && (
        <Fade in={!loading}>
          <Stack height={'100%'} pb={3} pt={3} px={6}>
            <Stack
              alignItems={'flex-start'}
              direction={'row'}
              justifyContent={'space-between'}
            >
              <Stack
                direction={'row'}
                display={{
                  xs: 'none',
                  xxl: 'flex',
                }}
              >
                {menus.map((item, index) => (
                  <StyledButton
                    component={'div'}
                    key={index}
                    onClick={() => {
                      if (item.key !== portfolioListType) {
                        setPortfolioListType(item.key);
                        set(item.key);
                      }
                    }}
                    size={'small'}
                    sx={{
                      backgroundColor:
                        item.key === portfolioListType
                          ? '#F4F6FA !important'
                          : 'transparent !important',
                      fontWeight: '400 !important',
                      border:
                        item.key === portfolioListType ? '1px solid' : 'none',
                      borderColor: 'border.normal',
                      borderRadius: '16px 16px 0px 0px !important',
                      borderBottom: 'none !important',
                      px: '24px !important',
                      py: '12px !important',
                    }}
                    variant={'text'}
                  >
                    <Stack alignItems={'center'} direction={'row'} gap={0.5}>
                      <Icon
                        component={item.icon}
                        sx={{
                          width: 20,
                          height: 20,
                          '& path': {
                            fill: '#636A7C',
                          },
                        }}
                      />
                      <Typography
                        color={'action.active'}
                        component={'div'}
                        variant={'body2'}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  </StyledButton>
                ))}
              </Stack>
              <StyledButton
                component={'div'}
                onClick={(e) => {
                  e.stopPropagation();
                  setAnchor(e.currentTarget);
                }}
                size={'small'}
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: '20px',
                  borderRadius: 2,
                  bgcolor: 'rgba(91, 118, 188, 0.10) !important',
                  '&:hover': {
                    bgcolor: 'rgba(91, 118, 188, 0.15) !important',
                  },
                  '& .MuiButton-endIcon': {
                    ml: 0.5,
                  },
                  px: 1.5,
                  py: '6px',
                  height: 'auto !important',
                  display: {
                    xs: 'flex',
                    xxl: 'none',
                  },
                  mb: '6px',
                }}
                variant={'text'}
              >
                <Stack alignItems={'center'} direction={'row'} gap={0.5}>
                  <Icon
                    component={
                      menus.find((item) => item.key === portfolioListType)
                        ?.icon || menus[0].icon
                    }
                    sx={{
                      width: 16,
                      height: 16,
                      '& path': {
                        fill: '#5B76BC',
                      },
                    }}
                  />
                  <Typography color={'primary'} variant={'body2'}>
                    {menus.find((item) => item.key === portfolioListType)
                      ?.label || menus[0].label}
                  </Typography>
                  {portfolioListType !== PortfolioGridTypeEnum.DELINQUENT &&
                    portfolioListType !== PortfolioGridTypeEnum.MATURITY && (
                      <Icon
                        component={KeyboardArrowDownIcon}
                        sx={{
                          width: 16,
                          height: 16,
                        }}
                      />
                    )}
                </Stack>
              </StyledButton>
              {menus.map((item, index) => (
                <Box hidden={item.key !== portfolioListType} key={index}>
                  {item.key === portfolioListType && item.queryComponent}
                </Box>
              ))}
            </Stack>
            <Box flex={1} mt={'-1px'}>
              {menus.map((item, index) => {
                return (
                  <Box
                    border={'1px solid'}
                    borderColor={'border.normal'}
                    borderRadius={4}
                    flex={1}
                    hidden={item.key !== portfolioListType}
                    key={index}
                    sx={{
                      borderTopLeftRadius: {
                        xs: 16,
                        xxl: index === 0 ? 0 : 16,
                      },
                      overflow: 'hidden',
                    }}
                  >
                    {item.component}
                  </Box>
                );
              })}
            </Box>
          </Stack>
        </Fade>
      )}
      <StyledActionsMenu
        anchorEl={anchor}
        menus={menus.map((item) => ({
          ...item,
          label:
            item.key === PortfolioGridTypeEnum.DELINQUENT ||
            item.key === PortfolioGridTypeEnum.MATURITY
              ? {
                  [PortfolioGridTypeEnum.DELINQUENT]: 'Days delinquent',
                  [PortfolioGridTypeEnum.MATURITY]: 'Maturity',
                }[item.key]
              : item.label,
          handleClick: () => {
            if (item.key !== portfolioListType) {
              setPortfolioListType(item.key);
              set(item.key);
            }
            setAnchor(null);
          },
          isSelected: item.key === portfolioListType,
        }))}
        onClose={() => setAnchor(null)}
        open={Boolean(anchor)}
        sx={{
          '& .Mui-selected': {
            color: '#5B76BC',
            bgcolor: 'rgba(54, 94, 198, 0.08)',
            'svg path': {
              fill: '#5B76BC',
            },
          },
        }}
      />
    </Layout>
  );
});
