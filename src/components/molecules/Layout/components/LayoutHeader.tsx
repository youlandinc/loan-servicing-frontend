import { FC, ReactNode, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Icon,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import LOGO_PRODUCT_BOX from '@/svg/layout/logo_product_box.svg';
import LOGO_PRODUCT_HOME from '@/svg/layout/logo_product_home.svg';
import LOGO_PRODUCT_POS from '@/svg/layout/logo_product_pos.svg';
import LOGO_PRODUCT_LOS from '@/svg/layout/logo_product_los.svg';
import LOGO_PRODUCT_DOC from '@/svg/layout/logo_product_doc.svg';
import LOGO_PRODUCT_PRICE from '@/svg/layout/logo_product_price.svg';
import LOGO_PRODUCT_SERVING from '@/svg/layout/logo_product_serving.svg';

//import LOGO_HEADER_POS from '@/svg/layout/logo_header_pos.svg';
//import LOGO_HEADER_LOS from '@/svg/layout/logo_header_los.svg';
//import LOGO_HEADER_DOC from '@/svg/layout/logo_header_doc.svg';
//import LOGO_HEADER_PRICE from '@/svg/layout/logo_header_price.svg';
import LOGO_HEADER_SERVING from '@/svg/layout/logo_header_serving.svg';
import LOGO_HEADER_SETTING from '@/svg/layout/logo_header_setting.svg';

import LOGO_SETTING from '@/svg/layout/logo_auth_setting.svg';
import LOGO_SIGN_OUT from '@/svg/layout/logo_auth_out.svg';

import { useRouter } from 'next/router';
import { LAYOUT_HEADER_TAB } from '@/constant';
import { observer } from 'mobx-react-lite';
import { StyledButton, StyledDialog } from '@/components/atoms';
import { useSwitch } from '@/hooks';

export interface LayoutHeaderProps {
  isHomepage: boolean;
  actions?: ReactNode;
}

export const LayoutHeader: FC<LayoutHeaderProps> = observer(
  ({ isHomepage = false, actions }) => {
    const router = useRouter();

    const { visible, open, close } = useSwitch(false);

    const [anchorElProduct, setAnchorElProduct] = useState<null | HTMLElement>(
      null,
    );
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const productList = useMemo(() => {
      const productsData: Record<string, any> = {
        'Point of Sale': {
          label: 'Point of Sale',
          //url: '/pos/customers',
          icon: (
            <Icon component={LOGO_PRODUCT_POS} sx={{ width: 32, height: 32 }} />
          ),
        },
        'Loan Origination System': {
          label: 'Loan Origination System',
          //url: `${productsList()[0].link}/${session?.accessToken}`,
          icon: (
            <Icon component={LOGO_PRODUCT_LOS} sx={{ width: 32, height: 32 }} />
          ),
        },
        'Pricing Engine': {
          label: 'Pricing Engine',
          //url: `${productsList()[4].link}?token=${session?.accessToken}`,
          icon: (
            <Icon
              component={LOGO_PRODUCT_PRICE}
              sx={{ width: 32, height: 32 }}
            />
          ),
        },
        'Document Engine': {
          label: 'Document Engine',
          //url: `${productsList()[1].link}?token=${session?.accessToken}`,
          icon: (
            <Icon component={LOGO_PRODUCT_DOC} sx={{ width: 32, height: 32 }} />
          ),
        },
        'Loan Serving': {
          label: 'Loan Serving',
          //url: `${productsList()[4].link}?token=${session?.accessToken}`,
          icon: (
            <Icon
              component={LOGO_PRODUCT_SERVING}
              sx={{ width: 32, height: 32 }}
            />
          ),
        },
      };

      const result = Object.values(productsData);
      //const productsKeys = Object.keys(productsData);
      //return products.map(
      //  (item) => productsKeys.includes(item.name) && productsData[item.name],
      //);
      return result;
    }, []);

    return (
      <>
        <Stack
          alignItems={'center'}
          bgcolor={'background.white'}
          border={'1px solid'}
          borderColor={'border.normal'}
          flexDirection={'row'}
          height={{ xl: '88px', xs: '60px' }}
          justifyContent={'space-between'}
          px={6}
          sx={{
            transition: 'all .3s',
            position: 'sticky',
            top: 0,
            boxShadow: 'none',
            zIndex: 999,
          }}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={6}
            height={'100%'}
          >
            <Icon
              component={LOGO_PRODUCT_BOX}
              onClick={(e: any) => {
                setAnchorElProduct(anchorElProduct ? null : e.currentTarget);
                setAnchorElUser(null);
              }}
              sx={{
                width: { xl: 40, xs: 32 },
                height: { xl: 40, xs: 32 },
                cursor: 'pointer',
                transition: 'all .3s',
              }}
            />

            {/*according to different product replace counterpart icon*/}
            <Icon
              component={isHomepage ? LOGO_HEADER_SETTING : LOGO_HEADER_SERVING}
              sx={{ height: '32px', width: 'auto' }}
            />

            {!isHomepage && (
              <Stack
                alignItems={'center'}
                component={'ul'}
                flexDirection={'row'}
                gap={6}
                height={'100%'}
              >
                {LAYOUT_HEADER_TAB.map((item, index) => (
                  <Stack
                    className={router.pathname === item.url ? 'active' : ''}
                    color={'text.primary'}
                    component={'li'}
                    fontSize={{ xl: 16, xs: 14 }}
                    fontWeight={600}
                    height={'100%'}
                    justifyContent={'center'}
                    key={`${item.label}_${index}`}
                    onClick={() => router.push(item.url)}
                    position={'relative'}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' },
                      '&.active': {
                        color: 'primary.darker',
                        '&::after': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '4px',
                          bgcolor: 'primary.darker',
                          borderRadius: 3,
                        },
                      },
                    }}
                  >
                    {item.label}
                  </Stack>
                ))}
                {actions}
              </Stack>
            )}
          </Stack>
          <Stack alignItems={'center'} flexDirection={'row'} height={'100%'}>
            {router.pathname !== '/' && (
              <Tooltip
                PopperProps={{
                  sx: { zIndex: '99999 !important', maxWidth: 144 },
                }}
                title={'Organization settings'}
              >
                <Box height={24} width={24}>
                  <Icon
                    component={LOGO_SETTING}
                    sx={{
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Tooltip>
            )}
            <Stack
              alignItems={'center'}
              flexBasis={192}
              flexDirection={'row'}
              fontSize={14}
              gap={1.5}
              height={'100%'}
              onClick={(e) => {
                setAnchorElUser(anchorElUser ? null : e.currentTarget);
                setAnchorElProduct(null);
              }}
              px={3}
              sx={{ cursor: 'pointer' }}
            >
              <Avatar
                sx={{
                  bgcolor: 'info.main',
                  width: { lg: 36, xs: 30 },
                  height: { lg: 36, xs: 30 },
                  fontSize: { lg: 20, xs: 18 },
                  fontWeight: 600,
                }}
              >
                X
              </Avatar>

              <Tooltip
                PopperProps={{
                  sx: { zIndex: '99999 !important', maxWidth: 144 },
                  [`${anchorElUser && 'open'}`]: !anchorElUser,
                }}
                title={'akjshdgajshgdhjasgdjhagsdjhagsdjhgasjdhghajds'}
              >
                <Stack width={144}>
                  <Typography
                    color={'text.primary'}
                    fontSize={{ xl: 14, xs: 12 }}
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    variant={'subtitle1'}
                  >
                    akjshdgajshgdhjasgdjhagsdjhagsdjhgasjdhghajds
                  </Typography>
                  <Typography color={'info.main'} variant={'body3'}>
                    Admin
                  </Typography>
                </Stack>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>

        {/*product box*/}
        <Popover
          anchorEl={anchorElProduct}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          anchorReference={'anchorEl'}
          id={'LAYOUT_HEADER_PRODUCT_POPOVER'}
          onClose={() => setAnchorElProduct(null)}
          open={Boolean(anchorElProduct)}
          PaperProps={{
            sx: {
              px: 3,
              pt: 3,
              pb: 6,
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'border.normal',
              borderRadius: 4,
              mt: { xl: 5.25, xs: 5 },
            },
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Stack
            alignItems={'center'}
            direction={'row'}
            justifyContent={'space-between'}
            mb={3}
          >
            <Typography variant={'h7'}>Switch to</Typography>
            <Icon
              component={LOGO_PRODUCT_HOME}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  path: {
                    stroke: '#5C7CD0',
                  },
                },
              }}
            />
          </Stack>
          <Stack gap={3}>
            {productList.map((item, index) => (
              <Stack
                alignItems={'center'}
                alignSelf={'stretch'}
                border={'2px solid'}
                borderColor={'border.hover'}
                borderRadius={2}
                flexDirection={'row'}
                gap={1.5}
                key={`${item.label}_${index}`}
                //onClick={() => router.push(item.url)}
                p={1.5}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    borderColor: 'primary.contrastBackground',
                  },
                }}
                width={352}
              >
                {item.icon}
                <Typography variant={'subtitle1'}>{item.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Popover>

        {/*user setting*/}
        <Popover
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          anchorReference={'anchorEl'}
          id={'LAYOUT_HEADER_USER_POPOVER'}
          onClose={() => setAnchorElUser(null)}
          open={Boolean(anchorElUser)}
          PaperProps={{
            sx: {
              boxShadow:
                '0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
              ml: 3.5,
              mt: { xl: 1.5, xs: 3 },
              borderRadius: 2,
            },
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1.25}
            px={0.5}
            py={1.75}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                path: {
                  fill: '#5B76BC',
                },
                color: 'primary.main',
                bgcolor: 'primary.lighter',
              },
            }}
            width={180}
          >
            <Icon
              component={LOGO_SIGN_OUT}
              sx={{ height: 24, width: 24, ml: 1.25 }}
            />
            <Typography color={'inherit'} onClick={open} variant={'body2'}>
              Sign out
            </Typography>
          </Stack>
        </Popover>

        <StyledDialog
          content={
            <Typography color={'info.main'} py={3}>
              Sign out of current account?
            </Typography>
          }
          disableEscapeKeyDown={true}
          footer={
            <Stack flexDirection={'row'} gap={1.5}>
              <StyledButton
                color={'info'}
                onClick={close}
                size={'small'}
                variant={'outlined'}
              >
                Cancel
              </StyledButton>
              <StyledButton
                onClick={() => {
                  close();
                }}
                size={'small'}
              >
                Confirm
              </StyledButton>
            </Stack>
          }
          header={'Sign out'}
          onClose={close}
          open={visible}
        />
      </>
    );
  },
);
