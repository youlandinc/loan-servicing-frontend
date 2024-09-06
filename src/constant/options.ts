import {
  BorrowerTypeEnum,
  EstFICOScoreEnum,
  LoanPurposeEnum,
  LoanStatus,
  PipelineStatusEnum,
  ProductCategoryEnum,
  PropertyTypeEnum,
} from '@/types/enum';

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
    label: 'Reo',
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
    key: LoanPurposeEnum.purchase,
    label: 'Purchase',
    value: LoanPurposeEnum.purchase,
  },
  {
    key: LoanPurposeEnum.refinance,
    label: 'Refinance',
    value: LoanPurposeEnum.refinance,
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
