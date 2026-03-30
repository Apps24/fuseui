import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FUSE_RADIO_GROUP } from '../radio-group/radio-group.token';

@Component({
  selector: 'fuse-radio',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-radio.component.html',
  styleUrl: './fuse-radio.component.scss',
})
export class FuseRadioComponent {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly value = input.required<any>();
  readonly label = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabled = input(false);

  /** Used only when this radio is standalone (no parent fuse-radio-group). */
  readonly name = input('');

  // ─── Group injection ─────────────────────────────────────────────────────────

  protected readonly group = inject(FUSE_RADIO_GROUP, { optional: true });

  // ─── Derived state ──────────────────────────────────────────────────────────

  protected readonly isChecked = computed(() =>
    this.group ? this.group.selectedValue() === this.value() : false
  );

  protected readonly isDisabled = computed(
    () => this.disabled() || (this.group?.isDisabled() ?? false)
  );

  protected get radioName(): string {
    return this.group?.name || this.name();
  }

  // ─── Event handlers ─────────────────────────────────────────────────────────

  handleChange(): void {
    if (this.isDisabled()) return;
    this.group?.select(this.value());
  }

  handleBlur(): void {
    // Touched is managed by the group's CVA
  }
}
