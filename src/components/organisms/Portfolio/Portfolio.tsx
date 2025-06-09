import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Fade, Icon, Stack, Tab, Tabs, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useAsync, useAsyncFn } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useDebounceFn } from '@/hooks';

import {
  StyledActionsMenu,
  StyledDelinquentSelect,
  StyledMaturitySelect,
} from '@/components/atoms';
import { StyledLayout } from '@/components/molecules';

import { PortfolioGridTypeEnum } from '@/types/enum';
import { _getAllGridConfig, setDisplayType } from '@/request';

import ListIcon from '@/svg/portfolio/all_loans_list.svg';
import InvestorIcon from '@/svg/portfolio/by_investor_list.svg';
import DelinquentIcon from '@/svg/portfolio/delinquent_list.svg';
import LOGO_ALAMEDA from '@/svg/portfolio/logo-alameda.svg';
//import LOGO_CASH_FLOW from '@/svg/portfolio/logo-cash-flow.svg';
import LOGO_YOULAND from '@/svg/portfolio/logo-youland.svg';
import MaturityIcon from '@/svg/portfolio/maturity_list.svg';

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

//const GridCashFlow = dynamic(
//  () =>
//    import('@/components/molecules/GridCashFlow').then(
//      (mode) => mode.GridCashFlow,
//    ),
//  { ssr: false },
//);
//const GridCashFlowToolbar = dynamic(
//  () =>
//    import('@/components/molecules/GridCashFlow').then(
//      (mode) => mode.GridCashFlowToolbar,
//    ),
//  { ssr: false },
//);

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

  const toolbarRef = useRef(null);

  const [anchor, setAnchor] = useState<null | HTMLElement>();

  const [tabMaxWidth, setTabMaxWidth] = useState<string>('calc(100% - 940px)');

  useDebounceFn(allLoansGridModel.queryModel.updateQueryCondition, 500);

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

  const menus = useMemo(
    () => [
      //{
      //  icon: LOGO_CASH_FLOW,
      //  label: 'Cash flow',
      //  key: PortfolioGridTypeEnum.CASH_FLOW,
      //  queryComponent: <GridCashFlowToolbar />,
      //  component: <GridCashFlow />,
      //},
      {
        icon: LOGO_YOULAND,
        label: 'Youland',
        key: PortfolioGridTypeEnum.YOULAND,
        queryComponent: <GridYoulandToolbar />,
        component: <GridYouland />,
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
              Delinquent <StyledDelinquentSelect />
            </>
          ) : (
            'Delinquent'
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

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current !== null) {
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class'
          ) {
            const opacity = window.getComputedStyle(
              (ref.current as any).children?.[0],
            ).opacity;
            if (opacity === '0') {
              (ref.current as any).style.marginLeft = '-40px';
            } else {
              (ref.current as any).style.marginLeft = '0px';
            }
          }
        });
      });
      observer.observe((ref.current as any).children?.[0], {
        attributes: true,
        attributeFilter: ['class'],
      });
      const opacity = window.getComputedStyle(
        (ref.current as any).children?.[0],
      ).opacity;
      if (opacity === '0') {
        (ref.current as any).style.marginLeft = '-40px';
      }

      if (toolbarRef.current !== null) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setTabMaxWidth(`calc(100% - ${entry.contentRect.width}px)`);
          }
        });
        resizeObserver.observe(toolbarRef.current);
      }
    }
  }, [loading]);

  return (
    <StyledLayout isHomepage={false}>
      {!loading && (
        <Fade in={!loading}>
          <Stack gap={1.5} height={'100%'} pb={3} pt={3} px={6}>
            <Stack
              alignItems={'center'}
              direction={'row'}
              justifyContent={'space-between'}
              position={'relative'}
            >
              <Box maxWidth={tabMaxWidth}>
                <Tabs
                  ref={ref}
                  scrollButtons
                  selectionFollowsFocus
                  sx={{
                    minHeight: 44,
                    '& .MuiTabs-flexContainer': {
                      px: 1.5,
                    },
                  }}
                  TabIndicatorProps={{
                    sx: {
                      display: 'none',
                    },
                  }}
                  value={portfolioListType}
                  variant="scrollable"
                >
                  {menus.map((item, index) => (
                    <Tab
                      component={'div'}
                      key={index}
                      label={
                        <Stack
                          alignItems={'center'}
                          direction={'row'}
                          gap={0.5}
                        >
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
                            alignItems={'center'}
                            color={'action.active'}
                            component={'div'}
                            display={'flex'}
                            gap={0.5}
                            variant={'body2'}
                          >
                            {item.label}
                          </Typography>
                        </Stack>
                      }
                      onClick={() => {
                        if (item.key !== portfolioListType) {
                          setPortfolioListType(item.key);
                          set(item.key);
                        }
                      }}
                      sx={{
                        flexDirection: 'row',
                        backgroundColor:
                          item.key === portfolioListType
                            ? '#F4F6FA !important'
                            : 'transparent !important',
                        fontWeight: '400 !important',
                        border:
                          item.key === portfolioListType ? '1px solid' : 'none',
                        borderColor: 'border.normal',
                        // borderRadius: '16px 16px 0px 0px !important',
                        borderRadius: '8px',
                        // borderBottom: 'none !important',
                        px: '12px !important',
                        py: '6px !important',
                        flexShrink: 0,
                        textTransform: 'none',
                        fontSize: 14,
                        minHeight: 44,
                        alignItems: 'center',
                      }}
                      value={item.key}
                    />
                  ))}
                </Tabs>
              </Box>
              <Stack
                flexDirection={'row'}
                position={'absolute'}
                ref={toolbarRef}
                right={0}
              >
                {menus.map((item, index) => (
                  <Box hidden={item.key !== portfolioListType} key={index}>
                    {item.key === portfolioListType && item.queryComponent}
                  </Box>
                ))}
              </Stack>
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
                      /*  borderTopLeftRadius: {
                        xs: index === 0 ? 0 : 16,
                        // xxl: index === 0 ? 0 : 16,
                      },*/
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
                  [PortfolioGridTypeEnum.DELINQUENT]: 'Delinquent',
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
    </StyledLayout>
  );
});
