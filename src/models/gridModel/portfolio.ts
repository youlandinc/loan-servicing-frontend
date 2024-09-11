import { types } from 'mobx-state-tree';

import { allLoansGridQueryModel } from '@/models/gridModel/allLoansGridModel';
import { PortfolioGridTypeEnum } from '@/types/enum';

export const portfolioModel = types
  .model({
    displayType: types.enumeration(Object.values(PortfolioGridTypeEnum)),
    allLoansGridQueryModel: allLoansGridQueryModel,
    investorGridQueryModel: allLoansGridQueryModel,
    delinquentGridQueryModel: allLoansGridQueryModel,
    maturityGridQueryModel: allLoansGridQueryModel,
  })
  .actions((self) => ({
    updateDisplayType(type: PortfolioGridTypeEnum) {
      self.displayType = type;
    },
  }));
