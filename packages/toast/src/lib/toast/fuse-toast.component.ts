import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export type FuseToastType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'fuse-toast',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-toast.component.html',
  styleUrl: './fuse-toast.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'alert',
    'aria-live': 'polite',
    '(animationend)': 'onAnimationEnd()',
  },
})
export class FuseToastComponent {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly message = input('');
  readonly type = input<FuseToastType>('info');
  readonly action = input<{ label: string; callback: () => void } | null>(null);

  // ─── Public @Output() API ───────────────────────────────────────────────────

  readonly toastClose = output<void>();

  // ─── Internal signal state ──────────────────────────────────────────────────

  protected readonly isVisible = signal(true);

  // ─── Host class computation ─────────────────────────────────────────────────

  protected readonly hostClasses = computed(() =>
    [
      'fuse-toast',
      `fuse-toast--${this.type()}`,
      !this.isVisible() ? 'fuse-toast--leaving' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  // ─── Public API (callable by FuseToastService via ref.instance) ─────────────

  close(): void {
    this.isVisible.set(false);
  }

  // ─── Template event handlers ─────────────────────────────────────────────────

  protected onActionClick(): void {
    this.action()?.callback();
    this.close();
  }

  protected onAnimationEnd(): void {
    // Called by the host (animationend) binding. Only emit after the leave
    // animation; the enter animation end is ignored because isVisible() is true.
    if (!this.isVisible()) {
      this.toastClose.emit();
    }
  }
}
