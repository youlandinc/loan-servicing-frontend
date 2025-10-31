import { FC, useMemo } from 'react';

import { Box, Typography, TypographyProps } from '@mui/material';

interface DaysDelinquentContentProps extends TypographyProps {
  days: number;
}

export const DaysDelinquentContent: FC<DaysDelinquentContentProps> = ({
  days,
  ...rest
}) => {
  const textProps = useMemo(() => {
    switch (true) {
      case days <= 0:
        return {
          color: 'text.secondary',
          // backgroundColor: 'rgba(17, 52, 227, 0.10)',
        };
      case days <= 30:
        return {
          color: '#FB9532',
          backgroundColor: 'rgba(244, 179, 133, 0.30)',
        };
      case days <= 60:
        return {
          color: '#E56731',
          backgroundColor: 'rgba(255, 92, 23, 0.25)',
        };
      case days > 60:
        return {
          color: '#A10000',
          backgroundColor: 'rgba(235, 10, 10, 0.15);',
        };
      default:
        return {
          color: '#5B76BC',
          backgroundColor: 'rgba(17, 52, 227, 0.10)',
        };
    }
  }, [days]);

  const label = days <= 0 ? 'Not delinquent' : `${days} days`;

  return (
    <Box>
      <Typography
        borderRadius={1}
        component={'div'}
        py={0.25}
        textAlign={'center'}
        variant={'subtitle3'}
        width={120}
        {...textProps}
        {...rest}
      >
        {label}
      </Typography>
    </Box>
  );
};
