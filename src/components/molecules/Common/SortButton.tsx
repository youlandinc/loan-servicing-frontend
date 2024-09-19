import React, { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import ClearIcon from '@mui/icons-material/Clear';

import { StyledButton } from '@/components/atoms';
import { SortDirection } from '@/types/enum';
// import { PipelineSortItemType } from '@/models/Pipeline';
// import { ColumnHeaderMap } from '@/constant/pipelineConfig';

type SortButtonProps = {
  sortItems: PipelineSortItemType[];
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
      {Array.isArray(sortItems) && sortItems.length > 0 && (
        <StyledButton
          onClick={handleClick}
          sx={{
            bgcolor: 'rgba(91, 118, 188, 0.10) !important',
            height: 'max-content',
            py: 0.5,
          }}
          variant={'text'}
        >
          <Stack alignItems={'center'} direction={'row'} spacing={1.5}>
            {sortItems?.[0]?.direction === SortDirection.DESC ? (
              <SouthIcon sx={{ fontSize: 16 }} />
            ) : (
              <NorthIcon sx={{ fontSize: 16 }} />
            )}
            <Typography variant={'subtitle1'}>
              {
                ColumnHeaderMap[
                  sortItems?.[0]?.property as keyof typeof ColumnHeaderMap
                ]
              }
            </Typography>
            <ClearIcon onClick={handleClear} sx={{ fontSize: 16 }} />
          </Stack>
        </StyledButton>
      )}
    </>
  );
};
