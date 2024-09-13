import { StyledDaysDelinquent, StyledDaysMaturity } from '@/components/atoms';
import { StyledLoanStatus } from '@/components/atoms/StyledLoanStatus';
import { PIPELINE_STATUS } from '@/constant';
import { MaturityTimeRangeEnum, PipelineStatusEnum } from '@/types/enum';
import { Box, Tooltip, Typography } from '@mui/material';
import { format, isValid } from 'date-fns';
import { MRT_ColumnDef } from 'material-react-table';

import { ellipsisStyle } from '@/styles';
import { utils } from '@/utils';
import React from 'react';

export const commonColumns: MRT_ColumnDef<any>[] = [
  {
    accessorKey: 'loanNumber',
    header: 'Loan number',
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
    minSize: 150,
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
    accessorKey: 'fciMaturityDate',
    header: 'Maturity date',
    size: 140,
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
    accessorKey: 'principalBalance',
    header: 'Principal balance',
    size: 140,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Tooltip title={utils.formatDollar(renderedCellValue as number, 0)}>
          <Typography
            fontSize={12}
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
          >
            {utils.formatDollar(renderedCellValue as number, 0)}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'currentBalance',
    header: 'Current balance',
    size: 140,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Tooltip title={utils.formatDollar(renderedCellValue as number)}>
          <Typography
            fontSize={12}
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
          >
            {utils.formatDollar(renderedCellValue as number, 0)}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'nextDueDate',
    header: 'Next due date',
    size: 140,
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
    size: 140,
    muiTableBodyCellProps: {
      align: 'center',
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
            {utils.formatPercent((renderedCellValue as number) / 100)}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'totalPayment',
    header: 'Total payment',
    size: 140,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Tooltip title={utils.formatDollar(renderedCellValue as number, 0)}>
          <Typography
            fontSize={12}
            sx={{
              ...ellipsisStyle,
              width: '100%',
            }}
          >
            {utils.formatDollar(renderedCellValue as number, 0)}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'defaultRate',
    header: 'Default rate',
    size: 140,
    muiTableBodyCellProps: {
      align: 'center',
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
            {utils.formatPercent((renderedCellValue as number) / 100)}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'originationDate',
    header: 'Origination date',
    size: 140,
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

  /* {
    accessorKey: ColumnIdEnum.city,
    header: ColumnHeaderMap[ColumnIdEnum.city],
    size: 130,
    enableHiding: true,
    Cell: ({ row: { original } }) => (
      <Tooltip title={original.propertyDetail?.address?.city || ''}>
        <Typography
          sx={{
            fontSize: 14,
            width: '100%',
            ...ellipsisStyle,
          }}
        >
          {original.propertyDetail?.address?.city || '—'}
        </Typography>{' '}
      </Tooltip>
    ),
  },
  {
    accessorKey: ColumnIdEnum.postcode,
    header: ColumnHeaderMap[ColumnIdEnum.postcode],
    size: 100,
    muiTableBodyCellProps: {
      align: 'center',
    },
    Cell: ({ row: { original } }) => (
      <Tooltip title={original.propertyDetail?.address?.postcode || ''}>
        <>
          <Typography
            sx={{
              ...ellipsisStyle,
              fontSize: 14,
              width: '100%',
            }}
          >
            {original.propertyDetail?.address?.postcode || '—'}
          </Typography>{' '}
        </>
      </Tooltip>
    ),
  },
  {
    accessorKey: ColumnIdEnum.state,
    header: ColumnHeaderMap[ColumnIdEnum.state],
    size: 80,
    muiTableBodyCellProps: {
      align: 'center',
    },
    Cell: ({ row: { original } }) => (
      <Tooltip title={original.propertyDetail?.address?.state || ''}>
        <>
          <Typography
            sx={{
              fontSize: 14,
              width: '100%',
              ...ellipsisStyle,
            }}
          >
            {original.propertyDetail?.address?.state || '—'}
          </Typography>{' '}
        </>
      </Tooltip>
    ),
  },
  {
    accessorKey: ColumnIdEnum.productCategory,
    header: ColumnHeaderMap[ColumnIdEnum.productCategory],
    size: 200,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(original.productCategory);
    },
  },
  {
    accessorKey: ColumnIdEnum.loanPurpose,
    header: ColumnHeaderMap[ColumnIdEnum.loanPurpose],
    size: 120,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanPurpose === LoanPurposeOpt[1].value &&
          typeof original.cashOutAmount === 'number' &&
          original.cashOutAmount > 0
          ? 'Cashout Refi'
          : original.loanPurpose ?? '—',
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.loanTerm,
    header: ColumnHeaderMap[ColumnIdEnum.loanTerm],
    size: 120,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => renderEmpty(renderedCellValue),
  },
  {
    accessorKey: ColumnIdEnum.interestRate,
    header: ColumnHeaderMap[ColumnIdEnum.interestRate],
    size: 80,
    muiTableBodyCellProps: {
      align: 'center',
    },
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.interestRate,
        formatPercent(original.interestRate, 2),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.purchasePrice,
    header: ColumnHeaderMap[ColumnIdEnum.purchasePrice],
    size: 130,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.purchasePrice,
        formatDollar(original.purchasePrice, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.remainingLoanBalance,
    header: ColumnHeaderMap[ColumnIdEnum.remainingLoanBalance],
    size: 130,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanDetail?.loanPurpose === LoanPurposeOpt[0].value
          ? null
          : original.remainingLoanBalance,
        formatDollar(original.remainingLoanBalance, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.totalLoanAmount,
    header: ColumnHeaderMap[ColumnIdEnum.totalLoanAmount],
    size: 160,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.totalLoanAmount,
        formatDollar(original.totalLoanAmount, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.cashOutAmount,
    header: ColumnHeaderMap[ColumnIdEnum.cashOutAmount],
    size: 120,

    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanDetail?.loanPurpose === LoanPurposeOpt[0].value
          ? null
          : original.cashOutAmount,
        formatDollar(original.cashOutAmount, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.rehabAmount,
    header: ColumnHeaderMap[ColumnIdEnum.rehabAmount],
    size: 170,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanDetail?.productCategory === ProductCategoryOpt[0].value
          ? null
          : original.rehabAmount,
        formatDollar(original.rehabAmount, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.loanValue,
    header: ColumnHeaderMap[ColumnIdEnum.loanValue],
    muiTableBodyCellProps: {
      align: 'center',
    },
    size: 100,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanValue,
        formatPercent(original.loanValue, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.loanCost,
    header: ColumnHeaderMap[ColumnIdEnum.loanCost],
    size: 110,
    muiTableBodyCellProps: {
      align: 'center',
    },
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanDetail?.productCategory === ProductCategoryOpt[0].value
          ? null
          : original.loanCost,
        formatPercent(original.loanCost, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.arv,
    header: ColumnHeaderMap[ColumnIdEnum.arv],
    size: 120,

    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanDetail?.productCategory === ProductCategoryOpt[0].value
          ? null
          : original.arv,
        formatDollar(original.arv, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.arltv,
    header: ColumnHeaderMap[ColumnIdEnum.arltv],
    size: 70,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.loanDetail?.productCategory === ProductCategoryOpt[0].value
          ? null
          : original.arltv,
        formatPercent(original.arltv, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.lenderOriginationFee,
    header: ColumnHeaderMap[ColumnIdEnum.lenderOriginationFee],
    muiTableBodyCellProps: {
      align: 'center',
    },
    size: 180,
    Cell: ({ row: { original } }) => {
      const { totalLoanAmount, lenderOriginationFee } = original;
      return (
        <Typography
          sx={{
            fontSize: 14,
            width: '100%',
            pl: 0.5,
            ...ellipsisStyle,
          }}
        >
          {totalLoanAmount && lenderOriginationFee
            ? `${formatPercent(lenderOriginationFee, 2)} `
            : formatPercent(lenderOriginationFee, 2)}
        </Typography>
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.lenderProcessingFee,
    header: ColumnHeaderMap[ColumnIdEnum.lenderProcessingFee],
    size: 150,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.lenderProcessingFee,
        formatDollar(original.lenderProcessingFee, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.brokerOriginationFee,
    header: ColumnHeaderMap[ColumnIdEnum.brokerOriginationFee],
    muiTableBodyCellProps: {
      align: 'center',
    },
    size: 200,
    Cell: ({ row: { original } }) => {
      const { totalLoanAmount, brokerOriginationFee } = original;
      return (
        <Typography
          sx={{
            fontSize: 14,
            width: '100%',
            pl: 0.5,
          }}
        >
          {totalLoanAmount && brokerOriginationFee
            ? `${formatPercent(brokerOriginationFee, 1)} `
            : !brokerOriginationFee
              ? '—'
              : formatPercent(brokerOriginationFee, 1)}
        </Typography>
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.brokerProcessingFee,
    header: ColumnHeaderMap[ColumnIdEnum.brokerProcessingFee],
    size: 185,
    Cell: ({ row: { original } }) => {
      return PaddingWrapper(
        original.brokerProcessingFee,
        formatDollar(original.brokerProcessingFee, 0),
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.estClosingDate,
    header: ColumnHeaderMap[ColumnIdEnum.estClosingDate],
    size: 180,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography sx={{ ...ellipsisStyle }} variant={'subtitle1'}>
          {typeof renderedCellValue === 'string' &&
          dayjs(new Date(renderedCellValue)).isValid()
            ? format(new Date(renderedCellValue), 'MM/dd/yyyy')
            : '—'}
        </Typography>
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.broker,
    header: ColumnHeaderMap[ColumnIdEnum.broker],
    size: 150,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ row: { original } }) => {
      const [loanOfficerFirstName, loanOfficerLastName] = (
        original.broker || ''
      )
        .trim()
        .split(' ');

      const { avatarName, avatarUrl } = handleAvatar(
        loanOfficerFirstName,
        loanOfficerLastName,
        original.brokerAvatar,
      );
      return (
        <>
          {avatarName ? (
            <Tooltip arrow title={original.broker}>
              <Avatar
                // alt={avatarName}
                src={avatarUrl}
                sx={{
                  bgcolor:
                    original.brokerBackgroundColor ||
                    DEFAULT_AVATAR_BACKGROUND_COLOR,
                  width: 24,
                  height: 24,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {avatarName}
              </Avatar>
            </Tooltip>
          ) : original.source === LoanType.POS ? (
            'N/A'
          ) : (
            '-'
          )}
        </>
      );
    },
  },
  {
    accessorKey: ColumnIdEnum.channel,
    header: ColumnHeaderMap[ColumnIdEnum.channel],
    size: 150,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => (
      <Tooltip title={renderedCellValue ?? '—'}>
        <Typography
          fontSize={14}
          fontWeight={renderedCellValue ? 600 : 400}
          maxWidth={150}
          sx={{ ...ellipsisStyle }}
        >
          {renderedCellValue ?? '—'}
        </Typography>
      </Tooltip>
    ),
  },
  {
    accessorKey: ColumnIdEnum.createdAt,
    header: ColumnHeaderMap[ColumnIdEnum.createdAt],
    size: 180,
    muiTableBodyCellProps: {
      align: 'center',
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    Cell: ({ renderedCellValue }) => {
      return (
        <Typography sx={{ ...ellipsisStyle }} variant={'subtitle1'}>
          {typeof renderedCellValue === 'string' && renderedCellValue !== ''
            ? format(new Date(renderedCellValue), 'MM/dd/yyyy')
            : '—'}
        </Typography>
      );
    },
  },*/
];

const transferFirstColumn = (columns: MRT_ColumnDef<any>[]) => {
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
              position={'absolute'}
              sx={{ whiteSpace: 'nowrap' }}
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
      header: 'Days until maturity',
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
        header: 'Days until maturity',
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
