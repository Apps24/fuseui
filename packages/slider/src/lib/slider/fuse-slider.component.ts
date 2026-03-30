import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

export interface FuseSliderMark {
  value: number;
  label: string;
}

type SliderValue = number | [number, number];
type DragTarget  = 'single' | 'low' | 'high';

@Component({
  selector: 'fuse-slider',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-slider.component.html',
  styleUrl: './fuse-slider.component.scss',
  host: { class: 'fuse-slider-host' },
})
export class FuseSliderComponent {
  // ─── Inputs ────────────────────────────────────────────────────────────────

  readonly min          = input<number>(0);
  readonly max          = input<number>(100);
  readonly step         = input<number>(1);
  readonly range        = input<boolean>(false);
  readonly showTooltip  = input<'always' | 'hover' | 'never'>('hover');
  readonly showMarks    = input<boolean>(false);
  readonly marks        = input<FuseSliderMark[]>([]);

  // ─── Two-way binding ───────────────────────────────────────────────────────

  readonly value = model<SliderValue>(0);

  // ─── State ─────────────────────────────────────────────────────────────────

  readonly isDragging = signal(false);
  readonly isFocused  = signal(false);

  // ─── Deps ──────────────────────────────────────────────────────────────────

  private readonly destroyRef = inject(DestroyRef);

  // ─── View refs ─────────────────────────────────────────────────────────────

  private readonly trackRef = viewChild.required<ElementRef<HTMLElement>>('trackEl');

  // ─── Derived ───────────────────────────────────────────────────────────────

  readonly fillPercent = computed(() => {
    const v  = this.value();
    const lo = this.min();
    const hi = this.max();
    const pct = (n: number) => ((n - lo) / (hi - lo)) * 100;
    return Array.isArray(v)
      ? { from: pct(v[0]), to: pct(v[1]) }
      : { from: 0, to: pct(v as number) };
  });

  // Helper computed signals for strict-template access
  protected readonly lowVal  = computed(() =>
    Array.isArray(this.value()) ? (this.value() as [number, number])[0] : this.min()
  );
  protected readonly highVal = computed(() =>
    Array.isArray(this.value()) ? (this.value() as [number, number])[1] : this.value() as number
  );

  protected readonly showTooltipVisible = computed(() =>
    this.showTooltip() !== 'never' &&
    (this.showTooltip() === 'always' || this.isFocused() || this.isDragging())
  );

  // ─── Drag ──────────────────────────────────────────────────────────────────

  startDrag(event: MouseEvent | TouchEvent, which: DragTarget): void {
    event.preventDefault();
    this.isDragging.set(true);

    const getClientX = (e: MouseEvent | TouchEvent): number =>
      e instanceof MouseEvent
        ? e.clientX
        : (e as TouchEvent).touches[0]?.clientX ??
          (e as TouchEvent).changedTouches[0]?.clientX ?? 0;

    const clamp = (n: number, min: number, max: number) =>
      Math.max(min, Math.min(max, n));

    const toValue = (clientX: number): number => {
      const rect = this.trackRef().nativeElement.getBoundingClientRect();
      const pct  = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw  = this.min() + pct * (this.max() - this.min());
      const s    = this.step();
      const stepped = Math.round(raw / s) * s;
      return clamp(+stepped.toFixed(10), this.min(), this.max());
    };

    const move$ = merge(
      fromEvent<MouseEvent>(document, 'mousemove'),
      fromEvent<TouchEvent>(document, 'touchmove', { passive: false } as AddEventListenerOptions),
    );
    const up$ = merge(
      fromEvent<MouseEvent>(document, 'mouseup'),
      fromEvent<TouchEvent>(document, 'touchend'),
    );

    move$.pipe(
      takeUntil(up$),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((e) => {
      const val = toValue(getClientX(e));
      if (which === 'single') {
        this.value.set(val);
      } else {
        const [lo, hi] = this.value() as [number, number];
        this.value.set(
          which === 'low'
            ? [Math.min(val, hi), hi]
            : [lo, Math.max(val, lo)],
        );
      }
    });

    up$.pipe(take(1)).subscribe(() => this.isDragging.set(false));
  }

  // ─── Keyboard ──────────────────────────────────────────────────────────────

  onKeydown(event: KeyboardEvent, which: DragTarget): void {
    const s    = this.step();
    const big  = event.shiftKey ? s * 10 : s;
    const clamp = (n: number) => Math.max(this.min(), Math.min(this.max(), n));

    if (which === 'single') {
      const v = this.value() as number;
      switch (event.key) {
        case 'ArrowRight': case 'ArrowUp':
          event.preventDefault();
          this.value.set(clamp(v + big));
          break;
        case 'ArrowLeft': case 'ArrowDown':
          event.preventDefault();
          this.value.set(clamp(v - big));
          break;
        case 'Home':
          event.preventDefault();
          this.value.set(this.min());
          break;
        case 'End':
          event.preventDefault();
          this.value.set(this.max());
          break;
      }
    } else {
      const [lo, hi] = this.value() as [number, number];
      if (which === 'low') {
        switch (event.key) {
          case 'ArrowRight': case 'ArrowUp':
            event.preventDefault();
            this.value.set([Math.min(clamp(lo + big), hi), hi]);
            break;
          case 'ArrowLeft': case 'ArrowDown':
            event.preventDefault();
            this.value.set([clamp(lo - big), hi]);
            break;
          case 'Home': event.preventDefault(); this.value.set([this.min(), hi]); break;
          case 'End':  event.preventDefault(); this.value.set([hi, hi]);         break;
        }
      } else {
        switch (event.key) {
          case 'ArrowRight': case 'ArrowUp':
            event.preventDefault();
            this.value.set([lo, clamp(hi + big)]);
            break;
          case 'ArrowLeft': case 'ArrowDown':
            event.preventDefault();
            this.value.set([lo, Math.max(clamp(hi - big), lo)]);
            break;
          case 'Home': event.preventDefault(); this.value.set([lo, lo]);          break;
          case 'End':  event.preventDefault(); this.value.set([lo, this.max()]); break;
        }
      }
    }
  }
}
