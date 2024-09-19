import {
  ColumnsOrderDialog,
  StyledButton,
  StyledDelinquentSelect,
  StyledMaturitySelect,
} from '@/components/atoms';
import {
  commonColumns,
  Layout,
  transferOrderColumns,
} from '@/components/molecules';
import { useMst } from '@/models/Root';

import ListIcon from '@/svg/portfolio/all_loans_list.svg';
import InvestorIcon from '@/svg/portfolio/by_investor_list.svg';
import DelinquentIcon from '@/svg/portfolio/delinquent_list.svg';
import MaturityIcon from '@/svg/portfolio/maturity_list.svg';

import { PortfolioGridTypeEnum } from '@/types/enum';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import React, { FC, useMemo } from 'react';

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
      delinquentGridQueryModel,
      maturityGridQueryModel,
    },
  } = useMst();

  const menus = useMemo(
    () => [
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
              Delinquent: <StyledDelinquentSelect />
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
              Maturity: <StyledMaturitySelect />
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

  return (
    <Layout isHomepage={false}>
      <Stack height={'100%'} pb={3} pt={3} px={6}>
        <Stack
          alignItems={'center'}
          direction={'row'}
          justifyContent={'space-between'}
        >
          <Stack direction={'row'}>
            {menus.map((item, index) => (
              <StyledButton
                component={'div'}
                key={index}
                onClick={() => setPortfolioListType(item.key)}
                size={'small'}
                sx={{
                  backgroundColor:
                    item.key === portfolioListType
                      ? '#F4F6FA !important'
                      : 'transparent !important',
                  fontWeight: '400 !important',
                  border: item.key === portfolioListType ? '1px solid' : 'none',
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
                      width: 16,
                      height: 16,
                      '& path': {
                        fill: '#636A7C',
                      },
                    }}
                  />
                  <Typography color={'action.active'} variant={'body2'}>
                    {item.label}
                  </Typography>
                </Stack>
              </StyledButton>
            ))}
          </Stack>
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
                  borderTopLeftRadius: index === 0 ? 0 : 16,
                  overflow: 'hidden',
                }}
              >
                {item.component}
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Layout>
  );
});
