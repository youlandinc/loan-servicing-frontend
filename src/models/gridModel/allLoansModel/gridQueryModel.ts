import { cast, SnapshotOut, types } from 'mobx-state-tree';

import {
  DelinquentTimeRangeEnum,
  MaturityTimeRangeEnum,
  PipelineMode,
  SortDirection,
} from '@/types/enum';

const SortItemModel = types.model({
  direction: types.enumeration(Object.values(SortDirection)),
  property: types.string,
  ignoreCase: types.boolean,
  label: types.maybe(types.string),
});

export type ISortItemModel = SnapshotOut<typeof SortItemModel>;

const searchConditionModel = types.model({
  investors: types.array(types.string),
  keyword: types.string,
  maturityStartDate: types.maybe(types.string),
  maturityEndDate: types.maybe(types.string),
  repaymentStatusList: types.array(
    types.string, //types.enumeration(Object.values(RepaymentStatusEnum)),
  ),
  delinquentDays: types.maybe(
    types.union(
      types.enumeration(Object.values(DelinquentTimeRangeEnum)),
      types.undefined,
    ),
  ),
  maturityDays: types.maybe(
    types.union(
      types.enumeration(Object.values(MaturityTimeRangeEnum)),
      types.undefined,
    ),
  ),
});
export type ISearchConditionModel = SnapshotOut<typeof searchConditionModel>;

export const allLoansGridQueryModel = types
  .model({
    size: types.number,
    page: types.number,
    sort: types.array(SortItemModel),
    searchCondition: searchConditionModel,
  })
  .actions((self) => ({
    updatePage(page: number, size: number = self.size) {
      self.page = page;
      self.size = size;
    },
    updateQueryCondition<T extends keyof typeof self.searchCondition>(
      key: T,
      value: (typeof self.searchCondition)[T],
    ) {
      self.searchCondition[key] = value;
      self.page = 0;
    },
    updateQueryDateRange(data: { startDate: string; endDate: string }) {
      self.searchCondition.maturityStartDate = data.startDate;
      self.searchCondition.maturityEndDate = data.endDate;
      self.page = 0;
    },
    resetDefault() {
      self.searchCondition.investors =
        [] as unknown as typeof self.searchCondition.investors;
      self.searchCondition.maturityStartDate = '';
      self.searchCondition.maturityEndDate = '';
      self.searchCondition.repaymentStatusList =
        [] as unknown as typeof self.searchCondition.repaymentStatusList;
    },
    updateSort(sort: ISortItemModel[]) {
      if (sort.length > 0) {
        self.sort = cast(
          sort.map((item) => ({
            property: item.property,
            direction: item.direction,
            ignoreCase: item.ignoreCase,
          })),
        );
      }
      self.sort = cast(sort);
    },
  }));

export type IAllLoansQueryParam = SnapshotOut<typeof allLoansGridQueryModel>;
