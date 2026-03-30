import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { FuseAnimationService } from '@fuse/core';
import { FuseTooltipContentComponent } from './fuse-tooltip-content.component';

type Placement = 'top' | 'bottom' | 'left' | 'right';

// ─── Placement → CDK ConnectedPosition map ────────────────────────────────────

const POSITIONS: Record<Placement, ConnectedPosition[]> = {
  top: [
    { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom', offsetY: -6 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top',    offsetY:  6 },
  ],
  bottom: [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top',    offsetY:  6 },
    { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom', offsetY: -6 },
  ],
  left: [
    { originX: 'start', originY: 'center', overlayX: 'end',   overlayY: 'center', offsetX: -6 },
    { originX: 'end',   originY: 'center', overlayX: 'start', overlayY: 'center', offsetX:  6 },
  ],
  right: [
    { originX: 'end',   originY: 'center', overlayX: 'start', overlayY: 'center', offsetX:  6 },
    { originX: 'start', originY: 'center', overlayX: 'end',   overlayY: 'center', offsetX: -6 },
  ],
};

@Directive({
  selector: '[fuseTooltip]',
  standalone: true,
})
export class FuseTooltipDirective implements OnDestroy {
  // ─── Inputs ────────────────────────────────────────────────────────────────

  readonly fuseTooltip          = input.required<string>();
  readonly fuseTooltipPlacement = input<Placement>('top');
  readonly fuseTooltipDelay     = input<number>(200);
  readonly fuseTooltipDisabled  = input<boolean>(false);

  // ─── Services ──────────────────────────────────────────────────────────────

  private readonly destroyRef = inject(DestroyRef);
  private readonly animSvc    = inject(FuseAnimationService);
  private readonly overlay    = inject(Overlay);
  private readonly el         = inject(ElementRef<HTMLElement>);

  // ─── State ─────────────────────────────────────────────────────────────────

  private overlayRef: OverlayRef | null = null;
  private portal: ComponentPortal<FuseTooltipContentComponent> | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private isOpen = false;

  constructor() {
    this.portal = new ComponentPortal(FuseTooltipContentComponent);
    this.destroyRef.onDestroy(() => this.disposeAll());
  }

  // ─── Host listeners ────────────────────────────────────────────────────────

  @HostListener('mouseenter')
  show(): void {
    if (this.fuseTooltipDisabled()) return;
    this.clearTimer();
    this.openTimer = setTimeout(() => this.createTooltip(), this.fuseTooltipDelay());
  }

  @HostListener('mouseleave')
  hide(): void {
    this.clearTimer();
    this.destroyTooltip();
  }

  @HostListener('focus')
  onFocus(): void { this.show(); }

  @HostListener('blur')
  onBlur(): void { this.hide(); }

  // ─── Tooltip lifecycle ─────────────────────────────────────────────────────

  private createTooltip(): void {
    if (this.isOpen || !this.fuseTooltip()) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.el)
      .withPositions(POSITIONS[this.fuseTooltipPlacement()])
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'fuse-tooltip-panel',
    });

    const ref = this.overlayRef.attach(this.portal!);
    ref.instance.text.set(this.fuseTooltip());
    this.isOpen = true;

    // Animate in
    const node = this.overlayRef.overlayElement.firstElementChild as HTMLElement;
    this.animSvc.addEnterState(node, 'tooltip');

    // Accessible: link tooltip to host via aria-describedby
    const id = `fuse-tt-${Math.random().toString(36).slice(2)}`;
    node.id = id;
    this.el.nativeElement.setAttribute('aria-describedby', id);
  }

  private destroyTooltip(): void {
    if (!this.isOpen || !this.overlayRef) return;
    this.isOpen = false;

    const node = this.overlayRef.overlayElement.firstElementChild as HTMLElement | null;
    if (!node) {
      this.overlayRef.detach();
      this.el.nativeElement.removeAttribute('aria-describedby');
      return;
    }

    this.animSvc.addLeaveState(
      node,
      () => {
        this.overlayRef?.detach();
        this.el.nativeElement.removeAttribute('aria-describedby');
      },
      'default',
    );
  }

  // ─── Cleanup ───────────────────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.disposeAll();
  }

  private disposeAll(): void {
    this.clearTimer();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen = false;
    this.el.nativeElement.removeAttribute('aria-describedby');
  }

  private clearTimer(): void {
    if (this.openTimer !== null) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
  }
}
