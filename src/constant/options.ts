import { LoanStatus, PipelineStatusEnum } from '@/types/enum';
import { LoanProductCategoryEnum, LoanPurposeEnum } from '@/types/overview';

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
