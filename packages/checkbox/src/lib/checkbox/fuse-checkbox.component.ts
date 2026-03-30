import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  FUSE_CHECKBOX_GROUP,
} from '../checkbox-group/checkbox-group.token';

@Component({
  selector: 'fuse-checkbox',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-checkbox.component.html',
  styleUrl: './fuse-checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuseCheckboxComponent),
      multi: true,
    },
  ],
})
export class FuseCheckboxComponent implements ControlValueAccessor {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly label = input('');
  readonly indeterminate = input(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabled = input(false);

  /** Value emitted / registered when this checkbox is checked. */
  readonly value = input<any>(true);

  private readonly _formDisabled = signal(false);

  // ─── Public @Output() API ───────────────────────────────────────────────────

  readonly checkedChange = output<boolean>();

  // ─── Optional group injection ───────────────────────────────────────────────

  protected readonly group = inject(FUSE_CHECKBOX_GROUP, { optional: true });

  // ─── Internal signal state ──────────────────────────────────────────────────

  /** Standalone checked state (bypassed when inside a group). */
  private readonly _checked = signal(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || this._formDisabled() || (this.group?.isDisabled() ?? false)
  );

  protected readonly checked = computed(() =>
    this.group ? this.group.isValueSelected(this.value()) : this._checked()
  );

  // ─── CVA callbacks ──────────────────────────────────────────────────────────

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: any): void {
    this._checked.set(!!v);
  }

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this._formDisabled.set(disabled);
  }

  // ─── Event handlers ─────────────────────────────────────────────────────────

  handleChange(event: Event): void {
    if (this.isDisabled()) return;
    const isChecked = (event.target as HTMLInputElement).checked;

    if (this.group) {
      this.group.toggle(this.value());
    } else {
      this._checked.set(isChecked);
      this.onChange(isChecked);
      this.checkedChange.emit(isChecked);
    }
  }

  handleBlur(): void {
    if (!this.group) {
      this.onTouched();
    }
  }
}
