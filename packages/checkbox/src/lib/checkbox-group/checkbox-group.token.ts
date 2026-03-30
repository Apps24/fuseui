import { InjectionToken } from '@angular/core';

export interface CheckboxGroupRef {
  isValueSelected(value: any): boolean;
  toggle(value: any): void;
  isDisabled(): boolean;
}

export const FUSE_CHECKBOX_GROUP = new InjectionToken<CheckboxGroupRef>(
  'FUSE_CHECKBOX_GROUP'
);
