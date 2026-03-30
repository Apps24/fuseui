import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  Type,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import type { FuseModalConfig } from './fuse-modal.config';
import type { FuseModalRef } from './fuse-modal-ref';
import {
  FUSE_MODAL_COMPONENT,
  FUSE_MODAL_CONFIG,
  FUSE_MODAL_REF,
} from './fuse-modal.tokens';

@Component({
  selector: 'fuse-modal',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-modal.component.html',
  styleUrl: './fuse-modal.component.scss',
})
export class FuseModalComponent implements AfterViewInit, OnDestroy {
  // ─── Injected tokens ───────────────────────────────────────────────────────

   
  protected readonly config = inject<Required<FuseModalConfig>>(FUSE_MODAL_CONFIG);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly modalRef = inject<FuseModalRef<any>>(FUSE_MODAL_REF);
  private readonly componentType = inject<Type<unknown>>(FUSE_MODAL_COMPONENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);

  // ─── View refs ─────────────────────────────────────────────────────────────

  private readonly contentRef = viewChild.required('contentRef', { read: ViewContainerRef });

  // ─── Private state ─────────────────────────────────────────────────────────

  private focusTrap!: FocusTrap;

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    // Render the hosted component into the <ng-template #contentRef>
    this.contentRef().createComponent(this.componentType);

    // Trap focus inside the modal panel
    this.focusTrap = this.focusTrapFactory.create(this.el.nativeElement);
    this.focusTrap.focusInitialElementWhenReady();

    // ESC key → close (only when closable)
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((e) => e.key === 'Escape'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.config.closable) {
          this.modalRef.close();
        }
      });
  }

  ngOnDestroy(): void {
    this.focusTrap?.destroy();
  }
}
