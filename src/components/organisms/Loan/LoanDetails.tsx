import { StyledButton, StyledTabs } from '@/components/atoms';

import { Layout, LoanDetailsCard, SideMenu } from '@/components/molecules';
import { Box, Stack, Typography } from '@mui/material';
import { FC } from 'react';

export const LoanDetails: FC = () => {
  const loanDetails = {
    'Product category': '',
    'Stabilized Bridge': '',
    'Loan purpose': '',
    Purchase: '',
    'Purchase price': '',
    'Purchase loan amount': '',
    'Total loan amount': '',
    'Loan to value': '',
    'Interest rate': '',
    'Loan term': '',
    'Monthly payment': '',
    'As-is property value': '',
    'Loan number': '',
    'Extension option': '',
    'Loan submission date': '',
    'Lien position': '',
    'Est. closing date': '',
    'Select prepayment penalty type': '',
    'Interest reserve amount (months)': '',
    'Interest reserve amount': '',
  };
  const propertyDetails = {
    'Property type': '',
    'Number of unit': '',
    'Property address': '',
    'Apt / Unit': '',
    City: '',
    State: '',
    'Zip code': '',
  };
  const borrowerDetails = {
    Type: '',
    Address: '',
    'Apt Unit': '',
    City: '',
    'Zip code': '',
    'First name': '',
    'Last name': '',
    Email: '',
    Phone: '',
    'Social security number': '',
    Gender: '',
    'Date of birth': '',
    'Residency status': '',
    'Marital status': '',
    'Delinquent times': '',
    'Bankruptcy filing date': '',
    'Property foreclosure filing date': '',
  };

  const lenderDetails = {
    'Lender Name': '',
    ' Name (Authorized Signatory)': '',
    'Lender Entity Type': '',
    'Title (Authorized Signatory)': '',
    'Lender Formation State': '',
    'Twentynine Palms': '',
    'Phone number': '',
    Address: '',
    Email: '',
    City: '',
    'Apt / Unit': '',
    State: '',
    'Zip Code': '',
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
      content: <LoanDetailsCard data={loanDetails} title={'Loan details'} />,
    },
    {
      label: 'Borrower',
      content: (
        <LoanDetailsCard data={borrowerDetails} title={'Borrower details'} />
      ),
    },
    {
      label: 'Lender',
      content: (
        <LoanDetailsCard data={lenderDetails} title={'Lender details'} />
      ),
    },
  ];
  return (
    <Layout isHomepage={false} isInside={true} sideMenu={<SideMenu />}>
      <Stack spacing={6}>
        <Stack spacing={1.5}>
          <Stack
            alignItems={'center'}
            direction={'row'}
            justifyContent={'space-between'}
          >
            <Typography variant={'h6'}>
              8639 West Wing Drive
              <br />
              Elk Grove, CA 95758
            </Typography>
            <StyledButton>Activate</StyledButton>
          </Stack>
          <Box
            bgcolor={'success.main'}
            borderRadius={1}
            color={'text.white'}
            display={'block'}
            fontSize={12}
            fontWeight={600}
            lineHeight={1}
            py={0.5}
            textAlign={'center'}
            width={80}
          >
            Performing
          </Box>
        </Stack>
        <StyledTabs tabsData={tabs} />
      </Stack>
    </Layout>
  );
};
