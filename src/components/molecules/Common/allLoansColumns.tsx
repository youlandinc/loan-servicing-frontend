import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { format, isValid } from 'date-fns';
import { MRT_ColumnDef } from 'material-react-table';

import { StyledDaysDelinquent, StyledDaysMaturity } from '@/components/atoms';
import { StyledLoanStatus } from '@/components/atoms/StyledLoanStatus';

import { IOrderColumnsItem } from '@/models/gridModel';
import { ellipsisStyle } from '@/styles';
import {
  ColumnPiningDirectionEnum,
  MaturityTimeRangeEnum,
  PipelineStatusEnum,
} from '@/types/enum';
import { utils } from '@/utils';

export const commonColumns: MRT_ColumnDef<any>[] = [
  {
    accessorKey: 'systemLoanNumber',
    header: 'Loan number',
    size: 150,
    minSize: 100,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography
          fontSize={12}
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
        >
          {renderedCellValue}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'repaymentStatus',
    header: 'Status',
    size: 150,
    minSize: 130,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <StyledLoanStatus status={renderedCellValue as PipelineStatusEnum} />
      );
    },
  },

  {
    accessorKey: 'borrowerName',
    header: 'Borrower',
    size: 150,
    minSize: 80,
    muiTableBodyCellProps: {
      align: 'left',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Tooltip title={renderedCellValue || ''}>
          <Typography
            fontSize={12}
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
          >
            {renderedCellValue || '—'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'investor',
    header: 'Investor',
    size: 140,
    minSize: 80,
    muiTableBodyCellProps: {
      align: 'left',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Tooltip title={renderedCellValue || ''}>
          <Typography
            fontSize={12}
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
          >
            {renderedCellValue || '—'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'propertyFullAddress',
    header: 'Property address',
    size: 300,
    minSize: 110,
    muiTableBodyCellProps: {
      align: 'left',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Tooltip title={renderedCellValue}>
          <Typography
            fontSize={12}
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
          >
            {renderedCellValue}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'maturityDate',
    header: 'Maturity date',
    size: 140,
    minSize: 110,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography fontSize={12} sx={{ ...ellipsisStyle }}>
          {typeof renderedCellValue === 'string' &&
          isValid(new Date(renderedCellValue))
            ? format(new Date(renderedCellValue), 'MM/dd/yyyy')
            : '—'}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'totalLoanAmount',
    header: 'Principal balance',
    size: 140,
    minSize: 130,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography
          fontSize={12}
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
        >
          {utils.formatDollar(renderedCellValue as number)}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'currentBalance',
    header: 'Current balance',
    size: 140,
    minSize: 120,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography
          fontSize={12}
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
        >
          {utils.formatDollar(renderedCellValue as number)}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'nextPaymentDate',
    header: 'Next due date',
    size: 140,
    minSize: 110,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography fontSize={12} sx={{ ...ellipsisStyle }}>
          {typeof renderedCellValue === 'string' &&
          isValid(new Date(renderedCellValue))
            ? format(new Date(renderedCellValue), 'MM/dd/yyyy')
            : '—'}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'interestRate',
    header: 'Interest rate',
    size: 100,
    minSize: 100,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography
          fontSize={12}
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
        >
          {utils.formatPercent(renderedCellValue as number)}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'totalPayment',
    header: 'Total payment',
    size: 140,
    minSize: 110,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography
          fontSize={12}
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
        >
          {utils.formatDollar(renderedCellValue as number)}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'defaultRate',
    header: 'Default rate',
    size: 140,
    minSize: 110,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography
          fontSize={12}
          sx={{
            ...ellipsisStyle,
            width: '100%',
          }}
        >
          {utils.formatPercent(renderedCellValue as number)}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'estClosingDate',
    header: 'Origination date',
    size: 140,
    minSize: 110,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography fontSize={12} sx={{ ...ellipsisStyle }}>
          {typeof renderedCellValue === 'string' &&
          isValid(new Date(renderedCellValue))
            ? format(new Date(renderedCellValue), 'MM/dd/yyyy')
            : '—'}
        </Typography>
      );
    },
  },
];

export const transferOrderColumns = (
  columns: (MRT_ColumnDef<any> & {
    sort: number;
    visibility: boolean;
    size: number;
  })[],
) => {
  return columns.map((item, index) => ({
    field: item.accessorKey as string,
    headerName: item.header,
    columnWidth: item.size,
    sort: index,
    visibility: item?.visibility ?? true,
    pinType: 'CENTER' as ColumnPiningDirectionEnum,
    leftOrder: null,
  }));
};

export const resortColumns = (
  orderColumns: IOrderColumnsItem[],
  columns: MRT_ColumnDef<any>[],
) => {
  const notInOrderColumns: (MRT_ColumnDef<any> & {
    visibility: boolean | null;
    sort: number;
  })[] = [];
  const inOrderColumns: (MRT_ColumnDef<any> & {
    visibility: boolean | null;
    sort: number;
  })[] = [];
  columns.forEach((item, index) => {
    const target = orderColumns.find(
      (column) => column.field === item.accessorKey,
    );
    if (target) {
      inOrderColumns.push({
        ...item,
        visibility: target.visibility,
        size: target.columnWidth || item.size,
        sort: target.sort,
      });
    } else {
      notInOrderColumns.push({ ...item, visibility: true, sort: 100 + index });
    }
  });

  return [...notInOrderColumns, ...inOrderColumns]
    .filter((item) => item.visibility !== false)
    .sort((a, b) => a.sort - b.sort);
};

export const transferOrderColumnsKeys = (columns: IOrderColumnsItem[]) => {
  return columns
    .filter((item: IOrderColumnsItem) => item.visibility)
    .map((item: IOrderColumnsItem) => item.field);
};

export const combineColumns = (
  defaultColumns: MRT_ColumnDef<any>[],
  configColumns: IOrderColumnsItem[],
): (MRT_ColumnDef<any> & {
  sort: number;
  visibility: boolean;
  size: number;
})[] => {
  const result = configColumns?.length
    ? defaultColumns
        .map((item, index) => {
          const target = configColumns?.find(
            (j) => j.field === item.accessorKey,
          );
          return {
            ...item,
            sort: target?.sort ?? 100 + index,
            visibility: target?.visibility ?? true,
            size: (target?.columnWidth ?? item.size) as number,
          };
        })
        .sort((a, b) => {
          return a.sort - b.sort;
        })
    : // .filter((item) => (item as any)?.visibility !== false)
      defaultColumns.map((item, index) => ({
        ...item,
        visibility: true,
        size: item.size ?? 100,
        sort: index,
      }));
  return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
};

export const defaultColumnPining = (configColumns: IOrderColumnsItem[]) => {
  return configColumns?.length
    ? {
        left: configColumns
          .filter(
            (item) =>
              item.pinType === ColumnPiningDirectionEnum.left &&
              item.visibility,
          )
          .sort((a, b) => (a.leftOrder as number) - (b.leftOrder as number))
          .map((item) => item.field),
      }
    : {
        left: [],
      };
};

export const transferFirstColumn = (columns: MRT_ColumnDef<any>[]) => {
  return columns.map((item: any, index) => {
    return {
      ...item,
      Cell: (props: any) => {
        const { row } = props;
        if (row.original.servicingLoans) {
          return index === 0 ? (
            <Typography
              fontSize={14}
              fontWeight={600}
              // position={'absolute'}
              sx={{ whiteSpace: 'nowrap', textIndent: 8 }}
              textAlign={'left'}
              width={'100%'}
            >
              {row.original.groupById}
            </Typography>
          ) : null;
        }
        return item.Cell(props);
      },
    };
  });
};

export const groupCommonColumns: MRT_ColumnDef<any>[] =
  transferFirstColumn(commonColumns);

export const delinquentColumns: MRT_ColumnDef<any>[] = transferFirstColumn(
  [
    {
      accessorKey: 'diffDays',
      header: 'Days delinquent',
      size: 150,
      minSize: 150,
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
      Cell: ({ renderedCellValue }) => {
        return <StyledDaysDelinquent days={renderedCellValue as number} />;
      },
    } as MRT_ColumnDef<any>,
  ].concat(
    commonColumns.filter((item) => item.accessorKey !== 'repaymentStatus'),
  ),
);
export const maturityColumns = (type: MaturityTimeRangeEnum) => {
  return transferFirstColumn(
    [
      {
        accessorKey: 'diffDays',
        header:
          type === MaturityTimeRangeEnum.ALREADY_END
            ? 'Days past maturity'
            : 'Days until maturity',
        size: 150,
        minSize: 150,
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableHeadCellProps: {
          align: 'center',
        },
        Cell: ({ renderedCellValue }) => {
          return (
            <StyledDaysMaturity
              days={renderedCellValue as number}
              type={type as MaturityTimeRangeEnum}
            />
          );
        },
      } as MRT_ColumnDef<any>,
    ].concat(
      commonColumns.filter((item) => item.accessorKey !== 'repaymentStatus'),
    ),
  );
};
