import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'fuse-input',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-input.component.html',
  styleUrl: './fuse-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuseInputComponent),
      multi: true,
    },
  ],
})
export class FuseInputComponent implements ControlValueAccessor {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly label = input('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly required = input(false);
  readonly helperText = input('');
  readonly errorMessage = input('');
  readonly hasError = input(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly readonly = input(false);

  // ─── Internal signal state ──────────────────────────────────────────────────

  readonly value = model<string>('');
  protected readonly isDisabled = signal(false);
  protected readonly isFocused = signal(false);

  // ─── CVA callbacks ──────────────────────────────────────────────────────────

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ─── Derived ────────────────────────────────────────────────────────────────

  protected readonly showError = computed(() =>
    this.hasError() || !!this.errorMessage()
  );

  // ─── ControlValueAccessor ────────────────────────────────────────────────────

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  // ─── Event handlers ─────────────────────────────────────────────────────────

  handleInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  handleFocus(): void {
    this.isFocused.set(true);
  }

  handleBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }
}
