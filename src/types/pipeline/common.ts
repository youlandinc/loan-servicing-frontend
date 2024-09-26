import { IOrderColumnsItem } from '@/models/gridModel';
import { IAllLoansQueryParam } from '@/models/gridModel/allLoansModel/gridQueryModel';
import { PortfolioGridTypeEnum } from '@/types/enum';

type CommonGridConfig = Partial<{
  SEARCH: IAllLoansQueryParam;
  ALL: IOrderColumnsItem[];
}>;

export type IAllGridConfig = {
  pageColumn: PortfolioGridTypeEnum;
  operaParams: Partial<{
    SERVICING_CASH_FLOW: CommonGridConfig;
    SERVICING_YOULAND: CommonGridConfig;
    SERVICING_ALAMEDA: CommonGridConfig;
    SERVICING_DELINQUENT: CommonGridConfig;
    SERVICING_ALL_LOAN: CommonGridConfig;
    SERVICING_BY_INVESTOR: CommonGridConfig;
    SERVICING_MATURITY: CommonGridConfig;
  }>;
};
