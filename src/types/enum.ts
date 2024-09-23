export enum LoanStatus {
  inactive = 'inactive',
  performing = 'performing',
  paid_off = 'paid_off',
}

export enum LoginType {
  YLACCOUNT_LOGIN = 'YLACCOUNT_LOGIN',
  GOOGLE_LOGIN = 'GOOGLE_LOGIN',
  DEFAULT = '',
}

export enum FreeTrialState {
  None = 'None',
  Activated = 'Activated',
  Expired = 'Expired',
}

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  BROKER = 'BROKER',
  REAL_ESTATE_AGENT = 'REAL_ESTATE_AGENT',
  LOAN_OFFICER = 'LOAN_OFFICER',
  Doc_Engine = 'Doc_Engine',
  SYSMNG = 'SYSMNG',
}

export enum BizType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET_PASS = 'RESET_PASS',
  CHANGE_PASS = 'CHANGE_PASS',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
}

export enum ServiceType {
  SAAS = 'SAAS',
  WHITE_LABEL = 'WHITE_LABEL',
}

export enum RepaymentStatusEnum {
  Delinquent = 'Delinquent',
  Foreclosure = 'Foreclosure',
  Performing = 'Performing',
  Paid_Off = 'Paid off',
}

export enum PipelineMode {
  INITIAL_APPROVAL = 'INITIAL_APPROVAL',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum PipelineStatusEnum {
  PERFORMING = 'PERFORMING',
  DELINQUENCY = 'DELINQUENCY',
  FORECLOSURE = 'FORECLOSURE',
  PRE_FORECLOSURE = 'PRE_FORECLOSURE',
  ASSIGNED = 'ASSIGNED',
  CHARGE_OFF = 'CHARGE_OFF',
  CLOSED = 'CLOSED',
  COMPLETE_CHARGE_OFF = 'COMPLETE_CHARGE_OFF',
  ESCROW_IMPOUNDS = 'ESCROW_IMPOUNDS',
  FINAL_BOARDING = 'FINAL_BOARDING',
  IMPORTED = 'IMPORTED',
  LOSS_MIT_REQUEST = 'LOSS_MIT_REQUEST',
  ON_HOLD = 'ON_HOLD',
  PAID_OFF = 'PAID_OFF',
  PAID_OFF_DEMAND = 'PAID_OFF_DEMAND',
  PRE_BOARDING = 'PRE_BOARDING',
  REO = 'REO',
  RESPA = 'RESPA',
  TRANSFERRED = 'TRANSFERRED',
  TRANSFERRED_OUT = 'TRANSFERRED_OUT',
  BANKRUPTCY = 'BANKRUPTCY',
}

export enum ProductCategoryEnum {
  bridge = 'Stabilized Bridge', //'STABILIZED_BRIDGE',
  fix = 'Fix and Flip', //'FIX_AND_FLIP',
  ground = 'Ground-up Construction', //'GROUND_UP_CONSTRUCTION',
}

export enum LoanDetailsPurposeEnum {
  purchase = 'Purchase', //'PURCHASE',
  refinance = 'Refinance', //'REFINANCE',
}

export enum EstFICOScoreEnum {
  FICO_NOT_AVAILABLE = 'FICO_NOT_AVAILABLE',
  BELOW_600 = 'BELOW_600',
  BETWEEN_600_649 = 'BETWEEN_600_649',
  BETWEEN_650_699 = 'BETWEEN_650_699',
  BETWEEN_700_749 = 'BETWEEN_700_749',
  BETWEEN_750_799 = 'BETWEEN_750_799',
  ABOVE_800 = 'ABOVE_800',
  NO_FICO = 'NO_FICO',
}

export enum BorrowerTypeEnum {
  INDIVIDUAL = 'Individual',

  ENTITY = 'Entity',

  TRUST = 'Trust',
}

export enum PropertyTypeEnum {
  SINGLE_FAMILY = 'SINGLE_FAMILY',

  TOWNHOUSE = 'TOWNHOUSE',

  CONDO = 'CONDO',

  UNITS24 = 'UNITS24',
}

export enum MaturityDateTypeEnum {
  EXTEND_3 = 'EXTEND_THREE',
  EXTEND_6 = 'EXTEND_SIX',
}

export enum PortfolioGridTypeEnum {
  ALL_LOANS = 'SERVICING_ALL_LOAN',
  BY_INVESTOR = 'SERVICING_BY_INVESTOR',
  DELINQUENT = 'SERVICING_DELINQUENT',
  MATURITY = 'SERVICING_MATURITY',
}

export enum DelinquentTimeRangeEnum {
  ONE_THIRTY = 'ONE_THIRTY',
  THIRTY_ONE_SIXTY = 'THIRTY_ONE_SIXTY',
  SIXTY_ONE_NINETY = 'SIXTY_ONE_NINETY',
  NINETY_ONE_ONE_HUNDRED_TWENTY = 'NINETY_ONE_ONE_HUNDRED_TWENTY',
  ONE_HUNDRED_TWENTY_ADD = 'ONE_HUNDRED_TWENTY_ADD',
  ALL = 'ALL',
}

export enum MaturityTimeRangeEnum {
  MONTH_END = 'MONTH_END',
  NEXT_MONTH_END = 'NEXT_MONTH_END',
  ALREADY_END = 'ALREADY_END',
}

export enum ColumnPiningDirectionEnum {
  left = 'LEFT',
  right = 'RIGHT',
  center = 'CENTER',
}

export enum ExtensionPaidTypeEnum {
  Upfront = 'UPFRONT',
  Deferred = 'DEFERRED',
}
