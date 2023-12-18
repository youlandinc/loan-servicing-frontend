import { FC, useState } from 'react';
import { Stack } from '@mui/material';
import {
  StyledButton,
  StyledSelect,
  StyledTextFieldInput,
} from '@/components/atoms';
import { GRID_STATUS } from '@/constant/options';
import { LoanStatus } from '@/types/enum';

export const PortfolioGridToolbar: FC = () => {
  const [propertyAddress, setPropertyAddress] = useState('');
  const [loanNumber, setLoanNumber] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [loanStatus, setLoanStatus] = useState('');

  return (
    <Stack flexDirection={'row'} gap={3} p={3}>
      <StyledTextFieldInput
        label={'Property address'}
        onChange={(e) => setPropertyAddress(e.target.value)}
        value={propertyAddress}
        variant={'outlined'}
      />
      <StyledTextFieldInput
        label={'Loan number'}
        onChange={(e) => setLoanNumber(e.target.value)}
        value={loanNumber}
        variant={'outlined'}
      />
      <StyledTextFieldInput
        label={'Borrower name'}
        onChange={(e) => setBorrowerName(e.target.value)}
        value={borrowerName}
        variant={'outlined'}
      />
      <StyledSelect
        id={'PORTFOLIO_GRID_STATUS_SELECT'}
        label={'Status'}
        labelId={'PORTFOLIO_GRID_STATUS_LABEL'}
        onChange={(e) => setLoanStatus(e.target.value as string as LoanStatus)}
        options={GRID_STATUS}
        value={loanStatus}
      />
      <StyledButton
        sx={{ flexShrink: 0, width: '120px !important' }}
        variant={'outlined'}
      >
        Export
      </StyledButton>
    </Stack>
  );
};
