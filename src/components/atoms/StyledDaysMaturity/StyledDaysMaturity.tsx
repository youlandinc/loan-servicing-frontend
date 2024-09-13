import { MaturityTimeRangeEnum } from '@/types/enum';
import { Box, Typography, TypographyProps } from '@mui/material';
import { FC } from 'react';

interface StyledDaysMaturityProps extends TypographyProps {
  type: MaturityTimeRangeEnum;
  days: number;
}

export const color: Record<string, any> = {
  [MaturityTimeRangeEnum.ALREADY_END]: '#A10000',
  [MaturityTimeRangeEnum.MONTH_END]: '#E56731',
  [MaturityTimeRangeEnum.NEXT_MONTH_END]: '#F5802E',
};

export const bgcolor: Record<string, any> = {
  [MaturityTimeRangeEnum.ALREADY_END]: 'rgba(235, 10, 10, 0.15)',
  [MaturityTimeRangeEnum.MONTH_END]: 'rgba(255, 92, 23, 0.25)',
  [MaturityTimeRangeEnum.NEXT_MONTH_END]: 'rgba(255, 143, 40, 0.30)',
};

export const StyledDaysMaturity: FC<StyledDaysMaturityProps> = ({
  type,
  days,
  ...rest
}) => {
  return (
    <Box>
      <Typography
        bgcolor={bgcolor[type] || 'rgba(176, 176, 176, 0.20)'}
        borderRadius={1}
        color={color[type] || '#4F4F4F'}
        component={'div'}
        py={0.25}
        textAlign={'center'}
        variant={'subtitle3'}
        width={120}
        {...rest}
      >
        {days} days
      </Typography>
    </Box>
  );
};
