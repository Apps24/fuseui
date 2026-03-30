import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { FuseAnimationService } from '@fuse/core';

type Placement = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'fuse-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-popover.component.html',
  styleUrl: './fuse-popover.component.scss',
  host: { class: 'fuse-popover' },
})
export class FusePopoverComponent {
  // ─── Inputs ────────────────────────────────────────────────────────────────

  readonly placement      = input<Placement>('bottom');
  readonly trigger        = input<'click' | 'hover'>('click');
  readonly closeOnOutside = input<boolean>(true);

  // ─── Two-way binding ───────────────────────────────────────────────────────

  readonly isOpen = model<boolean>(false);

  // ─── Private deps ─────────────────────────────────────────────────────────

  private readonly destroyRef = inject(DestroyRef);
  private readonly animSvc    = inject(FuseAnimationService);
  private readonly el         = inject(ElementRef<HTMLElement>);
  private readonly injector   = inject(Injector);

  // ─── View refs ────────────────────────────────────────────────────────────

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    // Close when clicking outside the host element
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => {
        if (this.closeOnOutside() && this.isOpen()) {
          if (!this.el.nativeElement.contains(e.target as Node)) {
            this.close();
          }
        }
      });
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;
    this.isOpen.set(true);
    afterNextRender(() => {
      const panel = this.panel();
      if (panel) {
        this.animSvc.addEnterState(panel.nativeElement, 'overlay');
      }
    }, { injector: this.injector });
  }

  close(): void {
    const panel = this.panel();
    if (!panel) return;
    this.animSvc.addLeaveState(
      panel.nativeElement,
      () => this.isOpen.set(false),
      'overlay',
    );
  }

  // ─── Template handlers ────────────────────────────────────────────────────

  protected onTriggerClick(): void {
    if (this.trigger() === 'click') this.toggle();
  }

  protected onTriggerMouseEnter(): void {
    if (this.trigger() === 'hover') this.open();
  }

  protected onTriggerMouseLeave(): void {
    if (this.trigger() === 'hover') this.close();
  }
}
