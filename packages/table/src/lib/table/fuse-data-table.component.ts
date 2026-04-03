import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { FuseSkeletonComponent } from '@fuse_ui/skeleton';
import { FuseIconComponent } from '@fuse_ui/icon';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface FuseColumnDef {
  key:           string;
  label:         string;
  sortable?:     boolean;
  width?:        string;
  align?:        'left' | 'center' | 'right';
  cellTemplate?: TemplateRef<{ $implicit: unknown; row: unknown }>;
}

export interface FuseSortEvent {
  key: string;
  dir: 'asc' | 'desc' | '';
}

// ─── Skeleton row sentinel type ───────────────────────────────────────────────

interface SkeletonRow { __skeleton: true }

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'fuse-data-table',
  standalone: true,
  imports: [CdkTableModule, NgTemplateOutlet, FuseSkeletonComponent, FuseIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-data-table.component.html',
  styleUrl: './fuse-data-table.component.scss',
  host: { class: 'fuse-data-table-host' },
})
export class FuseDataTableComponent {
  // ─── Inputs ──────────────────────────────────────────────────────────────────

  readonly data         = input.required<unknown[]>();
  readonly columns      = input.required<FuseColumnDef[]>();
  readonly sortable     = input<boolean>(false);
  readonly loading      = input<boolean>(false);
  readonly stickyHeader = input<boolean>(true);

  // ─── Output ───────────────────────────────────────────────────────────────────

  readonly sortChange = output<FuseSortEvent>();

  // ─── Internal state ───────────────────────────────────────────────────────────

  readonly sortKey = signal('');
  readonly sortDir = signal<'asc' | 'desc' | ''>('');

  readonly skeletonRows: readonly number[] = [0, 1, 2, 3, 4];

  // ─── Derived ─────────────────────────────────────────────────────────────────

  readonly displayedColumns = computed(() => this.columns().map(c => c.key));

  /**
   * The data source passed to CdkTable.
   * When loading, we use skeleton sentinels so CDK still renders rows
   * (this allows the @defer block to activate and show skeletons).
   * When loaded, we use the real data.
   */
  readonly tableData = computed((): unknown[] =>
    this.loading()
      ? this.skeletonRows.map((): SkeletonRow => ({ __skeleton: true }))
      : this.data()
  );

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  isSkeletonRow = (index: number, row: unknown): boolean =>
    (row as SkeletonRow).__skeleton === true;

  isDataRow = (index: number, row: unknown): boolean =>
    (row as SkeletonRow).__skeleton !== true;

  getCellValue(row: unknown, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  getColumnDef(key: string): FuseColumnDef | undefined {
    return this.columns().find(c => c.key === key);
  }

  // ─── Sort ─────────────────────────────────────────────────────────────────────

  onSort(key: string): void {
    const col = this.getColumnDef(key);
    if (!this.sortable() || !col?.sortable) return;

    if (this.sortKey() !== key) {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    } else if (this.sortDir() === 'asc') {
      this.sortDir.set('desc');
    } else {
      this.sortKey.set('');
      this.sortDir.set('');
    }

    this.sortChange.emit({ key: this.sortKey(), dir: this.sortDir() });
  }

  sortIconFor(key: string): string {
    if (this.sortKey() !== key || this.sortDir() === '') return 'chevron-up-down';
    return this.sortDir() === 'asc' ? 'chevron-up' : 'chevron-down';
  }
}
