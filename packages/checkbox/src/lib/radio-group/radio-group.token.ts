import { InjectionToken } from '@angular/core';

export interface RadioGroupRef {
  selectedValue(): any;
  select(value: any): void;
  isDisabled(): boolean;
  name: string;
}

export const FUSE_RADIO_GROUP = new InjectionToken<RadioGroupRef>(
  'FUSE_RADIO_GROUP'
);
