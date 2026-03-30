import {
  Injectable,
  Injector,
  Type,
  inject,
} from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { take } from 'rxjs/operators';
import { FuseModalComponent } from './fuse-modal.component';
import { FuseModalRef } from './fuse-modal-ref';
import type { FuseConfirmOptions, FuseModalConfig, FuseModalSize } from './fuse-modal.config';
import {
  FUSE_MODAL_COMPONENT,
  FUSE_MODAL_CONFIG,
  FUSE_MODAL_DATA,
  FUSE_MODAL_REF,
} from './fuse-modal.tokens';
import { FuseConfirmDialogComponent } from '../confirm/fuse-confirm-dialog.component';

const SIZE_ORDER: FuseModalSize[] = ['sm', 'md', 'lg', 'fullscreen'];

@Injectable({ providedIn: 'root' })
export class FuseModalService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  /**
   * Open any standalone component in a modal panel.
   * The component can inject FUSE_MODAL_REF and FUSE_MODAL_DATA.
   */
  open<T>(component: Type<T>, config?: FuseModalConfig): FuseModalRef<T> {
    const resolved = this.resolveConfig(config);

    const overlayRef = this.overlay.create(this.buildOverlayConfig(resolved));
    const modalRef = new FuseModalRef<T>(overlayRef);

    const childInjector = Injector.create({
      providers: [
        { provide: FUSE_MODAL_COMPONENT, useValue: component },
        { provide: FUSE_MODAL_CONFIG, useValue: resolved },
        { provide: FUSE_MODAL_REF, useValue: modalRef },
        { provide: FUSE_MODAL_DATA, useValue: resolved.data ?? null },
      ],
      parent: this.injector,
    });

    const portal = new ComponentPortal(FuseModalComponent, null, childInjector);
    overlayRef.attach(portal);

    if (resolved.backdropDismiss) {
      overlayRef
        .backdropClick()
        .pipe(take(1))
        .subscribe(() => modalRef.close());
    }

    return modalRef;
  }

  /**
   * Show a pre-built confirmation dialog.
   * Resolves `true` if the user confirms, `false` otherwise.
   */
  confirm(options: FuseConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const ref = this.open(FuseConfirmDialogComponent, {
        size: 'sm',
        closable: false,
        backdropDismiss: false,
        data: options,
      });
      ref.afterClosed().subscribe((result) => resolve(!!result));
    });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private resolveConfig(config?: FuseModalConfig): Required<FuseModalConfig> {
    return {
      size: config?.size ?? 'md',
      closable: config?.closable !== false,
      backdropDismiss: config?.backdropDismiss !== false,
      data: config?.data ?? null,
    };
  }

  private buildOverlayConfig(config: Required<FuseModalConfig>): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'fuse-modal-backdrop',
      panelClass: [
        'fuse-modal-overlay',
        `fuse-modal-overlay--${config.size}`,
      ],
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
  }
}

// Unused import guard — ensures the SIZE_ORDER tuple is reachable.
void SIZE_ORDER;
