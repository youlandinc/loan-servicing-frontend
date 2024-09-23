import { StyledHeaderAddressInfo, StyledTabs } from '@/components/atoms';
import { Layout, LoanDetailsCard, SideMenu } from '@/components/molecules';
import {
  BorrowerTypeOpt,
  EstFICOScoreOpt,
  LoanPurposeOpt,
  ProductCategoryOpt,
  PropertyTypeOpt,
} from '@/constant';

import { _getLoanDetails } from '@/request';
import {
  BorrowerTypeEnum,
  LoanDetailsPurposeEnum as LoanPurposeEnum,
  ProductCategoryEnum,
} from '@/types/enum';
import { IBorrowerInfo } from '@/types/loan/details';
import { utils } from '@/utils';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useAsync } from 'react-use';

const wrapper = (val: unknown, formatFn: (val: any) => unknown) => {
  if (val === '' || val === null || val === undefined) {
    return 'N/A';
  }
  return formatFn(val);
};

export const LoanDetails: FC = () => {
  const router = useRouter();
  const { loanId } = router.query;
  const { value } = useAsync(async () => {
    return typeof loanId === 'string'
      ? await _getLoanDetails(parseInt(loanId as string) as number)
      : null;
  }, [loanId]);

  const borrowerInfo = value?.data?.borrowerInfo;
  const loanDetail = value?.data?.loanDetail;
  const propertyDetail = value?.data?.propertyDetails;
  const brokerDetail = value?.data?.brokerDetail;
  const investorName = value?.data?.investor;
  const address = value?.data?.propertyFullAddress;
  const loanNumber = value?.data?.systemLoanNumber;
  const status = value?.data?.repaymentStatusEnum;

  const loanCommonField = {
    'Product category': ProductCategoryOpt.find(
      (item) => item.value === loanDetail?.productCategory,
    )?.label,
    'Loan purpose': LoanPurposeOpt.find(
      (item) => item.value === loanDetail?.loanPurpose,
    )?.label,
    'Est. FICO score': EstFICOScoreOpt.find(
      (item) => item.value === loanDetail?.ficoScore,
    )?.label,
    Liquidity: wrapper(loanDetail?.liquidityAmount, utils.formatDollar),
  };
  const stabilizedBridgePurchase = {
    ...loanCommonField,
    'Purchase price': wrapper(loanDetail?.purchasePrice, utils.formatDollar),
    'Purchase loan amount': wrapper(
      loanDetail?.purchaseLoanAmount,
      utils.formatDollar,
    ),
    'Total loan amount': wrapper(
      loanDetail?.totalLoanAmount,
      utils.formatDollar,
    ),
    'Loan to value': wrapper(loanDetail?.loanValue / 100, utils.formatPercent),
    'Interest rate': wrapper(
      (loanDetail?.interestRate ?? 0) / 100,
      utils.formatPercent,
    ),
    Term: (loanDetail?.loanTerm ?? 0) + ' Months',
    'Monthly payment': wrapper(loanDetail?.monthlyPayment, utils.formatDollar),
    'As-is property value': wrapper(
      loanDetail?.propertyValue,
      utils.formatDollar,
    ),
    'System loan ID': loanDetail?.loanNumber,
    'Loan number': loanDetail?.bizLoanNumber,
    'Extension option': loanDetail?.extensionOption,
    'Loan submission date': utils.formatDate(
      loanDetail?.loanSubmissionDate,
      'MM/dd/yyyy',
    ),
    'Lien position': loanDetail?.lienPosition,
    'Est. closing date': utils.formatDate(
      loanDetail?.estClosingDate,
      'MM/dd/yyyy',
    ),
    'Document date': utils.formatDate(loanDetail?.documentDate, 'MM/dd/yyyy'),
    'Prepayment penalty': loanDetail?.selectPrepaymentPenaltyType,
    'Interest reserve amount (months)': loanDetail?.interestReserveAmountMonth,
    'Interest reserve amount': wrapper(
      loanDetail?.interestReserveAmount,
      utils.formatDollar,
    ),
  };
  const stabilizedBridgeRefinance = {
    ...loanCommonField,
    'As-is property value': wrapper(
      loanDetail?.estimatedPropertyValue,
      utils.formatDollar,
    ),
    'Refinance loan amount': wrapper(
      loanDetail?.remainingLoanBalance,
      utils.formatDollar,
    ),
    'Payoff amount': wrapper(loanDetail?.payoffAmount, utils.formatDollar),
    'Cash-out amount': wrapper(loanDetail?.cashOutAmount, utils.formatDollar),
    'Total loan amount': wrapper(
      loanDetail?.totalLoanAmount,
      utils.formatDollar,
    ),
    'Loan to value': wrapper(loanDetail?.loanValue / 100, utils.formatPercent),
    'Interest rate': wrapper(
      (loanDetail?.interestRate ?? 0) / 100,
      utils.formatPercent,
    ),
    'Monthly payment': wrapper(loanDetail?.monthlyPayment, utils.formatDollar),
    Term: (loanDetail?.loanTerm ?? 0) + ' Months',
    'Loan number': loanDetail?.loanNumber,
    'Extension option': loanDetail?.extensionOption,
    'Loan submission date': utils.formatDate(
      loanDetail?.loanSubmissionDate,
      'MM/dd/yyyy',
    ),
    'Lien position': loanDetail?.lienPosition,
    'Est. closing date': utils.formatDate(
      loanDetail?.estClosingDate,
      'MM/dd/yyyy',
    ),
    'Document date': utils.formatDate(loanDetail?.documentDate, 'MM/dd/yyyy'),
    'Prepayment penalty': loanDetail?.selectPrepaymentPenaltyType,
    'Interest reserve amount (months)': loanDetail?.interestReserveAmountMonth,
    'Interest reserve amount': wrapper(
      loanDetail?.interestReserveAmount,
      utils.formatDollar,
    ),
    'Do you plan to occupy the property?':
      typeof loanDetail?.isOccupyProperty === 'boolean' &&
      loanDetail?.isOccupyProperty
        ? 'Yes'
        : 'No',
  };
  const fixAndFlipPurchase = {
    ...loanCommonField,
    'Purchase price': wrapper(loanDetail?.purchasePrice, utils.formatDollar),
    'Purchase loan amount': wrapper(
      loanDetail?.purchaseLoanAmount,
      utils.formatDollar,
    ),
    'Rehab cost': wrapper(loanDetail?.rehabAmount, utils.formatDollar),
    'Total loan amount': wrapper(
      loanDetail?.totalLoanAmount,
      utils.formatDollar,
    ),
    'Loan to value': wrapper(loanDetail?.loanValue / 100, utils.formatPercent),
    'Loan to cost': wrapper(loanDetail?.loanCost / 100, utils.formatPercent),
    'Interest rate': wrapper(
      (loanDetail?.interestRate ?? 0) / 100,
      utils.formatPercent,
    ),
    Term: (loanDetail?.loanTerm ?? 0) + ' Months',
    'ARV (after repair value)': wrapper(loanDetail?.arv, utils.formatDollar),
    'Monthly payment': wrapper(loanDetail?.monthlyPayment, utils.formatDollar),
    'ARLTV (after repair loan to value)': wrapper(
      loanDetail?.arltv / 100,
      utils.formatPercent,
    ),
    'As-is property value': wrapper(
      loanDetail?.propertyValue,
      utils.formatDollar,
    ),
    'Loan number': loanDetail?.loanNumber,
    'Extension option': loanDetail?.extensionOption,
    'Loan submission date': utils.formatDate(
      loanDetail?.loanSubmissionDate,
      'MM/dd/yyyy',
    ),
    'Lien position': loanDetail?.lienPosition,
    'Est. closing date': utils.formatDate(
      loanDetail?.estClosingDate,
      'MM/dd/yyyy',
    ),
    'Document date': utils.formatDate(loanDetail?.documentDate, 'MM/dd/yyyy'),
    'Prepayment penalty': loanDetail?.selectPrepaymentPenaltyType,
    'Interest reserve amount (months)': loanDetail?.interestReserveAmountMonth,
    'Interest reserve amount': wrapper(
      loanDetail?.interestReserveAmount ?? 0,
      utils.formatDollar,
    ),
    'Rehab completion date': utils.formatDate(
      loanDetail?.rehabCompletionDate,
      'MM/dd/yyyy',
    ),
  };
  const fixAndFlipRefinance = {
    ...loanCommonField,
    'As-is property value': wrapper(
      loanDetail?.estimatedPropertyValue ?? 0,
      utils.formatDollar,
    ),
    'Payoff amount': wrapper(
      loanDetail?.remainingLoanBalance,
      utils.formatDollar,
    ),
    'Rehab cost': wrapper(loanDetail?.rehabAmount, utils.formatDollar),
    'Cash-out amount': wrapper(loanDetail?.cashOutAmount, utils.formatDollar),
    'Total loan amount': wrapper(
      loanDetail?.totalLoanAmount,
      utils.formatDollar,
    ),
    'Loan to cost': wrapper(loanDetail?.loanCost / 100, utils.formatPercent),
    'Loan to value': wrapper(loanDetail?.loanValue / 100, utils.formatPercent),
    'Interest rate': wrapper(
      (loanDetail?.interestRate ?? 0) / 100,
      utils.formatPercent,
    ),
    'Monthly payment': wrapper(loanDetail?.monthlyPayment, utils.formatDollar),
    Term: (loanDetail?.loanTerm ?? 0) + ' Months',
    'ARV (after repair value)': wrapper(loanDetail?.arv, utils.formatDollar),
    'Loan number': loanDetail?.loanNumber,
    'ARLTV (after repair loan to value)': wrapper(
      loanDetail?.arltv / 100,
      utils.formatPercent,
    ),
    'Extension option': loanDetail?.extensionOption,
    'Loan submission date': utils.formatDate(
      loanDetail?.loanSubmissionDate,
      'MM/dd/yyyy',
    ),
    'Lien position': loanDetail?.lienPosition,
    'Est. closing date': utils.formatDate(
      loanDetail?.estClosingDate,
      'MM/dd/yyyy',
    ),
    'Document date': utils.formatDate(loanDetail?.documentDate, 'MM/dd/yyyy'),
    'Prepayment penalty': loanDetail?.selectPrepaymentPenaltyType,
    'Interest reserve amount (months)': loanDetail?.interestReserveAmountMonth,
    'Interest reserve amount': wrapper(
      loanDetail?.interestReserveAmount,
      utils.formatDollar,
    ),
    'Rehab completion date': utils.formatDate(
      loanDetail?.rehabCompletionDate,
      'MM/dd/yyyy',
    ),

    'Exit strategy': loanDetail?.exitStrategy,
    'Do you plan to occupy the property?':
      typeof loanDetail?.isOccupyProperty === 'boolean' &&
      loanDetail?.isOccupyProperty
        ? 'Yes'
        : 'No',
  };

  const loanDetailsInfo = () => {
    if (
      loanDetail?.loanPurpose === LoanPurposeEnum.purchase &&
      loanDetail?.productCategory === ProductCategoryEnum.bridge
    ) {
      return stabilizedBridgePurchase;
    }
    if (
      loanDetail?.loanPurpose === LoanPurposeEnum.refinance &&
      loanDetail?.productCategory === ProductCategoryEnum.bridge
    ) {
      return stabilizedBridgeRefinance;
    }
    if (
      loanDetail?.loanPurpose === LoanPurposeEnum.purchase &&
      loanDetail?.productCategory === ProductCategoryEnum.fix
    ) {
      return fixAndFlipPurchase;
    }
    if (
      loanDetail?.loanPurpose === LoanPurposeEnum.refinance &&
      loanDetail?.productCategory === ProductCategoryEnum.fix
    ) {
      return fixAndFlipRefinance;
    }
    return loanCommonField;
  };
  const propertyDetails = {
    'Property type': PropertyTypeOpt.find(
      (item) => item.value === propertyDetail?.propertyType,
    )?.label,
    'Property address': propertyDetail?.propertyAddress,
    'Apt / Unit': propertyDetail?.propertyAptUnit,
    City: propertyDetail?.propertyCity,
    State: propertyDetail?.propertyState,
    'Zip code': propertyDetail?.propertyZipCode,
  };
  const borrowerDetails: Record<string, any> = Array.isArray(
    borrowerInfo?.borrowers,
  )
    ? (borrowerInfo as IBorrowerInfo).borrowers.reduce((pre, cur, index) => {
        const common = {
          Type: cur?.borrowerType,
          Address: cur?.addressInfo?.address,
          'Apt / Unit': cur?.addressInfo?.aptNumber,
          City: cur?.addressInfo?.city,
          State: cur?.addressInfo?.state,
          'Zip code': cur?.addressInfo?.postcode,
          'First name': cur?.firstName,
          'Last name': cur?.lastName,
          Email: cur?.email,
          Phone: utils.formatPhoneNumber(cur?.phone),
          'Social security number': utils
            .formatSsn(cur?.ssn)
            .replace(/^(\d{3})-(\d{2})-/, 'XXX-XX-'),
          Gender: cur?.gender,
          'Date of birth': utils.formatDate(cur?.birthDay, 'MM/dd/yyyy'),
          'Residency status': cur?.residencyStatus,
          'Marital status': cur?.maritalStatus,
          'Delinquent times': cur?.delinquentTimes,
          'Bankruptcy filing date': utils.formatDate(
            cur?.bankruptcyEvent,
            'MM/dd/yyyy',
          ),
          'Property foreclosure filing date': utils.formatDate(
            cur?.propertyForeclosureDate,
            'MM/dd/yyyy',
          ),
        };
        const entity = {
          Type: cur?.borrowerType,
          'Entity type': cur?.entityType,
          [BorrowerTypeOpt.find((item) => item.value === cur?.borrowerType)
            ?.label as string]: cur?.entityName,
          'Secretary of state ID': cur?.secretaryStateId,
          'Formation state': cur?.formationState,
          Guarantor: 'Guarantor',
          'Authorized signatory title': cur?.authorizedSignatoryTitle,
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { 'Entity Type': entityType, ...rest } = entity;
        const individual = null,
          individualInfo = Object.assign(common, individual),
          entityInfo = Object.assign(entity, common),
          trustInfo = Object.assign(rest, common);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pre[`${index === 0 ? 'Borrower' : 'Co-borrower'} details`] =
          typeof common.Type === 'string'
            ? common.Type === BorrowerTypeEnum.INDIVIDUAL
              ? individualInfo
              : common.Type === BorrowerTypeEnum.ENTITY
                ? entityInfo
                : trustInfo
            : common;

        return pre;
      }, {})
    : [];

  const investorDetails = {
    'Investor name': investorName,
  };

  const brokerDetailInfo = {
    'Broker company name': brokerDetail?.name,
    Email: brokerDetail?.email,
    'Phone number': wrapper(brokerDetail?.phone, utils.formatPhoneNumber),
    'Mailing address': brokerDetail?.address?.address,
    'Apt / Unit': brokerDetail?.address?.aptNumber,
    City: brokerDetail?.address?.city,
    State: brokerDetail?.address?.state,
    'Zip code': brokerDetail?.address?.postcode,
  };
  const referringBroker =
    Array.isArray(brokerDetail?.referringBrokers) &&
    brokerDetail!.referringBrokers.length
      ? brokerDetail!.referringBrokers[0]
      : null;
  const referringBrokerDetailInfo = {
    'Company name': referringBroker?.companyName,
    Email: referringBroker?.email,
    'Phone number': wrapper(referringBroker?.phone, utils.formatPhoneNumber),
    'Mailing address': referringBroker?.address?.address,
    'Apt / Unit': referringBroker?.address?.aptNumber,
    City: referringBroker?.address?.city,
    State: referringBroker?.address?.state,
    'Zip code': referringBroker?.address?.postcode,
  };

  const tabs = [
    {
      label: 'Property',
      content: (
        <LoanDetailsCard data={propertyDetails} title={'Property details'} />
      ),
    },
    {
      label: 'Loan',
      content: (
        <LoanDetailsCard data={loanDetailsInfo()} title={'Loan details'} />
      ),
    },
    {
      label: 'Borrower',
      content: (
        <Stack gap={3}>
          {Object.keys(borrowerDetails).map((key, index) => (
            <LoanDetailsCard
              data={borrowerDetails[key]}
              key={index}
              title={key}
            />
          ))}
        </Stack>
      ),
    },
    {
      label: 'Third-party details',
      content: (
        <Stack gap={3}>
          <LoanDetailsCard
            data={brokerDetailInfo}
            title={'Third-party agent details'}
          />
          {brokerDetail?.hasReferringBroker && (
            <LoanDetailsCard
              data={referringBrokerDetailInfo}
              title={'Referring broker details'}
            />
          )}
        </Stack>
      ),
    },
    {
      label: 'Investor',
      content: (
        <LoanDetailsCard data={investorDetails} title={'Investor details'} />
      ),
    },
  ];
  return (
    <Layout isHomepage={false} sideMenu={<SideMenu />}>
      <Box overflow={'auto'}>
        <Stack direction={'row'} justifyContent={'center'} p={6}>
          <Stack maxWidth={1276} spacing={3} width={'100%'}>
            <StyledHeaderAddressInfo
              address={address}
              loanNumber={loanNumber}
              status={status}
            />
            <StyledTabs tabsData={tabs} />
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
};
