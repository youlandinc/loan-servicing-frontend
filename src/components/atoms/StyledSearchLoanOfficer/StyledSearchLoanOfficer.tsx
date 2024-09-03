import { _getInvestorList } from '@/request/portfolio/allLoans';
import React, { FC } from 'react';
import { enqueueSnackbar } from 'notistack';

import { StyledBtnLoanOfficer } from './StyledBtnLoanOfficer';
import { useSwitch } from '@/hooks';
import { useAsyncFn } from 'react-use';

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
