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
  selector: 'fuse-textarea',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-textarea.component.html',
  styleUrl: './fuse-textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuseTextareaComponent),
      multi: true,
    },
  ],
})
export class FuseTextareaComponent implements ControlValueAccessor {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly label = input('');
  readonly placeholder = input('');
  readonly helperText = input('');
  readonly errorMessage = input('');
  readonly hasError = input(false);
  readonly rows = input(3);
  readonly maxLength = input<number | null>(null);
  readonly autoResize = input(false);

  // ─── Internal signal state ──────────────────────────────────────────────────

  readonly value = model<string>('');
  protected readonly isDisabled = signal(false);

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

  protected onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.value.set(el.value);
    this.onChange(el.value);
    if (this.autoResize()) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
