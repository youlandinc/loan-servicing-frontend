import { FC } from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

interface StyledDaysDelinquentProps extends TypographyProps {
  days: number;
}

const levelNegative = {
  color: '#5B76BC',
  backgroundColor: 'rgba(17, 52, 227, 0.10)',
};

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
  if (days <= 0) {
    levelProps = levelNegative;
  } else if (days <= 30) {
    levelProps = level30;
  } else if (days <= 60) {
    levelProps = level60;
  } else if (days > 60) {
    levelProps = other;
  }

  const label = days <= 0 ? 'Performing' : `${days} days`;

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
        {label}
      </Typography>
    </Box>
  );
};
