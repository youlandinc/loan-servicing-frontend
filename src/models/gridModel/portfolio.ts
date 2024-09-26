import { allLoansModel } from '@/models/gridModel/allLoansModel/allLoansModel';
import { PortfolioGridTypeEnum } from '@/types/enum';
import { IAllGridConfig } from '@/types/pipeline';
import { cast, types } from 'mobx-state-tree';

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
    injectConfig(config: IAllGridConfig) {
      try {
        //all loans
        if (config.operaParams?.SERVICING_ALL_LOAN?.SEARCH) {
          self.allLoansGridModel.queryModel = cast(
            config.operaParams.SERVICING_ALL_LOAN.SEARCH,
          );
        }
        if (config.operaParams?.SERVICING_ALL_LOAN?.ALL) {
          self.allLoansGridModel.orderColumns = cast(
            config.operaParams.SERVICING_ALL_LOAN.ALL,
          );
        }
        self.allLoansGridModel.pinLeftColumns = cast(
          config.operaParams.SERVICING_ALL_LOAN.LEFT,
        );
        //investor
        if (config.operaParams?.SERVICING_BY_INVESTOR?.SEARCH) {
          self.investorGridModel.queryModel = cast(
            config.operaParams.SERVICING_BY_INVESTOR.SEARCH,
          );
        }
        if (config.operaParams?.SERVICING_BY_INVESTOR?.ALL) {
          self.investorGridModel.orderColumns = cast(
            config.operaParams.SERVICING_BY_INVESTOR.ALL,
          );
        }
        self.investorGridModel.pinLeftColumns = cast(
          config.operaParams.SERVICING_BY_INVESTOR.LEFT,
        );
        //delinquent
        if (config.operaParams?.SERVICING_DELINQUENT?.SEARCH) {
          self.delinquentGridModel.queryModel = cast(
            config.operaParams.SERVICING_DELINQUENT.SEARCH,
          );
        }
        if (config.operaParams?.SERVICING_DELINQUENT?.ALL) {
          self.delinquentGridModel.orderColumns = cast(
            config.operaParams.SERVICING_DELINQUENT.ALL,
          );
        }
        self.delinquentGridModel.pinLeftColumns = cast(
          config.operaParams.SERVICING_DELINQUENT.LEFT,
        );
        //maturity
        if (config.operaParams?.SERVICING_MATURITY?.SEARCH) {
          self.maturityGridModel.queryModel = cast(
            config.operaParams.SERVICING_MATURITY.SEARCH,
          );
        }
        if (config.operaParams?.SERVICING_MATURITY?.ALL) {
          self.maturityGridModel.orderColumns = cast(
            config.operaParams.SERVICING_MATURITY.ALL,
          );
        }
        self.maturityGridModel.pinLeftColumns = cast(
          config.operaParams.SERVICING_MATURITY.LEFT,
        );
      } catch (e) {
        console.log(e);
      }
      self.displayType = config.pageColumn;
    },
  }));
// .actions((self) => {
//   const getAllGridConfig = flow(function* () {
//     // console.log('render');
//     const res = yield _getAllLoansList();
//     if (res?.data) {
//       const { operaParams, pageColumn } = res.data;
//       self.displayType = pageColumn;
//       self.allLoansGridModel.queryModel = cast(
//         operaParams.SERVICING_ALL_LOAN.SEARCH,
//       );
//       self.investorGridModel.queryModel = cast(
//         operaParams.SERVICING_BY_INVESTOR.SEARCH,
//       );
//       self.delinquentGridModel.queryModel = cast(
//         operaParams.SERVICING_DELINQUENT.SEARCH,
//       );
//       self.maturityGridModel.queryModel = cast(
//         operaParams.SERVICING_MATURITY.SEARCH,
//       );
//     }
//     // self.products = res?.data?.functions;
//     // self.productsInitialized = true;
//   });
//   return { getAllGridConfig };
// });
