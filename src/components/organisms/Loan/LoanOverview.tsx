import { FC, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  Drawer,
  Fade,
  Icon,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { uniqueId } from 'lodash';
import {
  bindHover,
  bindPopper,
  usePopupState,
} from 'material-ui-popup-state/hooks';

import { useBreakpoints, useSwitch } from '@/hooks';
import { utils } from '@/utils';
import {
  AUTO_HIDE_DURATION,
  LOAN_PRODUCT_CATEGORY,
  LOAN_PURPOSE,
} from '@/constant';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { StyledButton, StyledHeaderAddressInfo } from '@/components/atoms';
import {
  Layout,
  LoanOverviewCard,
  LoanOverviewCardProps,
  LoanOverviewComment,
  LoanOverviewPayablesGrid,
  LoanOverviewPayablesGridProps,
  LoanOverviewPaymentsGrid,
  LoanOverviewPaymentsGridProps,
  LoanOverviewTimeline,
  LoanOverviewTimelineProps,
  SideMenu,
} from '@/components/molecules';

import {
  CommentTypeEnum,
  LoanProductCategoryEnum,
  LoanPurposeEnum,
} from '@/types/overview';
import { PipelineStatusEnum } from '@/types/enum';
import { HttpError } from '@/types/common';
import {
  _fetchOverviewComments,
  _fetchOverviewDetails,
} from '@/request/loan/overview';

import OVERVIEW_CURRENT_BALANCE from '@/svg/loan/overview/overview-current-balance.svg';
import OVERVIEW_LOAN_INFORMATION from '@/svg/loan/overview/overview-loan-information.svg';
import OVERVIEW_BORROWER_INFORMATION from '@/svg/loan/overview/overview-borrower-information.svg';
import OVERVIEW_BROKER_INFORMATION from '@/svg/loan/overview/overview-broker-information.svg';
import OVERVIEW_NEXT_DUE_DATE from '@/svg/loan/overview/overview-next-due-date.svg';
import OVERVIEW_MATURITY_DATE from '@/svg/loan/overview/overview-maturity-date.svg';

import OVERVIEW_COMMENTS_VIEW from '@/svg/loan/overview/overview-comments-view.svg';
import OVERVIEW_COMMENTS_TOUCH_POINT from '@/svg/loan/overview/overview-comments-touch-point.svg';
import OVERVIEW_COMMENTS_NO_RESULT from '@/svg/loan/overview/overview-comments-no-result.svg';
import OVERVIEW_COMMENTS_ADD from '@/svg/loan/overview/overview-comments-add.svg';
import OVERVIEW_COMMENTS_DELETE from '@/svg/loan/overview/overview-comments-delete.svg';

const INITIAL: LoanOverviewCardProps = {
  header: '',
  theme: 'light',
  headerValue: '',
  headerIcon: OVERVIEW_CURRENT_BALANCE,
  listData: [],
};

const ACTION_BUTTONS = [
  {
    icon: OVERVIEW_COMMENTS_VIEW,
    label: 'Comments',
    type: CommentTypeEnum.text,
  },
  //{
  //  icon: OVERVIEW_COMMENTS_TOUCH_POINT,
  //  label: 'Touch point',
  //},
];

const loanListData: (loanInfo: any) => Array<any> = (loanInfo) => {
  let result: Array<any> = [];
  switch (loanInfo.productCategory) {
    case LoanProductCategoryEnum.stabilized_bridge: {
      result =
        loanInfo.loanPurpose === LoanPurposeEnum.purchase
          ? [
              {
                label: 'Loan purpose',
                value: utils.findLabel(LOAN_PURPOSE, loanInfo.loanPurpose),
              },
              {
                label: 'Loan to value',
                value: `${loanInfo.loanToValue}%`,
              },
            ]
          : [
              {
                label: 'Loan purpose',
                value: utils.findLabel(LOAN_PURPOSE, loanInfo.loanPurpose),
              },
              {
                label: 'Cash-out amount',
                value: utils.formatDollar(loanInfo.cashOutAmount),
              },
              {
                label: 'Loan to value',
                value: `${loanInfo.loanValue}%`,
              },
            ];
      break;
    }
    case LoanProductCategoryEnum.fix_and_flip: {
      result =
        loanInfo.loanPurpose === LoanPurposeEnum.purchase
          ? [
              {
                label: 'Loan purpose',
                value: utils.findLabel(LOAN_PURPOSE, loanInfo.loanPurpose),
              },
              {
                label: 'Rehab cost',
                value: utils.formatDollar(loanInfo.rehabAmount),
              },
              {
                label: 'Loan to value',
                value: `${loanInfo.loanValue}%`,
              },
              {
                label: 'Loan to cost',
                value: `${loanInfo.loanCost}%`,
              },
            ]
          : [
              {
                label: 'Loan purpose',
                value: utils.findLabel(LOAN_PURPOSE, loanInfo.loanPurpose),
              },
              {
                label: 'Rehab cost',
                value: utils.formatDollar(loanInfo.rehabAmount),
              },
              {
                label: 'Cash-out amount',
                value: utils.formatDollar(loanInfo.cashOutAmount),
              },
              {
                label: 'Loan to value',
                value: `${loanInfo.loanValue}%`,
              },
              {
                label: 'Loan to cost',
                value: `${loanInfo.loanCost}%`,
              },
            ];
      break;
    }
  }
  return result;
};

export const LoanOverview: FC = observer(() => {
  const {
    userSetting: { setting },
  } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const { open, visible, close } = useSwitch(false);
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const popupState = usePopupState({
    variant: 'popper',
    popupId: 'comments-popover',
  });

  const { loading } = useAsync(async () => {
    const { loanId } = utils.getParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const { data } = await _fetchOverviewDetails(loanId);
      setHeaderAddressInfo({
        address: data.propertyFullAddress,
        loanNumber: data.loanNumber,
        status: data.repaymentStatus as string as PipelineStatusEnum,
      });

      const { balanceInformation: balanceInfo } = data;
      setCurrenBalance({
        theme: 'dark',
        header: 'Current balance',
        headerValue: utils.formatDollar(balanceInfo.currentBalance),
        headerIcon: OVERVIEW_CURRENT_BALANCE,
        listData: [
          {
            label: 'Original balance',
            value: utils.formatDollar(balanceInfo.principalBalance),
          },
          {
            label: 'Note rate',
            value: `${balanceInfo.interestRate ?? ''}%`,
          },
          {
            label: 'Term',
            value: `${balanceInfo.loanTerm ?? ''} months`,
          },
          {
            label: 'Monthly payment',
            value: utils.formatDollar(balanceInfo.monthlyPayment),
          },
        ],
      });
      const { loanInfo } = data;

      setLoanInfo({
        theme: 'light',
        header: 'Loan information',
        headerValue: utils.findLabel(
          LOAN_PRODUCT_CATEGORY,
          loanInfo.productCategory,
        ),
        headerIcon: OVERVIEW_LOAN_INFORMATION,
        listData: loanListData(loanInfo),
        tailData: [
          {
            label: 'Investor',
            value: loanInfo.investor,
          },
        ],
      });
      const { borrowerInfo } = data;
      setBorrowerInfo({
        theme: 'light',
        header: 'Borrower information',
        headerValue: borrowerInfo.borrowerName,
        headerIcon: OVERVIEW_BORROWER_INFORMATION,
        listData: [
          {
            label: `Phone: ${
              borrowerInfo.borrowerPhone
                ? utils.formatUSPhoneToText(borrowerInfo.borrowerPhone)
                : '-'
            }`,
            value: '',
          },
          {
            label: `Email: ${borrowerInfo.borrowerEmail ?? '-'}`,
            value: '',
          },
        ],
      });

      const { brokerDetail } = data;
      brokerDetail &&
        setBrokerInfo({
          theme: 'light',
          header: 'Broker information',
          headerValue: brokerDetail?.name,
          headerIcon: OVERVIEW_BROKER_INFORMATION,
          listData: [
            {
              label: `Phone: ${
                brokerDetail?.phone
                  ? utils.formatUSPhoneToText(brokerDetail?.phone)
                  : '-'
              }`,
              value: '',
            },
            {
              label: `Email: ${brokerDetail?.email ?? '-'}`,
              value: '',
            },
          ],
        });

      setNextDueDate({
        theme: 'light',
        header: 'Next due date',
        headerValue: utils.formatDate(balanceInfo.nextDueDate),
        headerIcon: OVERVIEW_NEXT_DUE_DATE,
        listData: [
          {
            label: `Paid to ${utils.formatDate(balanceInfo.paidToDate)}`,
            value: '',
          },
        ],
      });
      setMaturityDate({
        theme:
          data.repaymentStatus === PipelineStatusEnum.FORECLOSURE
            ? 'warning'
            : 'light',
        header: 'Maturity date',
        headerValue: utils.formatDate(balanceInfo.fciMaturityDate),
        headerIcon: OVERVIEW_MATURITY_DATE,
        listData: [
          {
            label: (
              <Typography
                color={'text.secondary'}
                component={'span'}
                onClick={() =>
                  router.push({
                    pathname: '/loan/extension',
                    query: { loanId },
                  })
                }
                sx={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                variant={'body2'}
              >
                Check the extension
              </Typography>
            ),
            value: '',
          },
        ],
      });

      const { outstandingPayAbles } = data;
      const reducedOutstandingPayAbles = outstandingPayAbles.map((item) => ({
        ...item,
        id: uniqueId(),
      }));
      setOutstandingPayAbles(reducedOutstandingPayAbles);

      const { paymentHistory } = data;
      const reducedPaymentHistory = paymentHistory.histories.map((item) => ({
        ...item,
        id: uniqueId(),
      }));
      setLoanPayments({ ...paymentHistory, histories: reducedPaymentHistory });

      const { repaymentTimeLine } = data;
      setTimeline(repaymentTimeLine || []);

      await fetchComments();
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

  const fetchComments = async (cb?: () => void) => {
    const {
      data: { content },
    } = await _fetchOverviewComments(
      utils.getParamsFromUrl(location.href).loanId,
    );
    setContent(content || []);
    cb?.();
  };

  const leftRef = useRef<HTMLDivElement>(null);

  const [headerAddressInfo, setHeaderAddressInfo] = useState({
    address: '',
    loanNumber: '',
    status: PipelineStatusEnum.PERFORMING,
  });
  const [currentBalance, setCurrenBalance] =
    useState<LoanOverviewCardProps>(INITIAL);
  const [loanInfo, setLoanInfo] = useState<LoanOverviewCardProps>(INITIAL);
  const [borrowerInfo, setBorrowerInfo] =
    useState<LoanOverviewCardProps>(INITIAL);
  const [brokerInfo, setBrokerInfo] = useState<LoanOverviewCardProps | null>(
    null,
  );
  const [maturityDate, setMaturityDate] =
    useState<LoanOverviewCardProps>(INITIAL);
  const [nextDueDate, setNextDueDate] =
    useState<LoanOverviewCardProps>(INITIAL);
  const [loanPayAbles, setOutstandingPayAbles] =
    useState<LoanOverviewPayablesGridProps['outstandingPayAbles']>();
  const [loanPayments, setLoanPayments] =
    useState<LoanOverviewPaymentsGridProps>();
  const [timeline, setTimeline] = useState<
    LoanOverviewTimelineProps['listData'] | undefined
  >();

  const [content, setContent] = useState<any[]>([]);

  const onClickAddNote = (type: CommentTypeEnum) => {
    const data = {
      id: uniqueId(),
      loanId: utils.getParamsFromUrl(location.href).loanId,
      messageType: type,
      note: '',
      firstName: setting?.userInfo?.firstName,
      lastName: setting?.userInfo?.lastName,
      avatar: setting?.userInfo?.avatar,
      backgroundColor: setting?.userInfo?.backgroundColor,
      createdAt: new Date(),
      isFake: true,
    };

    setContent((prev) => [data, ...prev]);
    popupState.close();
  };

  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      {loading ? (
        <Stack
          alignItems={'center'}
          height={'100%'}
          justifyContent={'center'}
          width={'100%'}
        >
          <CircularProgress sx={{ color: '#E3E3EE' }} />
        </Stack>
      ) : (
        <Fade in={!loading}>
          <Stack gap={3} height={'100%'} pt={6} width={'100%'}>
            <Stack
              alignItems={'flex-end'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              px={6}
              width={'100%'}
            >
              <StyledHeaderAddressInfo {...headerAddressInfo} />
              {!['xxl'].includes(breakpoints) && (
                <Stack
                  alignItems={'center'}
                  flexDirection={'row'}
                  gap={0.5}
                  onClick={open}
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    component={OVERVIEW_COMMENTS_VIEW}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant={'body2'}>View comments</Typography>
                </Stack>
              )}
            </Stack>

            <Stack
              flexDirection={'row'}
              gap={3}
              height={'calc(100% - 54px)'}
              overflow={'auto'}
              px={6}
            >
              <Stack
                gap={3}
                height={'100%'}
                ref={leftRef}
                width={{ xs: 320, xl: 400 }}
              >
                <LoanOverviewCard {...currentBalance} />
                <LoanOverviewCard {...loanInfo} />
                <LoanOverviewCard {...borrowerInfo} />
                {brokerInfo && <LoanOverviewCard {...brokerInfo} />}
                <Stack height={24} width={'100%'}>
                  &nbsp;
                </Stack>
              </Stack>

              <Stack flex={1} flexShrink={0} gap={3} minWidth={682}>
                <Stack flexDirection={'row'} gap={3} width={'100%'}>
                  <LoanOverviewCard {...nextDueDate} />
                  <LoanOverviewCard {...maturityDate} />
                </Stack>

                <LoanOverviewTimeline listData={timeline} />

                <Stack flexShrink={0} height={270}>
                  <LoanOverviewPayablesGrid
                    outstandingPayAbles={loanPayAbles}
                  />
                </Stack>
                <Stack flexShrink={0} height={480}>
                  <LoanOverviewPaymentsGrid
                    histories={loanPayments?.histories}
                  />
                </Stack>
              </Stack>

              {['xxl'].includes(breakpoints) && (
                <Stack
                  borderLeft={'1px solid #EDEDED'}
                  height={'100%'}
                  overflow={'hidden'}
                  pl={3}
                  width={320}
                >
                  <Stack flex={1} overflow={'auto'}>
                    <Stack
                      alignItems={'center'}
                      flexShrink={0}
                      gap={3}
                      height={'calc(100% - 32px)'}
                    >
                      {content.length > 0 ? (
                        content.map((item, index) => (
                          <Fade in={true} key={`comment-${index}-${item.id}`}>
                            <Box width={'100%'}>
                              <LoanOverviewComment
                                {...item}
                                refresh={fetchComments}
                              />
                            </Box>
                          </Fade>
                        ))
                      ) : (
                        <Stack
                          alignItems={'center'}
                          gap={3}
                          height={'100%'}
                          justifyContent={'center'}
                          maxHeight={'calc(100vh - 234px)'}
                          minWidth={'300px'}
                          width={'100%'}
                        >
                          <Icon
                            component={OVERVIEW_COMMENTS_NO_RESULT}
                            sx={{ height: 120, width: 160 }}
                          />
                          <Typography
                            color={'text.secondary'}
                            variant={'subtitle2'}
                          >
                            No comments added yet
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                    <Stack
                      alignItems={'center'}
                      alignSelf={'flex-end'}
                      bgcolor={'#303D6C'}
                      borderRadius={'50%'}
                      flexShrink={0}
                      height={32}
                      justifyContent={'center'}
                      mt={'auto'}
                      sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                      }}
                      width={32}
                      {...bindHover(popupState)}
                    >
                      <Stack>
                        <Icon
                          component={OVERVIEW_COMMENTS_ADD}
                          sx={{ height: 24, width: 24, ml: '1px' }}
                        />
                      </Stack>
                    </Stack>

                    <Popper
                      placement={'top-end'}
                      {...bindPopper(popupState)}
                      sx={{ zIndex: 9999 }}
                      transition
                    >
                      {({ TransitionProps }) => (
                        <Fade
                          {...TransitionProps}
                          timeout={100}
                          unmountOnExit={true}
                        >
                          <Paper
                            sx={{
                              mb: 3,
                              border: 'none',
                              boxShadow: 'none',
                              bgcolor: 'transparent',
                            }}
                          >
                            <Stack gap={1.5}>
                              {ACTION_BUTTONS.map((item, index) => (
                                <StyledButton
                                  color={'secondary'}
                                  key={`${item.label}-${index}`}
                                  onClick={() => onClickAddNote(item.type)}
                                  size={'small'}
                                  sx={{
                                    boxShadow:
                                      '0px 5px 10px 0px rgba(75, 107, 182, 0.15) !important',
                                    color: 'text.primary',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Icon
                                    component={item.icon}
                                    sx={{ width: 24, height: 24, mr: 1.25 }}
                                  />
                                  {item.label}
                                </StyledButton>
                              ))}
                            </Stack>
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </Stack>
                </Stack>
              )}
            </Stack>

            <Drawer
              anchor={'right'}
              open={visible}
              sx={{
                '& .MuiPaper-root': {
                  width: 320,
                  boxShadow:
                    '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
                },
              }}
            >
              <Stack
                alignItems={'center'}
                borderBottom={'1px solid #D2D6E1'}
                flexDirection={'row'}
                height={72}
                justifyContent={'space-between'}
                px={3}
              >
                <Typography variant={'subtitle1'}>Comments</Typography>
                <Icon
                  component={OVERVIEW_COMMENTS_DELETE}
                  onClick={close}
                  sx={{ width: 20, height: 20, cursor: 'pointer' }}
                />
              </Stack>

              <Stack flex={1} overflow={'auto'} pt={3} px={3}>
                <Stack
                  alignItems={'center'}
                  flexShrink={0}
                  gap={3}
                  height={'100%'}
                >
                  {content.length > 0 ? (
                    content.map((item, index) => (
                      <Fade in={true} key={`comment-${index}-${item.id}`}>
                        <Box width={'100%'}>
                          <LoanOverviewComment
                            {...item}
                            refresh={fetchComments}
                          />
                        </Box>
                      </Fade>
                    ))
                  ) : (
                    <Stack
                      alignItems={'center'}
                      gap={3}
                      height={'100%'}
                      justifyContent={'center'}
                      maxHeight={'calc(100vh - 72px)'}
                      minWidth={'300px'}
                      width={'100%'}
                    >
                      <Icon
                        component={OVERVIEW_COMMENTS_NO_RESULT}
                        sx={{ height: 120, width: 160 }}
                      />
                      <Typography
                        color={'text.secondary'}
                        variant={'subtitle2'}
                      >
                        No comments added yet
                      </Typography>
                    </Stack>
                  )}
                  <Box
                    bgcolor={'transparent'}
                    color={'transparent'}
                    height={24}
                    width={'100%'}
                  >
                    &nbsp;
                  </Box>
                </Stack>

                <Stack
                  alignItems={'center'}
                  alignSelf={'flex-end'}
                  bgcolor={'#303D6C'}
                  borderRadius={'50%'}
                  flexShrink={0}
                  height={32}
                  justifyContent={'center'}
                  mt={'auto'}
                  sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                  }}
                  width={32}
                  {...bindHover(popupState)}
                >
                  <Stack>
                    <Icon
                      component={OVERVIEW_COMMENTS_ADD}
                      sx={{ height: 24, width: 24, ml: '1px' }}
                    />
                  </Stack>
                </Stack>

                <Popper
                  placement={'top-end'}
                  {...bindPopper(popupState)}
                  sx={{
                    zIndex: 9999,
                  }}
                  transition
                >
                  {({ TransitionProps }) => (
                    <Fade
                      {...TransitionProps}
                      timeout={100}
                      unmountOnExit={true}
                    >
                      <Paper
                        sx={{
                          mb: 3,
                          border: 'none',
                          boxShadow: 'none',
                          bgcolor: 'transparent',
                        }}
                      >
                        <Stack gap={1.5}>
                          {ACTION_BUTTONS.map((item, index) => (
                            <StyledButton
                              color={'secondary'}
                              key={`${item.label}-${index}`}
                              onClick={() => onClickAddNote(item.type)}
                              size={'small'}
                              sx={{
                                boxShadow:
                                  '0px 5px 10px 0px rgba(75, 107, 182, 0.15) !important',
                                color: 'text.primary',
                                alignItems: 'center',
                              }}
                            >
                              <Icon
                                component={item.icon}
                                sx={{ width: 24, height: 24, mr: 1.25 }}
                              />
                              {item.label}
                            </StyledButton>
                          ))}
                        </Stack>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Stack>
            </Drawer>
          </Stack>
        </Fade>
      )}
    </Layout>
  );
});
