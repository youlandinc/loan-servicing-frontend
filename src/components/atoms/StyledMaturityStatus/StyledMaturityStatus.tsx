import { FC } from 'react';

import { Typography, TypographyProps } from '@mui/material';

import { MaturityStatusInDelinquentEnum } from '@/types/enum';

type StyledMaturityStatusProps = {
  status: MaturityStatusInDelinquentEnum;
} & TypographyProps;

const statusMap = {
  [MaturityStatusInDelinquentEnum.in_default]: 'In default',
  [MaturityStatusInDelinquentEnum.not_near_maturity]: 'Not near maturity',
  [MaturityStatusInDelinquentEnum.month_end]: 'Month end',
  [MaturityStatusInDelinquentEnum.next_month_end]: 'Next month end',
};
const statusFontColor = {
  [MaturityStatusInDelinquentEnum.in_default]: '#DE6449',
  [MaturityStatusInDelinquentEnum.not_near_maturity]: '#759AF0',
  [MaturityStatusInDelinquentEnum.month_end]: '#FA8435',
  [MaturityStatusInDelinquentEnum.next_month_end]: '#EFAD28',
};
const statusBgcolor = {
  [MaturityStatusInDelinquentEnum.in_default]: '#FFEEEA',
  [MaturityStatusInDelinquentEnum.not_near_maturity]:
    'rgba(117, 154, 240, 0.20)',
  [MaturityStatusInDelinquentEnum.month_end]: 'rgba(251, 186, 157, 0.30)',
  [MaturityStatusInDelinquentEnum.next_month_end]: 'rgba(247, 190, 104, 0.20)',
};

export const StyledMaturityStatus: FC<StyledMaturityStatusProps> = ({
  status,
  ...rest
}) => {
  return (
    <Typography
      bgcolor={
        statusBgcolor[status] ||
        statusBgcolor[MaturityStatusInDelinquentEnum.not_near_maturity]
      }
      borderRadius={1}
      color={
        statusFontColor[status] ||
        statusFontColor[MaturityStatusInDelinquentEnum.not_near_maturity]
      }
      component={'div'}
      py={0.25}
      textAlign={'center'}
      variant={'subtitle3'}
      width={120}
      {...rest}
    >
      {statusMap[status] || ''}
    </Typography>
  );
};
