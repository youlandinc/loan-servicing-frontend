import { Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';

interface LoanExtensionRequestDeleteDialogProps {
  undoClose: () => void;
  loading: boolean;
  onClickUndo: () => void;
  undoShow: boolean;
}

export const LoanExtensionRequestDeleteDialog = ({
  undoClose,
  loading,
  onClickUndo,
  undoShow,
}: LoanExtensionRequestDeleteDialogProps) => {
  return (
    <StyledDialog
      content={
        <Typography color={'#636A7C'} px={3} py={2} variant={'body2'}>
          This will revert to the last saved interest rate.
        </Typography>
      }
      footer={
        <Stack flexDirection={'row'} gap={1.5}>
          <StyledButton
            color={'info'}
            onClick={undoClose}
            size={'small'}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            color={'error'}
            loading={loading}
            onClick={onClickUndo}
            size={'small'}
          >
            Undo
          </StyledButton>
        </Stack>
      }
      header={'Undo changes?'}
      onClose={undoClose}
      open={undoShow}
      sx={{
        '.MuiDialogContent-root': {
          px: '0 !important',
        },
      }}
    />
  );
};
