import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export type FuseAlertType = 'info' | 'success' | 'warning' | 'error';
export type FuseAlertVariant = 'soft' | 'solid';

@Component({
  selector: 'fuse-alert',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-alert.component.html',
  styleUrl: './fuse-alert.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class FuseAlertComponent {
  // ─── Public @Input() API ───────────────────────────────────────────────────

  readonly type = input<FuseAlertType>('info');
  readonly title = input('');
  readonly closable = input(false);
  readonly variant = input<FuseAlertVariant>('soft');

  // ─── Public @Output() API ─────────────────────────────────────────────────

  readonly alertClose = output<void>();

  // ─── Internal signal state ────────────────────────────────────────────────

  protected readonly dismissed = signal(false);

  // ─── Host class computation ──────────────────────────────────────────────

  protected readonly hostClasses = computed(() =>
    [
      'fuse-alert',
      `fuse-alert--${this.type()}`,
      `fuse-alert--${this.variant()}`,
    ].join(' ')
  );

  // ─── Template event handler ──────────────────────────────────────────────

  protected dismiss(): void {
    this.dismissed.set(true);
    this.alertClose.emit();
  }
}
