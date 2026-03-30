import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  signal,
} from '@angular/core';
import { FUSE_ACCORDION, AccordionRef } from './fuse-accordion.token';
import { FuseAccordionItemComponent } from './fuse-accordion-item.component';

@Component({
  selector: 'fuse-accordion',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FUSE_ACCORDION, useExisting: FuseAccordionComponent }],
  templateUrl: './fuse-accordion.component.html',
  styleUrl: './fuse-accordion.component.scss',
  host: { class: 'fuse-accordion-host' },
})
export class FuseAccordionComponent implements AccordionRef {
  // ─── Inputs ──────────────────────────────────────────────────────────────────

  readonly multiple = input<boolean>(false);

  // ─── Queries ─────────────────────────────────────────────────────────────────

  readonly items = contentChildren(FuseAccordionItemComponent);

  // ─── State ───────────────────────────────────────────────────────────────────

  readonly openIds = signal<Set<string>>(new Set());

  // ─── Public API (AccordionRef) ────────────────────────────────────────────────

  toggle(id: string): void {
    this.openIds.update(ids => {
      const next = new Set(ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!this.multiple()) next.clear();
        next.add(id);
      }
      return next;
    });
  }

  isOpen(id: string): boolean {
    return this.openIds().has(id);
  }
}
