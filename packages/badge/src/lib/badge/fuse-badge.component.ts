import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';

@Component({
  selector: 'fuse-badge',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-badge.component.html',
  styleUrl: './fuse-badge.component.scss',
  host: { '[class]': 'hostClasses' },
})
export class FuseBadgeComponent {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly variant = input<'solid' | 'flat' | 'outline'>('solid');
  readonly color = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('primary');
  readonly size = input<'sm' | 'md'>('sm');
  readonly dot = input(false);
  readonly content = input('');

  // ─── Host classes ────────────────────────────────────────────────────────────

  get hostClasses(): string {
    return 'fuse-badge-host';
  }
}
