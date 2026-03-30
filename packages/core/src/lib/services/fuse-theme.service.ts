import { Injectable, computed, signal } from '@angular/core';

export type FuseTheme = 'light' | 'dark' | 'ocean' | 'rose' | (string & {});

@Injectable({ providedIn: 'root' })
export class FuseThemeService {
  private readonly STORAGE_KEY = 'fuse-theme';

  readonly activeTheme = signal<FuseTheme>(
    (localStorage.getItem(this.STORAGE_KEY) as FuseTheme) ?? 'light'
  );

  readonly isDark = computed(() => this.activeTheme() === 'dark');
  readonly availableThemes = signal<FuseTheme[]>(['light', 'dark', 'ocean', 'rose']);

  constructor() {
    /* Apply persisted theme on init */
    this.applyTheme(this.activeTheme());

    /* Respect system dark mode preference on first load */
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (!localStorage.getItem(this.STORAGE_KEY) && mq.matches) {
      this.setTheme('dark');
    }
  }

  setTheme(theme: FuseTheme): void {
    this.activeTheme.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  registerTheme(name: string): void {
    this.availableThemes.update(t => [...t, name as FuseTheme]);
  }

  toggleDarkMode(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  setReduceMotion(enabled: boolean): void {
    document.documentElement.toggleAttribute('data-reduce-motion', enabled);
  }

  private applyTheme(theme: FuseTheme): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    /* Ionic 8 dark mode: toggle .ion-palette-dark on :root */
    root.classList.toggle('ion-palette-dark', theme === 'dark');
  }
}
