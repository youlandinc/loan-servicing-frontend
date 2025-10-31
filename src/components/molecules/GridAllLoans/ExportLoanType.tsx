import { FC, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Fade, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useAsyncFn } from 'react-use';

import { PipelineExportType } from '@/constant/options';
import { createFile } from '@/utils';

import { StyledButton, StyledSelect } from '@/components/atoms';

import { _exportLoans } from '@/request';
import { HttpError } from '@/types';
import { PipelineExportTypeEnum } from '@/types/enum';

type ExportLoanTypeProps = {
  onClose?: () => void;
  open: boolean;
  handleExport?: (type: PipelineExportTypeEnum) => void;
  loading?: boolean;
  disabled?: boolean;
  loanIds: number[];
};

export const ExportLoanType: FC<ExportLoanTypeProps> = ({
  onClose,
  open,
  disabled,
  loanIds,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [exportType, setExportType] = useState<PipelineExportTypeEnum>(
    PipelineExportTypeEnum.LOAN_PIPELINE,
  );

  const [exportState, exportFn] = useAsyncFn(async () => {
    try {
      await _exportLoans(loanIds).then((res) => {
        const fileName = res.headers['content-disposition']
          .split(';')[1]
          .split('filename=')[1];
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        createFile(blob, fileName);
      });
    } catch (e) {
      const { message, variant, header } = e as unknown as HttpError;
      enqueueSnackbar(message as string, {
        variant,
        isSimple: !header,
        header,
      });
    }
  }, [loanIds]);

  return (
    <Fade in={open}>
      <Stack
        alignItems={'center'}
        bgcolor={'primary.main'}
        borderRadius={10}
        bottom={60}
        direction={'row'}
        left={0}
        m={'0 auto'}
        position={'fixed'}
        px={2.5}
        py={2}
        right={0}
        spacing={1.25}
        width={460}
        zIndex={20}
      >
        <CloseIcon
          onClick={onClose}
          sx={{
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.50)',
            cursor: 'pointer',
          }}
        />
        <Typography color={'text.white'} variant={'body2'}>
          Export to
        </Typography>
        <StyledSelect
          label={'Select type'}
          onChange={(e) => {
            setExportType(e.target.value as PipelineExportTypeEnum);
          }}
          options={PipelineExportType}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              height: 40,
            },
            '& .MuiInputLabel-root': {
              top: -6,
            },
            '& .MuiFormLabel-filled': {
              top: 0,
            },
            '& .MuiInputBase-root,& .MuiFormLabel-root': {
              fontSize: 14,
              color: 'text.white',
            },
            '& .Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #FFF !important',
              },
            },
            '& .MuiInputLabel-formControl.Mui-focused': {
              color: 'text.white',
            },
            '& .MuiFormLabel-root': {
              color: 'text.white',
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#FFF !important',
            },
            '& .MuiSelect-outlined': {
              py: 1.25,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FFF !important',
            },
            '& .MuiSelect-iconOutlined': {
              color: 'text.white',
            },
          }}
          value={exportType}
        />
        <StyledButton
          disabled={disabled}
          loading={exportState.loading}
          onClick={async () => {
            await exportFn();
          }}
          size={'small'}
          sx={{
            bgcolor: '#FFFFFF !important',
            color: '#5B76BC',
            '&:hover': { bgcolor: 'rgb(244, 246, 250) !important' },
          }}
          variant={'contained'}
        >
          Export
        </StyledButton>
      </Stack>
    </Fade>
  );
};
