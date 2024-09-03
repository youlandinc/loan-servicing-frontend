import { StyledSelectProps } from '@/components/atoms';

export interface StyledSelectMultipleProps
  extends Omit<StyledSelectProps, 'value'> {
  value: Array<any> | any;
  onValueChange: (value: any[]) => void;
  validate?: undefined | string[];
}
