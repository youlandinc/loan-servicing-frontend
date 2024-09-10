export interface IborrowersItem {
  borrowerImputedEquity: number;
  borrowerType: string;
  birthDay: string;
  email: string;
  fico: number;
  firstName: string;
  lastName: string;
  secretaryStateId: string;
  formationState: string;
  authorizedSignatoryTitle: string;
  gender: string;
  mailingAddress: string;
  maritalStatus: string;
  personalGuaranty: string;
  phone: string;
  residencyStatus: string;
  ssn: string;
  inputCreditScore: number;
  state: string;
  trackRecord: string;
  unit: string;
  zipCode: string;
  entityType: string;
  entityName: string;
  ethnicity: string;
  race: string;
  ethnicityList: string[];
  raceList: string[];
  delinquentTimes: number;
  bankruptcyEvent: string;
  propertyForeclosureDate: string;
  addressInfo: {
    address: string;
    aptNumber: string;
    city: string;
    state: string;
    postcode: string;
  };
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface IBorrowerInfo {
  borrowers: Nullable<IborrowersItem>[];
}
