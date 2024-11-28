import {
  BorrowerTypeEnum,
  DelinquentTimeRangeEnum,
  EstFICOScoreEnum,
  ExtensionPaidTypeEnum,
  LoanDetailsPurposeEnum,
  LoanFicoScoreEnum,
  LoanStatus,
  MaturityDateTypeEnum,
  MaturityTimeRangeEnum,
  PipelineStatusEnum,
  ProductCategoryEnum,
  PropertyTypeEnum,
} from '@/types/enum';
import {
  LoanProductCategoryEnum,
  LoanPurposeEnum,
} from '@/types/loan/overview';

export const LOAN_PRODUCT_CATEGORY: Option[] = [
  {
    label: 'Stabilized Bridge',
    key: LoanProductCategoryEnum.stabilized_bridge,
    value: LoanProductCategoryEnum.stabilized_bridge,
  },
  {
    label: 'Fix and Flip',
    key: LoanProductCategoryEnum.fix_and_flip,
    value: LoanProductCategoryEnum.fix_and_flip,
  },
  //{
  //  label: 'Ground-up Construction',
  //  key: LoanProductCategoryEnum.ground_up_construction,
  //  value: LoanProductCategoryEnum.ground_up_construction,
  //},
];

export const LOAN_PURPOSE: Option[] = [
  {
    label: 'Purchase',
    key: LoanPurposeEnum.purchase,
    value: LoanPurposeEnum.purchase,
  },
  {
    label: 'Refinance',
    key: LoanPurposeEnum.refinance,
    value: LoanPurposeEnum.refinance,
  },
];

export const GRID_STATUS: Option[] = [
  { label: 'Inactive', key: LoanStatus.inactive, value: LoanStatus.inactive },
  {
    label: 'Performing',
    key: LoanStatus.performing,
    value: LoanStatus.performing,
  },
  { label: 'Paid off', key: LoanStatus.paid_off, value: LoanStatus.paid_off },
];

export const PIPELINE_STATUS: Option[] = [
  {
    label: 'Performing',
    key: PipelineStatusEnum.PERFORMING,
    value: PipelineStatusEnum.PERFORMING,
  },
  {
    label: 'Delinquency',
    key: PipelineStatusEnum.DELINQUENCY,
    value: PipelineStatusEnum.DELINQUENCY,
  },

  {
    key: PipelineStatusEnum.FORECLOSURE,
    value: PipelineStatusEnum.FORECLOSURE,
    label: 'Foreclosure',
  },

  {
    key: PipelineStatusEnum.PRE_FORECLOSURE,
    value: PipelineStatusEnum.PRE_FORECLOSURE,
    label: 'Pre foreclosure',
  },

  {
    key: PipelineStatusEnum.ASSIGNED,
    value: PipelineStatusEnum.ASSIGNED,
    label: 'Assigned',
  },

  {
    key: PipelineStatusEnum.CHARGE_OFF,
    value: PipelineStatusEnum.CHARGE_OFF,
    label: 'Charge Off',
  },

  {
    key: PipelineStatusEnum.CLOSED,
    value: PipelineStatusEnum.CLOSED,
    label: 'Closed',
  },

  {
    label: 'Complete charge off',
    key: PipelineStatusEnum.COMPLETE_CHARGE_OFF,
    value: PipelineStatusEnum.COMPLETE_CHARGE_OFF,
  },

  {
    label: 'Escrow/Impounds',
    value: PipelineStatusEnum.ESCROW_IMPOUNDS,
    key: PipelineStatusEnum.ESCROW_IMPOUNDS,
  },

  {
    label: 'Final Boarding',
    key: PipelineStatusEnum.FINAL_BOARDING,
    value: PipelineStatusEnum.FINAL_BOARDING,
  },

  {
    label: 'Imported',
    key: PipelineStatusEnum.IMPORTED,
    value: PipelineStatusEnum.IMPORTED,
  },

  {
    label: 'Loss-Mit Request',
    key: PipelineStatusEnum.LOSS_MIT_REQUEST,
    value: PipelineStatusEnum.LOSS_MIT_REQUEST,
  },

  {
    label: 'On Hold',
    key: PipelineStatusEnum.ON_HOLD,
    value: PipelineStatusEnum.ON_HOLD,
  },

  {
    label: 'Paid Off',
    key: PipelineStatusEnum.PAID_OFF,
    value: PipelineStatusEnum.PAID_OFF,
  },

  {
    label: 'PaidOff Demand',
    key: PipelineStatusEnum.PAID_OFF_DEMAND,
    value: PipelineStatusEnum.PAID_OFF_DEMAND,
  },

  {
    label: 'Pre Boarding',
    key: PipelineStatusEnum.PRE_BOARDING,
    value: PipelineStatusEnum.PRE_BOARDING,
  },

  {
    label: 'REO',
    key: PipelineStatusEnum.REO,
    value: PipelineStatusEnum.REO,
  },

  {
    label: 'RESPA',
    key: PipelineStatusEnum.RESPA,
    value: PipelineStatusEnum.RESPA,
  },

  {
    label: 'Transferred',
    key: PipelineStatusEnum.TRANSFERRED,
    value: PipelineStatusEnum.TRANSFERRED,
  },

  {
    label: 'Transferred out',
    key: PipelineStatusEnum.TRANSFERRED_OUT,
    value: PipelineStatusEnum.TRANSFERRED_OUT,
  },

  {
    label: 'Bankruptcy',
    key: PipelineStatusEnum.BANKRUPTCY,
    value: PipelineStatusEnum.BANKRUPTCY,
  },
];

export const LoanPurposeOpt: Option[] = [
  {
    key: LoanDetailsPurposeEnum.purchase,
    label: 'Purchase',
    value: LoanDetailsPurposeEnum.purchase,
  },
  {
    key: LoanDetailsPurposeEnum.refinance,
    label: 'Refinance',
    value: LoanDetailsPurposeEnum.refinance,
  },
];
export const ProductCategoryOpt: Option[] = [
  {
    key: ProductCategoryEnum.bridge,
    label: 'Stabilized Bridge',
    value: ProductCategoryEnum.bridge,
  },
  {
    key: ProductCategoryEnum.fix,
    label: 'Fix and Flip',
    value: ProductCategoryEnum.fix,
  },
  {
    key: ProductCategoryEnum.ground,
    label: 'Ground-up Construction',
    value: ProductCategoryEnum.ground,
  },
];

export const EstFICOScoreOpt = [
  {
    label: 'FICO not available',
    value: EstFICOScoreEnum.FICO_NOT_AVAILABLE,
    key: EstFICOScoreEnum.FICO_NOT_AVAILABLE,
  },
  {
    label: 'Below 600',
    value: EstFICOScoreEnum.BELOW_600,
    key: EstFICOScoreEnum.BELOW_600,
  },
  {
    label: '600-649',
    value: EstFICOScoreEnum.BETWEEN_600_649,
    key: EstFICOScoreEnum.BETWEEN_600_649,
  },
  {
    label: '650-699',
    value: EstFICOScoreEnum.BETWEEN_650_699,
    key: EstFICOScoreEnum.BETWEEN_650_699,
  },
  {
    label: '700-749',
    value: EstFICOScoreEnum.BETWEEN_700_749,
    key: EstFICOScoreEnum.BETWEEN_700_749,
  },
  {
    label: '750-799',
    value: EstFICOScoreEnum.BETWEEN_750_799,
    key: EstFICOScoreEnum.BETWEEN_750_799,
  },
  {
    label: '800+',
    value: EstFICOScoreEnum.ABOVE_800,
    key: EstFICOScoreEnum.ABOVE_800,
  },
];

export const BorrowerTypeOpt: Option[] = [
  {
    key: BorrowerTypeEnum.INDIVIDUAL,
    label: 'Individual',
    value: BorrowerTypeEnum.INDIVIDUAL,
  },
  {
    key: BorrowerTypeEnum.ENTITY,
    label: 'Entity',
    value: BorrowerTypeEnum.ENTITY,
  },
  {
    key: BorrowerTypeEnum.TRUST,
    label: 'Trust',
    value: BorrowerTypeEnum.TRUST,
  },
];

export const PropertyTypeOpt: Option[] = [
  {
    key: PropertyTypeEnum.SINGLE_FAMILY,
    value: PropertyTypeEnum.SINGLE_FAMILY,
    label: 'Single family',
  },
  {
    key: PropertyTypeEnum.TOWNHOUSE,
    value: PropertyTypeEnum.TOWNHOUSE,
    label: 'Townhouse',
  },
  {
    key: PropertyTypeEnum.CONDO,
    label: 'Condo',
    value: PropertyTypeEnum.CONDO,
  },
  {
    key: PropertyTypeEnum.UNITS24,
    label: '2 to 4 units',
    value: PropertyTypeEnum.UNITS24,
  },
];

export const MATURITY_DATE: Option[] = [
  {
    key: MaturityDateTypeEnum.EXTEND_3,
    label: 'Extend by 3 months',
    value: MaturityDateTypeEnum.EXTEND_3,
  },
  {
    key: MaturityDateTypeEnum.EXTEND_6,
    label: 'Extend by 6 months',
    value: MaturityDateTypeEnum.EXTEND_6,
  },
];

/*ONE_THIRTY("ont - thirty", "1-30"),
    THIRTY_ONE_SIXTY("thirty one - sixty", "31-60"),
    SIXTY_ONE_NINETY("sixty one - ninety", "61-90"),
    NINETY_ONE_ONE_HUNDRED_TWENTY("ninety one - one hundred twenty", "91-120"),
    ONE_HUNDRED_TWENTY_ADD("one hundred twenty add", "120+");*/
export const DelinquentTimeRangeOpt: Option[] = [
  {
    key: DelinquentTimeRangeEnum.ALL,
    label: 'All',
    value: DelinquentTimeRangeEnum.ALL,
  },
  {
    key: DelinquentTimeRangeEnum.ONE_THIRTY,
    label: '1-30',
    value: DelinquentTimeRangeEnum.ONE_THIRTY,
  },
  {
    key: DelinquentTimeRangeEnum.THIRTY_ONE_SIXTY,
    label: '31-60',
    value: DelinquentTimeRangeEnum.THIRTY_ONE_SIXTY,
  },
  {
    key: DelinquentTimeRangeEnum.SIXTY_ONE_NINETY,
    label: '61-90',
    value: DelinquentTimeRangeEnum.SIXTY_ONE_NINETY,
  },
  {
    key: DelinquentTimeRangeEnum.NINETY_ONE_ONE_HUNDRED_TWENTY,
    label: '91-120',
    value: DelinquentTimeRangeEnum.NINETY_ONE_ONE_HUNDRED_TWENTY,
  },
  {
    key: DelinquentTimeRangeEnum.ONE_HUNDRED_TWENTY_ADD,
    label: '120+',
    value: DelinquentTimeRangeEnum.ONE_HUNDRED_TWENTY_ADD,
  },
];

export const MaturityTypeOpt: Option[] = [
  {
    key: MaturityTimeRangeEnum.ALREADY_END,
    label: 'In default',
    value: MaturityTimeRangeEnum.ALREADY_END,
  },
  {
    key: MaturityTimeRangeEnum.MONTH_END,
    label: 'Month-end',
    value: MaturityTimeRangeEnum.MONTH_END,
  },
  {
    key: MaturityTimeRangeEnum.NEXT_MONTH_END,
    label: 'Next month-end',
    value: MaturityTimeRangeEnum.NEXT_MONTH_END,
  },
];

export const ExtensionPaidTypeOpt: Option[] = [
  {
    label: 'At time of signing',
    key: ExtensionPaidTypeEnum.Upfront,
    value: ExtensionPaidTypeEnum.Upfront,
  },
  {
    label: 'At payoff',
    key: ExtensionPaidTypeEnum.Deferred,
    value: ExtensionPaidTypeEnum.Deferred,
  },
];

export const APPLICATION_FICO_SCORE: Option[] = [
  {
    label: 'FICO not available',
    key: LoanFicoScoreEnum.fico_not_available,
    value: LoanFicoScoreEnum.fico_not_available,
  },
  {
    label: 'Below 600',
    key: LoanFicoScoreEnum.below_600,
    value: LoanFicoScoreEnum.below_600,
  },
  {
    label: '600-649',
    key: LoanFicoScoreEnum.between_600_649,
    value: LoanFicoScoreEnum.between_600_649,
  },
  {
    label: '650-699',
    key: LoanFicoScoreEnum.between_650_699,
    value: LoanFicoScoreEnum.between_650_699,
  },
  {
    label: '700-749',
    key: LoanFicoScoreEnum.between_700_749,
    value: LoanFicoScoreEnum.between_700_749,
  },
  {
    label: '750-799',
    key: LoanFicoScoreEnum.between_750_799,
    value: LoanFicoScoreEnum.between_750_799,
  },
  {
    label: '800+',
    key: LoanFicoScoreEnum.above_800,
    value: LoanFicoScoreEnum.above_800,
  },
];
