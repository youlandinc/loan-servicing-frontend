import { FC, ReactNode } from 'react';

import { Box, Stack, SxProps, Typography } from '@mui/material';

type RenderBoxProps = {
  data: Record<string, any>;
  sx?: SxProps;
};

export const RenderBox: FC<RenderBoxProps> = (props) => {
  const { data, sx } = props;
  const renderItem = (name: string, value: any) => {
    return (
      <Stack
        component={'li'}
        direction={'row'}
        justifyContent={'space-between'}
        key={name}
        width={'calc(50% - 12px)'}
      >
        <Typography color={'text.secondary'} variant={'body2'}>
          {name}
        </Typography>
        <Typography variant={'body2'}>
          {value === undefined || value === null || value === ''
            ? 'N/A'
            : value}
        </Typography>
      </Stack>
    );
  };
  return (
    <Stack component={'ul'} direction={'row'} flexWrap={'wrap'} gap={3} sx={sx}>
      {Object.keys(data).map((item) => {
        return renderItem(item, data[item]);
      })}
    </Stack>
  );
};

type LoanDetailCardProps = {
  title: string | ReactNode;
  data: Record<string, unknown>;
  sx?: SxProps;
};

export const LoanDetailsCard: FC<LoanDetailCardProps> = ({
  title,
  data,
  sx,
}) => {
  return (
    <Box
      bgcolor={'background.paper'}
      border={'1px solid'}
      borderColor={'#E4E7EF'}
      borderRadius={2}
      p={3}
      sx={sx}
    >
      {typeof title === 'string' ? (
        <Typography component={'p'} pb={3} variant={'h7'}>
          {title}
        </Typography>
      ) : (
        title
      )}
      <RenderBox data={data} />
    </Box>
  );
};
