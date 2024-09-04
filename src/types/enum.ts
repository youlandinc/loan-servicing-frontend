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
