import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FuseBadgeComponent } from '@fuse/badge';
import { FUSE_TABS } from './fuse-tabs.token';

@Component({
  selector: 'fuse-tab',
  standalone: true,
  imports: [FuseBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-tab.component.html',
  host: { class: 'fuse-tab-host' },
})
export class FuseTabComponent {
  // ─── Inputs ──────────────────────────────────────────────────────────────────

  readonly tabId    = input.required<string>();
  readonly label    = input.required<string>();
  readonly disabled = input(false);
  readonly badge    = input<string | null>(null);

  // ─── Parent context ───────────────────────────────────────────────────────────

  protected readonly tabs = inject(FUSE_TABS);

  // ─── Derived ─────────────────────────────────────────────────────────────────

  protected readonly isActive = computed(() =>
    this.tabs.activeTabId() === this.tabId()
  );
}
