import { FC, ReactNode } from 'react';

import { Stack, Typography } from '@mui/material';

interface LoanPaymentsCard2Props {
  icon: ReactNode;
  label: string;
  content: string;
  contentRight?: ReactNode;
}

export const LoanPaymentsCard2: FC<LoanPaymentsCard2Props> = ({
  icon,
  label,
  content,
  contentRight,
}) => {
  return (
    <Stack
      sx={{
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'border.normal',
        borderRadius: 2,
        flex: 1.6,
        p: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Stack gap={1}>
        {icon}
        <Typography color={'text.secondary'} variant={'subtitle2'}>
          {label}
        </Typography>
        <Typography color={'text.primary'} variant={'h5'}>
          {content}
        </Typography>
      </Stack>
      {contentRight}
    </Stack>
  );
};
