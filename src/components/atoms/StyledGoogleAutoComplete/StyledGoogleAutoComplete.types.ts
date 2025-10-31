import { IAddress } from '@/models/common/Address';

export interface StyledGoogleAutoCompleteProps {
  address: IAddress;
  fullAddress?: boolean;
  disabled?: boolean;
  label?: string;
  stateError?: boolean;
  addressError?: Record<string, string[]> | undefined;
}

export interface StyledAutoCompleteProps {
  inputValue: string;
  onInputChange: (e: any, val: string) => void;
  fullAddress: boolean;
  handledPlaceSelect: (place: any) => void;
  disabled?: boolean;
  value: PlaceType | string;
  label?: string;
  validate?: undefined | string[];
}

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}

interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}

export interface PlaceType {
  place_id?: string;
  description: string;
  structured_formatting: StructuredFormatting;
}
