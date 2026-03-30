import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

export interface FuseBreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

@Component({
  selector: 'fuse-breadcrumb',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-breadcrumb.component.html',
  styleUrl: './fuse-breadcrumb.component.scss',
  host: { class: 'fuse-breadcrumb-host' },
})
export class FuseBreadcrumbComponent {
  // ─── Inputs ────────────────────────────────────────────────────────────────

  readonly items      = input.required<FuseBreadcrumbItem[]>();
  readonly maxVisible = input<number>(4);
  readonly separator  = input<'/' | '>' | '·'>('/');

  // ─── State ─────────────────────────────────────────────────────────────────

  readonly showAll = signal(false);

  // ─── Derived ───────────────────────────────────────────────────────────────

  readonly visibleItems = computed((): (FuseBreadcrumbItem | null)[] => {
    const all = this.items();
    if (this.showAll() || all.length <= this.maxVisible()) return all;
    return [all[0], null, ...all.slice(-2)];
  });
}
