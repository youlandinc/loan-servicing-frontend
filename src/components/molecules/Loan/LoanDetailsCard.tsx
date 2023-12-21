import { FC, ReactNode } from 'react';
import { Box, Grid, SxProps, Typography } from '@mui/material';

type RenderBoxProps = {
  data: Record<string, any>;
  sx?: SxProps;
};

export const RenderBox: FC<RenderBoxProps> = (props) => {
  const { data, sx } = props;
  const renderItem = (name: string, value: any) => {
    return (
      <Grid
        component={'li'}
        item
        key={name}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
        xs={1}
      >
        <Typography color={'text.secondary'} variant={'body2'}>
          {name}
        </Typography>
        <Typography variant={'body2'}>
          {value === undefined || value === null || value === ''
            ? 'N/A'
            : value}
        </Typography>
      </Grid>
    );
  };
  return (
    <Grid
      columns={{ xs: 2 }}
      columnSpacing={{ xs: 3 }}
      component={'ul'}
      container
      rowSpacing={3}
      sx={sx}
    >
      {Object.keys(data).map((item) => {
        return renderItem(item, data[item]);
      })}
    </Grid>
  );
};

type LoanDetailCardProps = {
  title: string | ReactNode;
  data: Record<string, unknown>;
};

export const LoanDetailsCard: FC<LoanDetailCardProps> = ({ title, data }) => {
  return (
    <Box
      border={'1px solid'}
      borderColor={'border.normal'}
      borderRadius={2}
      p={3}
    >
      {typeof title === 'string' ? (
        <Typography pb={3} variant={'h6'}>
          {title}
        </Typography>
      ) : (
        title
      )}
      <RenderBox data={data} />
    </Box>
  );
};
