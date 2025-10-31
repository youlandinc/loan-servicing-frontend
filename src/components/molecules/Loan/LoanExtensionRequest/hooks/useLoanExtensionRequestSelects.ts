import { useCallback, useState } from 'react';

import { AxiosResponse } from 'axios';

import { Address, IAddress } from '@/models/common';

import {
  ExtensionPaidTypeEnum,
  LoanAnswerEnum,
  MaturityDateTypeEnum,
} from '@/types/enum';
import { IExtensionInfo } from '@/types/loan/extension';

// filter relevant configurations
export const useLoanExtensionRequestSelects = () => {
  const [maturityDate, setMaturityDate] = useState(
    MaturityDateTypeEnum.EXTEND_3,
  );
  const [paidType, setPaidType] = useState(ExtensionPaidTypeEnum.Upfront);
  const [extensionFee, setExtensionFee] = useState(1);
  const [changeRateShow, setChangeRateShow] = useState<LoanAnswerEnum>(
    LoanAnswerEnum.no,
  );
  const [changeRate, setChangeRate] = useState(12);
  const [executionDate, setExtensionDate] = useState<Date | null>(new Date());
  const [borrowerName, setBorrowerName] = useState('');
  const [promissoryNoteDate, setPromissoryNoteDate] = useState<Date | null>(
    new Date(),
  );
  const [address] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  // Based on the res recharge filter options
  const resetFilter = useCallback(
    (res: AxiosResponse<IExtensionInfo, any>) => {
      const {
        address: resAddress,
        aptNumber,
        borrowerName,
        changeInterestRate,
        city,
        executionDate,
        extendMonth,
        extensionFee,
        isChangeInterestRate,
        paymentTiming,
        promissoryNoteDate,
        state,
        zipCode,
      } = res.data;
      setMaturityDate(extendMonth);
      setPaidType(paymentTiming);
      setExtensionFee(extensionFee);
      setChangeRateShow(isChangeInterestRate);
      setChangeRate(changeInterestRate);
      setExtensionDate(new Date(executionDate));
      setBorrowerName(borrowerName);
      address.injectServerData({
        address: resAddress,
        aptNumber,
        city,
        state,
        postcode: zipCode,
      });
      setPromissoryNoteDate(new Date(promissoryNoteDate));
    },
    [address],
  );

  return {
    maturityDate,
    setMaturityDate,
    paidType,
    setPaidType,
    extensionFee,
    setExtensionFee,
    changeRateShow,
    setChangeRateShow,
    changeRate,
    setChangeRate,
    executionDate,
    setExtensionDate,
    borrowerName,
    setBorrowerName,
    promissoryNoteDate,
    setPromissoryNoteDate,
    address,
    resetFilter,
  };
};
