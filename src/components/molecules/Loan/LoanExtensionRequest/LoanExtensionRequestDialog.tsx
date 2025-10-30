import { MutableRefObject } from 'react';

import { Box, Stack } from '@mui/material';

import { StyledButton, StyledDialog, StyledLoading } from '@/components/atoms';

interface LoanExtensionRequestDialogProps {
  loading: boolean;
  pdfFile: MutableRefObject<null>;
  downloadLoading: boolean;
  visible: boolean;
  onClickClose: () => void;
  onClickDownload: () => void;
}

export const LoanExtensionRequestDialog = ({
  loading,
  pdfFile,
  downloadLoading,
  visible,
  onClickClose,
  onClickDownload,
}: LoanExtensionRequestDialogProps) => {
  return (
    <StyledDialog
      content={
        <Box minHeight={300}>
          {loading && (
            <Stack
              alignItems={'center'}
              height={300}
              justifyContent={'center'}
              textAlign={'center'}
            >
              <StyledLoading sx={{ color: '#D2D6E1' }} />
            </Stack>
          )}

          <Box ref={pdfFile} />
        </Box>
      }
      footer={
        <Stack flexDirection={'row'} gap={3}>
          <StyledButton
            color={'info'}
            onClick={onClickClose}
            size={'small'}
            variant={'outlined'}
          >
            Close
          </StyledButton>
          <StyledButton
            color={'primary'}
            loading={downloadLoading}
            onClick={onClickDownload}
            size={'small'}
            sx={{ width: 110 }}
          >
            Download
          </StyledButton>
        </Stack>
      }
      header={''}
      onClose={onClickClose}
      open={visible}
      sx={{
        '.MuiDialogContent-root': {
          px: '0 !important',
        },
      }}
    />
  );
};
