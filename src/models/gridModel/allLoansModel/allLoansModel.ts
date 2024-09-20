import { cast, SnapshotOut, types } from 'mobx-state-tree';

import { ColumnPiningDirectionEnum } from '@/types/enum';

import { allLoansGridQueryModel } from '@/models/gridModel/allLoansModel/gridQueryModel';

export const orderColumnsItem = types.model({
  columnWidth: types.maybeNull(types.number),
  field: types.string,
  headerName: types.string,
  id: types.maybe(types.number),
  leftOrder: types.maybeNull(types.number),
  pinType: types.maybeNull(
    types.enumeration(Object.values(ColumnPiningDirectionEnum)),
  ),
  sort: types.number,
  visibility: types.boolean,
});

export type IOrderColumnsItem = SnapshotOut<typeof orderColumnsItem>;

export const allLoansModel = types
  .model({
    queryModel: allLoansGridQueryModel,
    orderColumns: types.array(orderColumnsItem),
  })
  .actions((self) => ({
    updateOrderColumns(columns: IOrderColumnsItem[]) {
      self.orderColumns = cast(columns);
    },
  }));
