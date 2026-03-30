import { InjectionToken, Signal } from '@angular/core';

export interface AccordionRef {
  openIds: Signal<Set<string>>;
  isOpen(id: string): boolean;
  toggle(id: string): void;
}

export const FUSE_ACCORDION = new InjectionToken<AccordionRef>('FUSE_ACCORDION');
