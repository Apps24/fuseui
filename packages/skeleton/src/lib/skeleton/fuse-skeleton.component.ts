import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'fuse-skeleton',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-skeleton.component.html',
  styleUrl: './fuse-skeleton.component.scss',
  host: { '[class]': 'hostClasses' },
})
export class FuseSkeletonComponent {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly variant = input<'text' | 'circle' | 'rect'>('rect');
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly lines = input(1);

  // ─── Host classes ────────────────────────────────────────────────────────────

  get hostClasses(): string {
    return 'fuse-skeleton-host';
  }

  // ─── Derived values ─────────────────────────────────────────────────────────

  protected readonly lineArray = computed(() =>
    Array.from({ length: this.lines() }, (_, i) => i)
  );

  /** Width of the last line in a multi-line text block (shorter = more natural). */
  lineWidth(index: number): string {
    const isLast = index === this.lineArray().length - 1;
    return isLast ? '70%' : '100%';
  }
}
