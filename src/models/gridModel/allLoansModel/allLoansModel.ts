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

const expandedItem = types.model({
  collapsed: types.boolean,
  dropDownId: types.string,
});

export type IOrderColumnsItem = SnapshotOut<typeof orderColumnsItem>;

export type IExpandedItem = SnapshotOut<typeof expandedItem>;

export const allLoansModel = types
  .model({
    queryModel: allLoansGridQueryModel,
    orderColumns: types.array(orderColumnsItem),
    pinLeftColumns: types.array(types.string),
    expandedColumns: types.array(expandedItem),
  })
  .actions((self) => ({
    updateOrderColumns(columns: IOrderColumnsItem[]) {
      self.orderColumns = cast(columns);
    },
    updatePinLeftColumns(columns: string[]) {
      self.pinLeftColumns = cast(columns);
    },
  }));
