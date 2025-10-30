import { FC, ReactNode } from 'react';

import { Stack, Typography } from '@mui/material';

interface LoanCardProps {
  icon: ReactNode;
  label: string;
  content: string;
}

export const LoanPaymentsCard: FC<LoanCardProps> = ({
  icon,
  label,
  content,
}) => {
  return (
    <Stack
      bgcolor={'white'}
      border={'1px solid'}
      borderColor={'border.normal'}
      borderRadius={2}
      flex={1}
      gap={1}
      p={3}
    >
      {icon}
      <Typography color={'text.secondary'} variant={'subtitle2'}>
        {label}
      </Typography>
      <Typography color={'text.primary'} variant={'h5'}>
        {content}
      </Typography>
    </Stack>
  );
};
