import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CheckboxGroupRef,
  FUSE_CHECKBOX_GROUP,
} from './checkbox-group.token';
import { FuseCheckboxComponent } from '../checkbox/fuse-checkbox.component';

@Component({
  selector: 'fuse-checkbox-group',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-checkbox-group.component.html',
  styleUrl: './fuse-checkbox-group.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuseCheckboxGroupComponent),
      multi: true,
    },
    {
      provide: FUSE_CHECKBOX_GROUP,
      useExisting: forwardRef(() => FuseCheckboxGroupComponent),
    },
  ],
})
export class FuseCheckboxGroupComponent
  implements ControlValueAccessor, CheckboxGroupRef
{
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly disabled = input(false);

  // ─── ContentChildren ────────────────────────────────────────────────────────

  readonly checkboxes = contentChildren(FuseCheckboxComponent);

  // ─── Internal signal state ──────────────────────────────────────────────────

  protected readonly selectedValues = signal<any[]>([]);

  private readonly _formDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  // ─── CVA callbacks ──────────────────────────────────────────────────────────

  private onChange: (v: any[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: any[]): void {
    this.selectedValues.set(Array.isArray(v) ? v : []);
  }

  registerOnChange(fn: (v: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this._formDisabled.set(disabled);
  }

  // ─── CheckboxGroupRef interface ─────────────────────────────────────────────

  isValueSelected(value: any): boolean {
    return this.selectedValues().includes(value);
  }

  toggle(value: any): void {
    const current = [...this.selectedValues()];
    const idx = current.indexOf(value);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    this.selectedValues.set(current);
    this.onChange(current);
    this.onTouched();
  }
}
