import { InjectionToken, Signal } from '@angular/core';

export interface TabsRef {
  activeTabId: Signal<string>;
  setActive(tabId: string): void;
}

export const FUSE_TABS = new InjectionToken<TabsRef>('FUSE_TABS');
