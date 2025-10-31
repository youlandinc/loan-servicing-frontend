import { FC, useMemo, useState } from 'react';

import { Avatar, Icon, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constant';
import { useSwitch } from '@/hooks';
import OVERVIEW_COMMENTS_DELETE from '@/svg/loan/overview/overview-comments-delete.svg';
import { utils } from '@/utils';

import {
  StyledButton,
  StyledDialog,
  StyledTextFieldInput,
} from '@/components/atoms';

import {
  _deleteOverviewComment,
  _updateOverviewComment,
} from '@/request/loan/overview';
import { HttpError } from '@/types/common';
import { CommentItemData } from '@/types/loan/overview';

export const LoanOverviewComment: FC<
  CommentItemData & {
    refresh: (cb?: () => void) => Promise<void>;
    disabled?: boolean;
  }
> = ({
  id,
  note,
  createdAt,
  avatar,
  firstName,
  lastName,
  backgroundColor,
  refresh,
  disabled = false,
}) => {
  const { open, visible, close } = useSwitch(false);
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(note);
  const [isShow, setIsShow] = useState(false);

  const avatarName = useMemo(() => {
    const target = firstName?.[0] + lastName?.[0] || '';
    const result = target.match(/[a-zA-Z]+/g);
    return result ? result[0] : '';
  }, [firstName, lastName]);

  const [loading, setLoading] = useState(false);

  const onClickToDelete = async () => {
    setIsShow(false);
    setLoading(true);

    try {
      await _deleteOverviewComment(id);
      await refresh?.(() => {
        setLoading(false);
        close();
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const onConfirmCreateOrUpdate = async () => {
    if (!value) {
      return;
    }
    try {
      await _updateOverviewComment({ id, note: value });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  return (
    <Stack
      bgcolor={'#F0F4FF'}
      borderRadius={2}
      gap={1}
      onMouseEnter={() => setIsShow(true)}
      onMouseLeave={() => {
        setIsShow(false);
      }}
      p={1.5}
      width={'100%'}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Avatar
          src={avatar}
          sx={{
            bgcolor: backgroundColor,
            width: 24,
            height: 24,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {avatarName}
        </Avatar>
        <Typography color={'text.primary'} variant={'subtitle3'}>
          {firstName} {lastName}
        </Typography>
        <Typography color={'text.secondary'} variant={'body3'}>
          {createdAt ? utils.formatDate(createdAt, 'MMM dd, yyyy') : ''}
        </Typography>

        {isShow && (
          <Icon
            component={OVERVIEW_COMMENTS_DELETE}
            onClick={() => {
              if (disabled) {
                return;
              }
              open();
            }}
            sx={{
              width: 16,
              height: 16,
              ml: 'auto',
              cursor: disabled ? 'default' : 'pointer',
              '& path': {
                fill: disabled ? '#C4C4C4' : '#9095A3',
              },
            }}
          />
        )}
      </Stack>
      <Stack pl={4}>
        <StyledTextFieldInput
          autoFocus
          disabled={disabled}
          inputProps={{
            maxLength: 255,
          }}
          maxRows={20}
          minRows={3}
          multiline
          onBlur={onConfirmCreateOrUpdate}
          onChange={(e) => setValue(e.target.value)}
          placeholder={'Add notes here'}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 'auto !important',
              padding: 0,
              fontSize: 14,
            },
            '& fieldset': {
              border: 'none',
            },
            '& .Mui-focused': {
              fieldset: {
                border: 'none !important',
              },
            },
          }}
          value={value}
          variant={'outlined'}
        />
      </Stack>

      <StyledDialog
        content={
          <Typography my={1.5} variant={'body2'}>
            This action cannot be undone, and the comment will be permanently
            removed from this loan.
          </Typography>
        }
        footer={
          <Stack flexDirection={'row'} gap={3}>
            <StyledButton
              color={'info'}
              onClick={() => {
                close();
                setIsShow(false);
              }}
              size={'small'}
              sx={{ width: 110 }}
              variant={'outlined'}
            >
              No, cancel
            </StyledButton>
            <StyledButton
              color={'error'}
              disabled={loading}
              loading={loading}
              onClick={onClickToDelete}
              size={'small'}
              sx={{ width: 110 }}
            >
              Yes, delete
            </StyledButton>
          </Stack>
        }
        header={'Are you sure you want to delete this comment?'}
        open={visible}
      />
    </Stack>
  );
};
