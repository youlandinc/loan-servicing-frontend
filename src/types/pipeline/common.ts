import { ColumnPiningDirectionEnum } from '@/types/enum';

export type ColumnConfig = {
  field: string;
  sort: number;
  visibility: boolean;
  headerName: string;
  id?: number;
  disabled?: boolean;
  columnWidth?: number;
  hidden?: boolean;
  pinType: ColumnPiningDirectionEnum | null;
  leftOrder: number | null;
};
