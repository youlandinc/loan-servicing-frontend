export const StyledDialogStyles = {
  '&.MuiDialog-root': {
    '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root':
      {
        //p: 0,
      },
    '& .dialog_header': {
      px: 3,
      pt: 3,
      fontWeight: 600,
      fontSize: 18,
      color: 'text.primary',
    },
    '& .dialog_footer': {
      textAlign: 'right',
      px: '24px !important',
      pb: '24px !important',
    },
    '& .dialog_content': {
      px: 3,
    },
    '& .MuiDialog-paper': {
      width: {
        xl: 'calc(100% - 64px)',
        xs: 'calc(100% - 48px)',
      },
      mx: 3,
    },
    '& .MuiPaper-root': {
      borderRadius: 2,
      maxWidth: 600,
      boxShadow:
        'box-shadow: 0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
    },
  },
} as const;
