import React, { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import ClearIcon from '@mui/icons-material/Clear';

import { ISortItemModel } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { StyledButton } from '@/components/atoms';
import { SortDirection } from '@/types/enum';

type SortButtonProps = {
  sortItems: ISortItemModel;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClear?: (e: React.MouseEvent<HTMLOrSVGElement>) => void;
};

export const SortButton: FC<SortButtonProps> = ({
  sortItems,
  handleClick,
  handleClear,
}) => {
  return (
    <>
      {/*{Array.isArray(sortItems) && sortItems.length > 0 && (*/}
      <StyledButton
        onClick={handleClick}
        sx={{
          bgcolor: 'rgba(91, 118, 188, 0.10) !important',
          py: '4px !important',
          px: '8px !important',
          height: 'auto !important',
          flexShrink: 0,
        }}
        variant={'text'}
      >
        <Stack alignItems={'center'} direction={'row'} spacing={1.5}>
          {sortItems?.direction === SortDirection.DESC ? (
            <SouthIcon sx={{ fontSize: 16 }} />
          ) : (
            <NorthIcon sx={{ fontSize: 16 }} />
          )}
          <Typography variant={'body2'}>{sortItems?.label}</Typography>
          <ClearIcon onClick={handleClear} sx={{ fontSize: 16 }} />
        </Stack>
      </StyledButton>
      {/*)}*/}
    </>
  );
};
