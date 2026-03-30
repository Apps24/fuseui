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

@Component({
  selector: 'fuse-dropdown',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-dropdown.component.html',
  styleUrl: './fuse-dropdown.component.scss',
  host: { class: 'fuse-dropdown' },
})
export class FuseDropdownComponent {
  // ─── Inputs ────────────────────────────────────────────────────────────────

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
    this.toggle();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  protected onEscape(): void {
    this.close();
  }
}
