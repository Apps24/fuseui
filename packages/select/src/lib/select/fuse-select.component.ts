import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule, CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { take } from 'rxjs';

export interface FuseSelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'fuse-select',
  standalone: true,
  imports: [OverlayModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-select.component.html',
  styleUrl: './fuse-select.component.scss',
  host: {
    '(keydown)': 'handleKeydown($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FuseSelectComponent),
      multi: true,
    },
  ],
})
export class FuseSelectComponent implements ControlValueAccessor {
  // ─── Public @Input() API ────────────────────────────────────────────────────

  readonly options = input<FuseSelectOption[]>([]);
  readonly placeholder = input('Select an option');
  readonly multiple = input(false);
  readonly searchable = input(false);
  readonly label = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly hasError = input(false);
  readonly disabled = input(false);

  // ─── Public @Output() API ───────────────────────────────────────────────────

  readonly selectionChange = output<any | any[]>();

  // ─── View queries ────────────────────────────────────────────────────────────

  private readonly overlayDir = viewChild(CdkConnectedOverlay);
  private readonly triggerRef = viewChild.required('triggerRef', { read: ElementRef });

  // ─── Internal signal state ──────────────────────────────────────────────────

  protected readonly isOpen = signal(false);
  protected readonly filterText = signal('');
  protected readonly highlightedIndex = signal(-1);
  private readonly _value = signal<any>(null);

  private readonly _formDisabled = signal(false);

  // ─── Injections ─────────────────────────────────────────────────────────────

  private readonly destroyRef = inject(DestroyRef);

  // ─── Derived ────────────────────────────────────────────────────────────────

  protected readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  protected readonly filteredOptions = computed(() =>
    this.options().filter(o =>
      o.label.toLowerCase().includes(this.filterText().toLowerCase())
    )
  );

  protected readonly displayLabel = computed(() => {
    const val = this._value();
    if (this.multiple()) {
      const vals: any[] = val ?? [];
      return this.options()
        .filter(o => vals.includes(o.value))
        .map(o => o.label)
        .join(', ');
    }
    return this.options().find(o => o.value === val)?.label ?? '';
  });

  protected readonly hasValue = computed(() => {
    const val = this._value();
    if (this.multiple()) return ((val as any[]) ?? []).length > 0;
    return val !== null && val !== undefined && val !== '';
  });

  // ─── CDK overlay positions (below, fallback above) ──────────────────────────

  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top',    offsetY: 4 },
    { originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];

  protected panelWidth = 0;

  // ─── CVA callbacks ──────────────────────────────────────────────────────────

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: any): void {
    this._value.set(v ?? (this.multiple() ? [] : null));
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

  // ─── Open / Close ────────────────────────────────────────────────────────────

  open(): void {
    if (this.isDisabled()) return;
    this.panelWidth = this.triggerRef().nativeElement.offsetWidth ?? 0;
    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
    this.filterText.set('');
  }

  close(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  toggleOpen(): void {
    this.isOpen() ? this.close() : this.open();
  }

  // Called by (attach) on CdkConnectedOverlay — sets up backdrop-click close
  protected onPanelAttach(): void {
    this.overlayDir()?.overlayRef
      .backdropClick()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.close());
  }

  // ─── Option selection ────────────────────────────────────────────────────────

  isSelected(opt: FuseSelectOption): boolean {
    if (this.multiple()) {
      return ((this._value() as any[]) ?? []).includes(opt.value);
    }
    return this._value() === opt.value;
  }

  selectOption(opt: FuseSelectOption): void {
    if (opt.disabled) return;
    if (this.multiple()) {
      const current: any[] = [...((this._value() as any[]) ?? [])];
      const idx = current.indexOf(opt.value);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(opt.value);
      }
      this._value.set(current);
      this.onChange(current);
      this.selectionChange.emit(current);
    } else {
      this._value.set(opt.value);
      this.onChange(opt.value);
      this.selectionChange.emit(opt.value);
      this.close();
    }
  }

  // ─── Keyboard navigation ─────────────────────────────────────────────────────

  handleKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.open();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.set(
          Math.min(this.highlightedIndex() + 1, this.filteredOptions().length - 1)
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.set(Math.max(this.highlightedIndex() - 1, 0));
        break;
      case 'Enter': {
        event.preventDefault();
        const idx = this.highlightedIndex();
        if (idx >= 0 && idx < this.filteredOptions().length) {
          this.selectOption(this.filteredOptions()[idx]);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'Tab':
        this.close();
        break;
    }
  }
}
