import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal,
  input,
} from '@angular/core';

@Component({
  selector: 'fuse-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-card.component.html',
  styleUrl: './fuse-card.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'onCardClick($event)',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class FuseCardComponent {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly variant = input<'flat' | 'elevated' | 'outlined'>('elevated');
  readonly clickable = input(false);
  readonly padding = input<'none' | 'sm' | 'md' | 'lg'>('md');

  // ─── Public @Output() API ───────────────────────────────────────────────────

  readonly cardClick = output<MouseEvent>();

  // ─── Internal signal state ──────────────────────────────────────────────────

  protected readonly hovered = signal(false);

  // ─── Host class computation ─────────────────────────────────────────────────

  protected readonly hostClasses = computed(() =>
    [
      'fuse-card',
      `fuse-card--${this.variant()}`,
      `fuse-card--padding-${this.padding()}`,
      this.clickable() ? 'fuse-card--clickable' : '',
      this.hovered() && this.clickable() ? 'fuse-card--hovered' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  // ─── Event handler ──────────────────────────────────────────────────────────

  onCardClick(event: MouseEvent): void {
    if (this.clickable()) {
      this.cardClick.emit(event);
    }
  }
}
