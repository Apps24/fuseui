import { Injectable, Optional, inject } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class FusePlatformService {
  private readonly ionicPlatform = inject<Platform>(Platform, { optional: true });

  get isIonic(): boolean { return !!this.ionicPlatform; }

  get currentMode(): 'ios' | 'md' {
    const m = document.documentElement.getAttribute('mode');
    return m === 'ios' ? 'ios' : 'md';
  }

  get isMobile(): boolean {
    return this.ionicPlatform?.is('mobile')
      ?? /Mobi|Android/i.test(navigator.userAgent);
  }

  get isIos(): boolean { return this.ionicPlatform?.is('ios') ?? false; }
  get isAndroid(): boolean { return this.ionicPlatform?.is('android') ?? false; }

  get isNative(): boolean {
    try { return (window as any).Capacitor?.isNativePlatform() ?? false; }
    catch { return false; }
  }
}
