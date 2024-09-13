import { Box, Typography, TypographyProps } from '@mui/material';
import { FC } from 'react';

interface StyledDaysDelinquentProps extends TypographyProps {
  days: number;
}

const level30 = {
  color: '#FB9532',
  backgroundColor: 'rgba(244, 179, 133, 0.30)',
};

const level60 = {
  color: '#E56731',
  backgroundColor: 'rgba(255, 92, 23, 0.25)',
};

const other = {
  color: '#A10000',
  backgroundColor: 'rgba(235, 10, 10, 0.15);',
};

export const StyledDaysDelinquent: FC<StyledDaysDelinquentProps> = ({
  days,
  ...rest
}) => {
  let levelProps = null;
  if (days <= 30) {
    levelProps = level30;
  } else if (days <= 60) {
    levelProps = level60;
  } else if (days > 60) {
    levelProps = other;
  }

  return (
    <Box>
      <Typography
        borderRadius={1}
        component={'div'}
        py={0.25}
        textAlign={'center'}
        variant={'subtitle3'}
        width={120}
        {...levelProps}
        {...rest}
      >
        {days} days
      </Typography>
    </Box>
  );
};
