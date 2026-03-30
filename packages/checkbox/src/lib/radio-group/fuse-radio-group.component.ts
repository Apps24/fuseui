import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioGroupRef, FUSE_RADIO_GROUP } from './radio-group.token';

let _groupId = 0;

@Component({
  selector: 'fuse-radio-group',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-radio-group.component.html',
  styleUrl: './fuse-radio-group.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuseRadioGroupComponent),
      multi: true,
    },
    {
      provide: FUSE_RADIO_GROUP,
      useExisting: forwardRef(() => FuseRadioGroupComponent),
    },
  ],
})
export class FuseRadioGroupComponent
  implements ControlValueAccessor, RadioGroupRef
{
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly ariaLabel = input('');
  readonly disabled = input(false);

  /** Shared `name` attribute forwarded to all child radios. Auto-generated if omitted. */
  readonly groupName = input(`fuse-radio-group-${++_groupId}`);

  /** Satisfies the RadioGroupRef interface (requires a string property). */
  get name(): string { return this.groupName(); }

  // ─── Public @Output() API ───────────────────────────────────────────────────

  readonly valueChange = output<any>();

  // ─── Internal signal state ──────────────────────────────────────────────────

  readonly selectedValue = signal<any>(null);

  private readonly _formDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  // ─── CVA callbacks ──────────────────────────────────────────────────────────

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: any): void {
    this.selectedValue.set(v ?? null);
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

  // ─── RadioGroupRef interface ─────────────────────────────────────────────────

  select(value: any): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }
}
