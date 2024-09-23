import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { ColumnPiningDirectionEnum, PortfolioGridTypeEnum } from '@/types/enum';

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

export type IAllGridConfig = {
  pageColumn: PortfolioGridTypeEnum;
  operaParams: {
    SERVICING_DELINQUENT: {
      SEARCH: IAllLoansQueryParam;
    };
    SERVICING_ALL_LOAN: {
      SEARCH: IAllLoansQueryParam;
    };
    SERVICING_BY_INVESTOR: {
      SEARCH: IAllLoansQueryParam;
    };
    SERVICING_MATURITY: {
      SEARCH: IAllLoansQueryParam;
    };
  };
};
