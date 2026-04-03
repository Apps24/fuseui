import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { FuseIconComponent } from '@fuse_ui/icon';

@Component({
  selector: 'fuse-pagination',
  standalone: true,
  imports: [FuseIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-pagination.component.html',
  styleUrl: './fuse-pagination.component.scss',
  host: { class: 'fuse-pagination-host' },
})
export class FusePaginationComponent {
  // ─── Inputs ────────────────────────────────────────────────────────────────

  readonly total        = input.required<number>();
  readonly pageSize     = input<number>(10);
  readonly siblingCount = input<number>(1);

  // ─── Two-way binding ───────────────────────────────────────────────────────

  readonly currentPage = model<number>(1);

  // ─── Output ────────────────────────────────────────────────────────────────

  readonly pageChange = output<number>();

  // ─── Derived ───────────────────────────────────────────────────────────────

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize()))
  );

  readonly pages = computed(() =>
    this.buildPages(this.currentPage(), this.totalPages(), this.siblingCount())
  );

  // ─── Public API ────────────────────────────────────────────────────────────

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  // ─── Algorithm ─────────────────────────────────────────────────────────────

  buildPages(
    current: number,
    total: number,
    siblings: number,
  ): (number | '...')[] {
    const range = (start: number, end: number): number[] =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // All pages fit without ellipsis
    const totalVisible = siblings * 2 + 5; // first + last + current + 2×ellipsis + siblings
    if (total <= totalVisible) return range(1, total);

    const leftSibling  = Math.max(2, current - siblings);
    const rightSibling = Math.min(total - 1, current + siblings);

    const showLeftEllipsis  = leftSibling > 2;
    const showRightEllipsis = rightSibling < total - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      return [...range(1, 3 + siblings * 2), '...', total];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      return [1, '...', ...range(total - 2 - siblings * 2, total)];
    }

    return [1, '...', ...range(leftSibling, rightSibling), '...', total];
  }
}
