import { types } from 'mobx-state-tree';

import { allLoansModel } from '@/models/gridModel/allLoansModel/allLoansModel';

import { PortfolioGridTypeEnum } from '@/types/enum';

export const portfolioModel = types
  .model({
    displayType: types.enumeration(Object.values(PortfolioGridTypeEnum)),
    allLoansGridModel: allLoansModel,
    investorGridModel: allLoansModel,
    delinquentGridModel: allLoansModel,
    maturityGridModel: allLoansModel,
  })
  .actions((self) => ({
    updateDisplayType(type: PortfolioGridTypeEnum) {
      self.displayType = type;
    },
  }));
