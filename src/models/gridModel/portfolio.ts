import { cast, types } from 'mobx-state-tree';

import { allLoansModel } from '@/models/gridModel/allLoansModel/allLoansModel';

import { utils } from '@/utils';

import { PortfolioGridTypeEnum } from '@/types/enum';
import { IAllGridConfig } from '@/types/pipeline';

export const portfolioModel = types
  .model({
    displayType: types.maybe(
      types.enumeration(Object.values(PortfolioGridTypeEnum)),
    ),
    youlandGridModel: allLoansModel,
    cashFlowGridModel: allLoansModel,
    alamedaGridModel: allLoansModel,
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
        if (
          utils.isNotEmptyOfObject(
            config.operaParams?.SERVICING_YOULAND?.SEARCH,
          )
        ) {
          self.youlandGridModel.queryModel = cast(
            config.operaParams.SERVICING_YOULAND.SEARCH,
          );
        }
        if (config.operaParams?.SERVICING_YOULAND?.ALL) {
          self.youlandGridModel.orderColumns = cast(
            config.operaParams.SERVICING_YOULAND.ALL,
          );
        }
        self.youlandGridModel.pinLeftColumns = cast(
          config.operaParams.SERVICING_YOULAND.LEFT,
        );

        if (
          utils.isNotEmptyOfObject(
            config.operaParams?.SERVICING_ALAMEDA?.SEARCH,
          )
        ) {
          self.alamedaGridModel.queryModel = cast(
            config.operaParams.SERVICING_ALAMEDA.SEARCH,
          );
        }
        if (config.operaParams?.SERVICING_ALAMEDA?.ALL) {
          self.alamedaGridModel.orderColumns = cast(
            config.operaParams.SERVICING_ALAMEDA.ALL,
          );
        }
        self.alamedaGridModel.pinLeftColumns = cast(
          config.operaParams.SERVICING_ALAMEDA.LEFT,
        );

        if (
          utils.isNotEmptyOfObject(
            config.operaParams?.SERVICING_CASH_FLOW?.SEARCH,
          )
        ) {
          self.cashFlowGridModel.queryModel = cast(
            config.operaParams.SERVICING_CASH_FLOW.SEARCH,
          );
        }
        if (config.operaParams?.SERVICING_CASH_FLOW?.ALL) {
          self.cashFlowGridModel.orderColumns = cast(
            config.operaParams.SERVICING_CASH_FLOW.ALL,
          );
        }
        self.cashFlowGridModel.expandedColumns = cast(
          config.operaParams.SERVICING_CASH_FLOW.DROPDOWN,
        );

        // all loans
        if (
          utils.isNotEmptyOfObject(
            config.operaParams?.SERVICING_ALL_LOAN?.SEARCH,
          )
        ) {
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
        // investor
        if (
          utils.isNotEmptyOfObject(
            config.operaParams?.SERVICING_BY_INVESTOR?.SEARCH,
          )
        ) {
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
        self.investorGridModel.expandedColumns = cast(
          config.operaParams.SERVICING_BY_INVESTOR.DROPDOWN,
        );
        // delinquent
        if (
          utils.isNotEmptyOfObject(
            config.operaParams?.SERVICING_DELINQUENT?.SEARCH,
          )
        ) {
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
        self.delinquentGridModel.expandedColumns = cast(
          config.operaParams.SERVICING_DELINQUENT.DROPDOWN,
        );
        // maturity
        if (
          utils.isNotEmptyOfObject(
            config.operaParams?.SERVICING_MATURITY?.SEARCH,
          )
        ) {
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
        self.maturityGridModel.expandedColumns = cast(
          config.operaParams.SERVICING_MATURITY.DROPDOWN,
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
      self.displayType =
        config.pageColumn === PortfolioGridTypeEnum.CASH_FLOW
          ? PortfolioGridTypeEnum.YOULAND
          : config.pageColumn;
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
