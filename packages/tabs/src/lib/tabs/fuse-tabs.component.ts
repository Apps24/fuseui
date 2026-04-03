import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  contentChildren,
  effect,
  inject,
  output,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { FuseBadgeComponent } from '@fuse_ui/badge';
import { FuseTabComponent } from './fuse-tab.component';
import { FUSE_TABS, TabsRef } from './fuse-tabs.token';

@Component({
  selector: 'fuse-tabs',
  standalone: true,
  imports: [FuseTabComponent, FuseBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FUSE_TABS, useExisting: FuseTabsComponent }],
  templateUrl: './fuse-tabs.component.html',
  styleUrl: './fuse-tabs.component.scss',
  host: { class: 'fuse-tabs-host' },
})
export class FuseTabsComponent implements TabsRef, AfterViewInit {
  // ─── Inputs ──────────────────────────────────────────────────────────────────

  readonly activeTab = input<string>('');
  readonly variant   = input<'line' | 'pills' | 'boxed'>('line');
  readonly size      = input<'sm' | 'md'>('md');

  // ─── Outputs ─────────────────────────────────────────────────────────────────

  readonly tabChange = output<string>();

  // ─── Queries ─────────────────────────────────────────────────────────────────

  readonly tabs       = contentChildren(FuseTabComponent);
  readonly tabList    = viewChild.required<ElementRef<HTMLElement>>('tabList');
  readonly indicator  = viewChild<ElementRef<HTMLElement>>('indicator');
  readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');

  // ─── State ───────────────────────────────────────────────────────────────────

  readonly activeTabId = signal('');

  // ─── Services ────────────────────────────────────────────────────────────────

  private readonly injector    = inject(Injector);
  private readonly destroyRef  = inject(DestroyRef);

  // ─── Computed ────────────────────────────────────────────────────────────────

  protected readonly tabListClass = computed(() =>
    [
      'fuse-tabs__list',
      `fuse-tabs__list--${this.variant()}`,
      `fuse-tabs__list--${this.size()}`,
    ].join(' ')
  );

  protected readonly tabBtnClass = (tab: FuseTabComponent) =>
    computed(() => [
      'fuse-tab-btn',
      this.activeTabId() === tab.tabId() ? 'fuse-tab-btn--active' : '',
      tab.disabled()                     ? 'fuse-tab-btn--disabled' : '',
    ].filter(Boolean).join(' '));

  // ─── Sync activeTab input → activeTabId signal ───────────────────────────────

  private readonly _sync = effect(() => {
    const desired = this.activeTab() || this.tabs()[0]?.tabId() || '';
    this.activeTabId.set(desired);
  });

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  constructor() {
    afterNextRender(() => this.updateIndicator());
  }

  ngAfterViewInit(): void {
    // Re-measure when tab list is ready (handles SSR-safe fallback)
    this.updateIndicator();
  }

  // ─── Public API (TabsRef) ────────────────────────────────────────────────────

  setActive(tabId: string): void {
    this.activeTabId.set(tabId);
    this.tabChange.emit(tabId);
    // Wait for Angular to re-render the active class before measuring
    afterNextRender(() => this.updateIndicator(), { injector: this.injector });
  }

  // ─── Indicator ───────────────────────────────────────────────────────────────

  private updateIndicator(): void {
    const indicatorRef = this.indicator();
    if (!indicatorRef) return; // only 'line' variant has indicator

    const buttons = this.tabButtons();
    const idx = this.tabs().findIndex(t => t.tabId() === this.activeTabId());
    if (idx < 0 || !buttons[idx]) return;

    const btn = buttons[idx].nativeElement;
    const el  = indicatorRef.nativeElement;
    el.style.left  = `${btn.offsetLeft}px`;
    el.style.width = `${btn.offsetWidth}px`;
  }
}
