import React, { FC } from 'react';

import { enqueueSnackbar } from 'notistack';
import { useAsyncFn } from 'react-use';

import { useSwitch } from '@/hooks';

import { _getInvestorList } from '@/request/portfolio/allLoans';

import { StyledBtnLoanOfficer } from './StyledBtnLoanOfficer';

type StyledSearchLoanOfficerProps = {
  handleChange?: (param: any) => void;
  handleClear?: () => void;
  defaultLabel?: string | null;
  value?: string | null;
};

export const StyledSearchLoanOfficer: FC<StyledSearchLoanOfficerProps> = ({
  handleChange,
  handleClear,
  defaultLabel,
  value,
}) => {
  const { open, close, visible } = useSwitch();

  const [fetchState, fetchLoanOfficers] = useAsyncFn(async () => {
    return await _getInvestorList();
  });

  const loanOfficersList = Array.isArray(fetchState?.value?.data)
    ? [...fetchState!.value!.data]
    : [];

  return (
    <>
      <StyledBtnLoanOfficer
        autoCompleteLoading={visible}
        defaultLabel={defaultLabel}
        handleChange={handleChange}
        handleClear={handleClear}
        handleOpen={async () => {
          open();
          await fetchLoanOfficers()
            .then(() => close())
            .catch(({ message, variant, header }) => {
              close();
              enqueueSnackbar(message ?? 'error!', {
                variant,
                isSimple: !header,
                header,
              });
            });
        }}
        loanOfficersList={loanOfficersList as any}
        value={value}
      />
    </>
  );
};
