import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  ElementRef,
} from '@angular/core';
import { FuseIconComponent } from '@fuse_ui/icon';

@Component({
  selector: 'fuse-chip',
  standalone: true,
  imports: [FuseIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-chip.component.html',
  styleUrl: './fuse-chip.component.scss',
  host: {
    class: 'fuse-chip-host',
    '[attr.data-selected]': 'selected()',
    '[attr.data-selectable]': 'selectable()',
    '(click)': 'handleHostClick()',
  },
})
export class FuseChipComponent {
  // ─── Inputs ──────────────────────────────────────────────────────────────────

  readonly variant   = input<'solid' | 'flat' | 'bordered'>('flat');
  readonly color     = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('primary');
  readonly size      = input<'sm' | 'md'>('md');
  readonly closable  = input<boolean>(false);
  readonly selectable = input<boolean>(false);

  // ─── Two-way binding ─────────────────────────────────────────────────────────

  readonly selected = model<boolean>(false);

  // ─── Outputs ─────────────────────────────────────────────────────────────────

  readonly chipClose = output<void>();

  // ─── Computed ────────────────────────────────────────────────────────────────

  protected readonly hostClass = computed(() =>
    [
      'fuse-chip',
      `fuse-chip--${this.variant()}`,
      `fuse-chip--${this.color()}`,
      `fuse-chip--${this.size()}`,
      this.selected()  ? 'fuse-chip--selected'  : '',
      this.selectable() ? 'fuse-chip--selectable' : '',
    ].filter(Boolean).join(' ')
  );

  // ─── Event handlers ──────────────────────────────────────────────────────────

  protected handleHostClick(): void {
    if (this.selectable()) {
      this.selected.set(!this.selected());
    }
  }
}
