import { SnapshotOut, types } from 'mobx-state-tree';

import { PipelineMode, RepaymentStatusEnum, SortDirection } from '@/types/enum';

const SortItemModel = types.model({
  direction: types.enumeration(Object.values(SortDirection)),
  property: types.string,
  ignoreCase: types.boolean,
});
export type ISortItemModel = SnapshotOut<typeof SortItemModel>;

const searchConditionModel = types.model({
  investors: types.array(types.string),
  propertyAddress: types.string,
  maturityStartDate: types.string,
  maturityEndDate: types.string,
  // delinquentDays: 'ONE_THIRTY',
  // maturityDays: 'MONTH_END',
  repaymentStatusList: types.array(
    types.enumeration(Object.values(RepaymentStatusEnum)),
  ),
});
export type ISearchConditionModel = SnapshotOut<typeof searchConditionModel>;

export const allLoansGridQueryModel = types
  .model({
    size: types.number,
    page: types.number,
    sort: types.array(SortItemModel),
    searchCondition: searchConditionModel,
    pipelineMode: types.enumeration(Object.values(PipelineMode)),
  })
  .actions((self) => ({
    updateQueryCondition<T extends keyof typeof self.searchCondition>(
      key: T,
      value: (typeof self.searchCondition)[T],
    ) {
      self.searchCondition[key] = value;
    },
  }));

export type IAllLoansGridModel = SnapshotOut<typeof allLoansGridQueryModel>;
