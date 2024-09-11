import { Box, Icon, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';

import { StyledButton } from '@/components/atoms';
import { Layout } from '@/components/molecules';

import ListIcon from '@/svg/portfolio/all_loans_list.svg';
import InvestorIcon from '@/svg/portfolio/by_investor_list.svg';
import DeliquentIcon from '@/svg/portfolio/delinquent_list.svg';
import MaturityIcon from '@/svg/portfolio/maturity_list.svg';

import { PortfolioGridTypeEnum } from '@/types/enum';

const AllLoansGrid = dynamic(
  () =>
    import('@/components/molecules/AllLoansGrid').then(
      (mode) => mode.AllLoansGrid,
    ),
  { ssr: false },
);
const AllLoansGridToolBar = dynamic(
  () =>
    import('@/components/molecules/AllLoansGrid').then(
      (mode) => mode.AllLoansGridToolBar,
    ),
  { ssr: false },
);

const InvestorGrid = dynamic(
  () =>
    import('@/components/molecules/InvestorGrid').then(
      (mode) => mode.InvestorGrid,
    ),
  { ssr: false },
);
const InvestorGridToolBar = dynamic(
  () =>
    import('@/components/molecules/InvestorGrid').then(
      (mode) => mode.InvestorGridToolBar,
    ),
  { ssr: false },
);

export const Portfolio: FC = observer(() => {
  const [portfolioListType, setPortfolioListType] =
    useState<PortfolioGridTypeEnum>(PortfolioGridTypeEnum.ALL_LOANS);

  const menus = [
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
      icon: DeliquentIcon,
      label: 'Delinquent',
      key: PortfolioGridTypeEnum.DELINQUENT,
      component: 'Delinquent',
    },
    {
      icon: MaturityIcon,
      label: 'Maturity',
      key: PortfolioGridTypeEnum.MATURITY,
      component: 'Maturity',
    },
  ];

  return (
    <Layout isHomepage={false}>
      <Stack gap={1.5} height={'100%'} pb={3} pt={3} px={6}>
        <Stack
          alignItems={'center'}
          direction={'row'}
          justifyContent={'space-between'}
        >
          <Stack direction={'row'} gap={1}>
            {menus.map((item, index) => (
              <StyledButton
                key={index}
                onClick={() => setPortfolioListType(item.key)}
                size={'small'}
                sx={{
                  backgroundColor:
                    item.key === portfolioListType
                      ? 'rgba(91, 118, 188, 0.15) !important'
                      : 'transparent !important',
                  fontWeight: '400 !important',
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
                        fill:
                          item.key === portfolioListType
                            ? '#5B76BC'
                            : '#636A7C',
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      color:
                        item.key === portfolioListType ? '#5B76BC' : '#636A7C',
                    }}
                    variant={'body2'}
                  >
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
        <Box flex={1}>
          {menus.map((item, index) => {
            return (
              <Box flex={1} hidden={item.key !== portfolioListType} key={index}>
                {item.key === portfolioListType && item.component}
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Layout>
  );
});
