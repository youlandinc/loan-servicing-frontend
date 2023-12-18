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
