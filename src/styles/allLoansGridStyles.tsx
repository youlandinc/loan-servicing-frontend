import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { CSSProperties } from 'react';

export const defaultProps = {
  icons: {
    KeyboardDoubleArrowDownIcon: (props: { style: CSSProperties }) => {
      const { style } = props;

      const transformValue =
        style.transform === 'rotate(-180deg)'
          ? 'rotate(0deg)'
          : 'rotate(-90deg)';
      return (
        <KeyboardDoubleArrowDownIcon
          style={{ ...style, transform: transformValue }}
          sx={{ fontSize: 20 }}
        />
      );
    },
    ExpandMoreIcon: (props: { style: CSSProperties }) => {
      const { style } = props;

      const transformValue =
        style.transform === 'rotate(-180deg)'
          ? 'rotate(0deg)'
          : 'rotate(-90deg)';

      return (
        <ExpandMoreIcon
          style={{ ...style, transform: transformValue }}
          sx={{ fontSize: 20 }}
        />
      );
    },
  },
  muiTableHeadProps: {
    sx: {
      opacity: 1,
      '& .MuiTableRow-head': {
        boxShadow: 'none',
      },

      '& .Mui-TableHeadCell-Content-Wrapper': {
        fontWeight: 600,
        fontSize: 12,
        lineHeight: '20px',
        whiteSpace: 'nowrap',
      },
      '& .MuiTableCell-root': {
        border: 'none',
      },
      '& .MuiTableCell-root:last-child': {
        bgcolor: '#F4F6FA',
      },
    },
  },
  muiTableHeadCellProps: {
    sx: {
      bgcolor: '#F4F6FA',
      opacity: 1,
      border: 'none',
      minHeight: 36,
      px: 1,
      py: 1.25,
      justifyContent: 'center',
      '& .Mui-TableHeadCell-Content-Labels ': {
        pl: 0,
      },
      '& .Mui-TableHeadCell-Content-Wrapper': {
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        webkitBoxOrient: 'vertical',
        webkitLineClamp: 2,
        display: '-webkit-box',
        whiteSpace: 'normal',
        color: 'info.A100',
      },
      '& .Mui-TableHeadCell-ResizeHandle-Wrapper': {
        mr: '-8px',
      },
      '& .Mui-TableHeadCell-ResizeHandle-Divider': {
        borderWidth: 1,
      },
      '&[data-pinned="true"]:before': {
        bgcolor: 'transparent',
      },
      /* cursor:
          pipelineMode === PipelineDisplayMode.LIST_MODE ? 'pointer' : 'unset',
      '&:hover': {
        bgcolor:
            pipelineMode === PipelineDisplayMode.LIST_MODE ? '#ececec' : 'none',
      },*/
    },
  },
  muiTablePaperProps: {
    sx: {
      boxShadow: 'none',
      '& .MuiAlert-message span': {
        visibility: 'hidden',
      },
      borderRadius: 0,
    },
  },
  muiBottomToolbarProps: {
    sx: {
      '& .MuiTypography-body2': {
        fontSize: 14,
      },
      '& .MuiInputLabel-root,& .MuiInput-root': {
        fontSize: 14,
      },
    },
  },
  muiTableBodyProps: {
    sx: {
      '& tr .groupingTitle': {
        color: 'text.primary',
      },
      '& .MuiTableRow-root:last-child .MuiTableCell-root': {
        borderBottom: 'none',
      },
    },
  },
  muiPaginationProps: {
    SelectProps: {
      sx: {
        '& .MuiInputBase-input:focus': {
          bgcolor: 'transparent',
        },
      },
    },
  },
  muiSelectCheckboxProps: {
    sx: {
      width: 20,
      height: 20,
      m: '0 auto',
    },
  },
  muiSelectAllCheckboxProps: {
    sx: {
      display: 'block',
      m: '0 auto',
    },
  },
  /*  muiTableBodyRowProps: ({ row }: { row: MRT_Row<Record<string, any>> }) => {
    return row?.subRows?.length
      ? {
          sx: {
            cursor: 'pointer',
            userSelect: 'none',
            ...pipelineGroupingDefaultSx,
            '& .MuiTableCell-root': {
              ...pipelineGroupingDefaultSx['& .MuiTableCell-root'],
              borderBottom: row.getIsExpanded() ? '1px solid #EDF1FF' : 'none',
            },
            '& .MuiTableCell-root:first-of-type': {
              border: 'none',
            },
          },
        }
      : {
          sx: {
            ...pipelineAllDefaultSx,
            '& .MuiTableCell-root:first-of-type':
              pipelineMode === PipelineDisplayMode.GROUP_MODE
                ? {
                    border: 'none ',
                    // borderRight: '1px solid #EDF1FF ',
                  }
                : {
                    borderLeft: 'none',
                  },
          },
        };
  },*/
};

export const listModeDefaultStyleProps = {
  ...defaultProps,
  muiTableHeadCellProps: {
    ...defaultProps.muiTableHeadCellProps.sx,
    cursor: 'pointer',
    '&:hover': {
      bgcolor: '#ececec',
    },
  },
  /*  muiTableBodyRowProps: ({ row }: { row: MRT_Row<Record<string, any>> }) => {
    return row?.subRows?.length
      ? {
          sx: {
            cursor: 'pointer',
            userSelect: 'none',
            ...pipelineGroupingDefaultSx,
            '& .MuiTableCell-root': {
              ...pipelineGroupingDefaultSx['& .MuiTableCell-root'],
              borderBottom: row.getIsExpanded() ? '1px solid #EDF1FF' : 'none',
            },
            '& .MuiTableCell-root:first-of-type': {
              border: 'none',
            },
          },
        }
      : {
          sx: {
            ...pipelineAllDefaultSx,
            '& .MuiTableCell-root:first-of-type':
              pipelineMode === PipelineDisplayMode.GROUP_MODE
                ? {
                    border: 'none ',
                    // borderRight: '1px solid #EDF1FF ',
                  }
                : {
                    borderLeft: 'none',
                  },
          },
        };
  },*/
};
