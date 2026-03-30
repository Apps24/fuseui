import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FuseIconComponent } from '@fuse/icon';
import { FUSE_ACCORDION } from './fuse-accordion.token';

@Component({
  selector: 'fuse-accordion-item',
  standalone: true,
  imports: [FuseIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-accordion-item.component.html',
  styleUrl: './fuse-accordion-item.component.scss',
  host: {
    class: 'fuse-accordion-item',
    '[attr.aria-expanded]': 'isOpen()',
    '[class.fuse-accordion-item--open]': 'isOpen()',
  },
})
export class FuseAccordionItemComponent {
  // ─── Inputs ──────────────────────────────────────────────────────────────────

  readonly itemId   = input.required<string>();
  readonly title    = input.required<string>();
  readonly disabled = input<boolean>(false);

  // ─── Parent context ───────────────────────────────────────────────────────────

  protected readonly accordion = inject(FUSE_ACCORDION);

  // ─── Queries ─────────────────────────────────────────────────────────────────

  readonly contentEl = viewChild<ElementRef>('contentEl');

  // ─── Derived ─────────────────────────────────────────────────────────────────

  protected readonly isOpen = computed(() => this.accordion.isOpen(this.itemId()));
}
