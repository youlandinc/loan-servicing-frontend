import { FC } from 'react';

import { Stack, Tooltip, Typography } from '@mui/material';

import { utils } from '@/utils';

import {
  LoanTimelineStatusEnum,
  OverviewRepaymentTimeLine,
  PaidStatusEnum,
} from '@/types/loan/overview';

export interface LoanOverviewTimelineProps {
  listData?: OverviewRepaymentTimeLine[];
}

const COLOR: {
  [key in LoanTimelineStatusEnum]: {
    bgcolor: string;
    outline: string;
    dotColor: string;
  };
} = {
  [LoanTimelineStatusEnum.normal]: {
    bgcolor: 'rgba(9, 157, 153, 0.25)',
    dotColor: 'rgba(9, 157, 153, 0.4)',
    outline: '#73D2D0',
  },
  [LoanTimelineStatusEnum.dq_30]: {
    bgcolor: 'rgba(251, 149, 50, 0.25)',
    dotColor: 'rgba(251, 149, 50, 0.4)',
    outline: 'rgba(251, 149, 50, 1)',
  },
  [LoanTimelineStatusEnum.dq_60]: {
    bgcolor: 'rgba(229, 103, 49, 0.5)',
    dotColor: 'rgba(229, 103, 49, 0.65)',
    outline: 'rgba(229, 103, 49, 1)',
  },
  [LoanTimelineStatusEnum.dq_60_plus]: {
    bgcolor: 'rgba(115, 0, 0, 0.5)',
    dotColor: 'rgba(115, 0, 0, 0.65)',
    outline: 'rgba(115, 0, 0, 1)',
  },
  [LoanTimelineStatusEnum.future]: {
    bgcolor: 'rgba(217, 217, 217, 1)',
    dotColor: 'rgba(200, 200, 200, 1)',
    outline: '#9095A3',
  },
};

const DEFAULT = [
  {
    billStatus: LoanTimelineStatusEnum.normal,
    label: 'Paid',
  },
  {
    billStatus: LoanTimelineStatusEnum.dq_30,
    label: 'DQ 1-30',
  },
  {
    billStatus: LoanTimelineStatusEnum.dq_60,
    label: 'DQ 31-60',
  },
  {
    billStatus: LoanTimelineStatusEnum.dq_60_plus,
    label: 'DQ 61+',
  },
  {
    billStatus: LoanTimelineStatusEnum.future,
    label: 'Future',
  },
];

const temp1 = {
  loanId: 1520,
  dateDue: '2024-07-01',
  dateReceived: '2024-06-21',
  interestDue: 11681.25,
  lateChargesDue: null,
  paymentAmount: 11681.25,
  principalDue: null,
  paymentModeOn: '2024-06-21',
  description: null,
  repaymentStatus: LoanTimelineStatusEnum.normal,
  monthAndYearOfDateDue: 'July 2024',
  paidStatus: PaidStatusEnum.unpaid,
  reserveApplied: null,
};

export const LoanOverviewTimeline: FC<LoanOverviewTimelineProps> = ({
  listData = [temp1],
}) => {
  return (
    <Stack
      bgcolor={'white'}
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      gap={1.5}
      p={3}
      width={'100%'}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Typography variant={'subtitle1'}>Repayment timeline</Typography>
        <Stack flexDirection={'row'} gap={1.5}>
          {DEFAULT.map((item, index) => (
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1}
              key={`timeline-header-${item.label}-${index}`}
            >
              <Stack
                bgcolor={COLOR[item.billStatus].dotColor}
                borderRadius={'50%'}
                height={8}
                width={8}
              />
              <Typography color={'text.secondary'} variant={'body3'}>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack flexDirection={'row'} flexWrap={'wrap'} gap={'12px 2px'}>
        {listData.map((item, index) => (
          <Tooltip
            arrow
            key={`overview-timeline-${index}`}
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: 'white',
                  boxShadow: '0px 0px 15px 0px rgba(75, 107, 182, 0.30)',
                  borderRadius: 2,
                  p: 3,
                  width: item.paidStatus === PaidStatusEnum.paid ? 800 : 240,
                  maxWidth: '450px !important',
                },
              },
              arrow: {
                sx: {
                  color: 'white',
                },
              },
              popper: {
                sx: {
                  bgcolor: 'transparent',
                  m: 0,
                },
              },
            }}
            title={
              <Stack
                bgcolor={'white'}
                color={'text.primary'}
                gap={1.25}
                width={'100%'}
              >
                <Typography color={'text.primary'} variant={'subtitle2'}>
                  Due {utils.formatDate(item.dateDue, 'MM/dd/yyyy')}
                </Typography>
                {item.paidStatus === PaidStatusEnum.paid ? (
                  <Stack flexDirection={'row'} gap={1.25}>
                    <Stack gap={0.5}>
                      <Typography fontWeight={600} variant={'body3'}>
                        Amounts due
                      </Typography>
                      {utils.TypeOf(item.interestDue) !== 'Null' && (
                        <Typography variant={'body3'}>
                          Interest due:{' '}
                          <Typography fontWeight={600} variant={'body3'}>
                            {utils.formatDollar(item.interestDue!)}
                          </Typography>
                        </Typography>
                      )}

                      {utils.TypeOf(item.lateChargesDue) !== 'Null' && (
                        <Typography variant={'body3'}>
                          Late charges due:{' '}
                          <Typography fontWeight={600} variant={'body3'}>
                            {utils.formatDollar(item?.lateChargesDue)}
                          </Typography>
                        </Typography>
                      )}
                    </Stack>
                    <Stack gap={0.5}>
                      <Typography fontWeight={600} variant={'body3'}>
                        Payment info
                      </Typography>
                      {utils.TypeOf(item.paymentAmount) !== 'Null' && (
                        <Typography variant={'body3'}>
                          Reserve applied:{' '}
                          <Typography fontWeight={600} variant={'body3'}>
                            {utils.formatDollar(item?.reserveApplied)}
                          </Typography>
                        </Typography>
                      )}
                      {utils.TypeOf(item.paymentAmount) !== 'Null' && (
                        <Typography variant={'body3'}>
                          Payment amount:{' '}
                          <Typography fontWeight={600} variant={'body3'}>
                            {utils.formatDollar(item?.paymentAmount)}
                          </Typography>
                        </Typography>
                      )}
                      {utils.TypeOf(item.paymentModeOn) !== 'Null' && (
                        <Typography variant={'body3'}>
                          Payment made on{' '}
                          <Typography fontWeight={600} variant={'body3'}>
                            {utils.formatDate(item?.paymentModeOn)}
                          </Typography>
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                ) : (
                  <Stack gap={0.5}>
                    {utils.TypeOf(item.interestDue) !== 'Null' && (
                      <Typography variant={'body3'}>
                        Interest due:{' '}
                        <Typography fontWeight={600} variant={'body3'}>
                          {utils.formatDollar(item.interestDue!)}
                        </Typography>
                      </Typography>
                    )}

                    {utils.TypeOf(item.lateChargesDue) !== 'Null' && (
                      <Typography variant={'body3'}>
                        Late charges due:{' '}
                        <Typography fontWeight={600} variant={'body3'}>
                          {utils.formatDollar(item?.lateChargesDue)}
                        </Typography>
                      </Typography>
                    )}

                    {utils.TypeOf(item.paymentAmount) !== 'Null' && (
                      <Typography variant={'body3'}>
                        Payment amount:{' '}
                        <Typography fontWeight={600} variant={'body3'}>
                          {utils.formatDollar(item?.paymentAmount)}
                        </Typography>
                      </Typography>
                    )}

                    {utils.TypeOf(item.principalDue) !== 'Null' && (
                      <Typography variant={'body3'}>
                        Principal due:{' '}
                        <Typography fontWeight={600} variant={'body3'}>
                          {utils.formatDollar(item?.principalDue)}
                        </Typography>
                      </Typography>
                    )}

                    {utils.TypeOf(item.paymentModeOn) !== 'Null' && (
                      <Typography variant={'body3'}>
                        Payment made on{' '}
                        <Typography fontWeight={600} variant={'body3'}>
                          {utils.formatDate(item?.paymentModeOn)}
                        </Typography>
                      </Typography>
                    )}
                  </Stack>
                )}
              </Stack>
            }
          >
            <Stack
              bgcolor={COLOR[item.repaymentStatus]?.bgcolor}
              height={10}
              sx={{
                '&:hover': {
                  outline: `2px solid ${COLOR[item.repaymentStatus]?.outline}`,
                },
              }}
              width={`calc(100% / ${
                listData.length <= 18 ? listData.length : 18
              } - 2px)`}
            />
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
};
