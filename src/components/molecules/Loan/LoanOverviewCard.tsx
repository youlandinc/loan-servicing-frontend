import { FC, ReactNode, useMemo } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

export interface LoanOverviewCardProps {
  header: string;
  headerValue: string;
  headerIcon: any | ReactNode;
  theme?: 'light' | 'dark';
  listData: Array<{ label: ReactNode; value: ReactNode }>;
  tailData?: Array<{ label: ReactNode; value: ReactNode }>;
}

export const LoanOverviewCard: FC<LoanOverviewCardProps> = ({
  theme = 'light',
  header,
  headerValue,
  headerIcon,
  listData,
  tailData = [],
}) => {
  const computedColor = useMemo(() => {
    const result = {
      common: {
        bgcolor: '#FFFFFF',
        color: 'text.primary',
        borderColor: 'primary.main',
      },
      listData: {
        label: 'text.secondary',
        value: 'text.primary',
      },
    };
    if (theme === 'dark') {
      result.common.bgcolor = '#303D6C';
      result.common.color = 'text.white';
      result.common.borderColor = 'transparent';
      result.listData.label = 'text.white';
      result.listData.value = 'text.white';
    }

    return result;
  }, [theme]);

  return (
    <Stack
      bgcolor={computedColor.common.bgcolor}
      border={'1px solid'}
      borderColor={computedColor.common.borderColor}
      borderRadius={2}
      gap={1}
      p={3}
      width={'100%'}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Stack>
          <Typography color={computedColor.common.color} variant={'body3'}>
            {header}
          </Typography>
          <Typography color={computedColor.common.color} variant={'h6'}>
            {headerValue}
          </Typography>
        </Stack>
        <Icon component={headerIcon} sx={{ width: 32, height: 32 }} />
      </Stack>
      <Stack gap={1.25} mt={0.5} width={'100%'}>
        {listData.map((item, index) => (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            key={`${item.label}-${item.value}-${index}`}
          >
            <Typography color={computedColor.listData.label} variant={'body2'}>
              {item.label}
            </Typography>
            <Typography
              color={computedColor.listData.value}
              variant={'subtitle2'}
            >
              {item.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
      {tailData.length > 0 && (
        <Stack borderTop={'1px solid #D2D6E1'} pt={1}>
          {tailData.map((item, index) => (
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              key={`${item.label}-${item.value}-${index}`}
            >
              <Typography
                color={computedColor.listData.label}
                variant={'body2'}
              >
                {item.label}
              </Typography>
              <Typography
                color={computedColor.listData.value}
                variant={'subtitle2'}
              >
                {item.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
