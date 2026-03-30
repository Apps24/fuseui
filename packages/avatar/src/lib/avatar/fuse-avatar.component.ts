import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'fuse-avatar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-avatar.component.html',
  styleUrl: './fuse-avatar.component.scss',
  host: { '[class]': 'hostClasses()' },
})
export class FuseAvatarComponent {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly src = input('');
  readonly alt = input('');
  readonly name = input('');
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly shape = input<'circle' | 'square'>('circle');
  readonly status = input<'online' | 'offline' | 'busy' | 'away' | null>(null);

  // ─── Internal signal state ──────────────────────────────────────────────────

  protected readonly hasError = signal(false);

  // ─── Host classes ────────────────────────────────────────────────────────────

  protected readonly hostClasses = computed(() =>
    [
      'fuse-avatar',
      `fuse-avatar--${this.size()}`,
      `fuse-avatar--${this.shape()}`,
    ].join(' ')
  );

  // ─── Derived values ─────────────────────────────────────────────────────────

  protected readonly initials = computed(() => {
    const name = this.name();
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase() ?? '')
      .join('');
  });

  // ─── Event handlers ─────────────────────────────────────────────────────────

  protected onImageError(): void {
    this.hasError.set(true);
  }
}
