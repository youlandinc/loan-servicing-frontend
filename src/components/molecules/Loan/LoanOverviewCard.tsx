import { FC, ReactNode, useMemo } from 'react';
import { Icon, Stack, Tooltip, Typography } from '@mui/material';

export interface LoanOverviewCardProps {
  header: string;
  headerValue: string;
  headerIcon: any | ReactNode;
  theme?: 'light' | 'dark' | 'warning';
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
        borderColor: '#D2D6E1',
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

    if (theme === 'warning') {
      result.common.bgcolor = 'rgba(255, 238, 234, 1)';
      result.common.color = 'rgba(205, 81, 53, 1)';
      result.common.borderColor = 'rgba(205, 81, 53, 1)';
      result.listData.label = 'text.secondary';
      result.listData.value = 'text.secondary';
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
        alignItems={'flex-start'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Stack gap={0.25} mr={1.5}>
          <Typography color={computedColor.common.color} variant={'body3'}>
            {header}
          </Typography>
          <Typography
            color={computedColor.common.color}
            sx={{ wordBreak: 'break-word' }}
            variant={'h6'}
          >
            {headerValue}
          </Typography>
        </Stack>
        <Icon
          component={headerIcon}
          sx={() => {
            const result = { width: 32, height: 32, mt: 1.25 };
            if (theme === 'warning') {
              Object.assign(result, {
                '& path': {
                  fill: 'rgba(205, 81, 53, 1)',
                },
              });
            }
            return result;
          }}
        />
      </Stack>
      <Stack gap={1.25} mt={0.5} width={'100%'}>
        {listData.map((item, index) => (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            key={`${item.label}-${item.value}-${index}`}
          >
            <Typography
              color={computedColor.listData.label}
              sx={{
                wordBreak: 'break-all',
              }}
              variant={'body2'}
            >
              {item.label}
            </Typography>
            {item.value && (
              <Tooltip arrow title={item.value}>
                <Typography
                  color={computedColor.listData.value}
                  maxWidth={'40%'}
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  textAlign={'right'}
                  variant={'subtitle2'}
                >
                  {item.value}
                </Typography>
              </Tooltip>
            )}
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
              <Tooltip arrow title={item.value}>
                <Typography
                  color={computedColor.listData.value}
                  maxWidth={'40%'}
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  textAlign={'right'}
                  variant={'subtitle2'}
                >
                  {item.value}
                </Typography>
              </Tooltip>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
