import {
  ApplicationRef,
  DestroyRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
} from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { FuseToastComponent, FuseToastType } from './fuse-toast.component';

// ─── Public types ─────────────────────────────────────────────────────────────

export type FuseToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface FuseToastOptions {
  type?: FuseToastType;
  /** Auto-dismiss after ms. Pass 0 to disable auto-dismiss. Default: 3000 */
  duration?: number;
  action?: { label: string; callback: () => void };
  position?: FuseToastPosition;
}

export interface FuseToastRef {
  /** Trigger the leave animation then remove the toast. */
  dismiss(): void;
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class FuseToastService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);

  /** One container element per position, created lazily. */
  private readonly containers = new Map<FuseToastPosition, HTMLElement>();

  show(message: string, options?: FuseToastOptions): FuseToastRef {
    const type     = options?.type     ?? 'info';
    const duration = options?.duration ?? 3000;
    const position = options?.position ?? 'top-right';

    // ── Create the component ────────────────────────────────────────────────
    const ref = createComponent(FuseToastComponent, {
      environmentInjector: this.injector,
    });

    ref.setInput('message', message);
    ref.setInput('type', type);
    if (options?.action) {
      ref.setInput('action', options.action);
    }

    this.appRef.attachView(ref.hostView);

    const node = (ref.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    this.getContainer(position).appendChild(node);

    // ── Cleanup: called after the leave animation ends ──────────────────────
    const cleanup = (): void => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
      node.remove();
    };

    outputToObservable(ref.instance.toastClose)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(cleanup);

    // ── Auto-dismiss ────────────────────────────────────────────────────────
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const toastRef: FuseToastRef = {
      dismiss: () => ref.instance.close(),
    };

    if (duration > 0) {
      timeoutId = setTimeout(() => toastRef.dismiss(), duration);
    }

    // Cancel the timer if the user manually dismisses before it fires
    outputToObservable(ref.instance.toastClose)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (timeoutId !== null) clearTimeout(timeoutId);
      });

    return toastRef;
  }

  // ─── Convenience wrappers ──────────────────────────────────────────────────

  success(message: string, options?: Omit<FuseToastOptions, 'type'>): FuseToastRef {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options?: Omit<FuseToastOptions, 'type'>): FuseToastRef {
    return this.show(message, { ...options, type: 'error' });
  }

  warning(message: string, options?: Omit<FuseToastOptions, 'type'>): FuseToastRef {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options?: Omit<FuseToastOptions, 'type'>): FuseToastRef {
    return this.show(message, { ...options, type: 'info' });
  }

  // ─── Container management ─────────────────────────────────────────────────

  private getContainer(position: FuseToastPosition): HTMLElement {
    if (!this.containers.has(position)) {
      const el = document.createElement('div');
      el.className = `fuse-toast-container fuse-toast-container--${position}`;

      // Layout styles applied inline so they work without a global stylesheet
      el.style.cssText = [
        'position:fixed',
        'z-index:9999',
        'display:flex',
        'flex-direction:column',
        'gap:8px',
        'pointer-events:none',
      ].join(';');

      // Allow the toast items themselves to be interactive
      el.style.setProperty('--fuse-toast-pe', 'auto');

      this.applyPositionStyles(el, position);
      document.body.appendChild(el);
      this.containers.set(position, el);

      // Remove container when the service is destroyed (app teardown)
      this.destroyRef.onDestroy(() => {
        el.remove();
        this.containers.delete(position);
      });
    }

    return this.containers.get(position)!;
  }

  private applyPositionStyles(el: HTMLElement, position: FuseToastPosition): void {
    switch (position) {
      case 'top-right':
        Object.assign(el.style, { top: '16px', right: '16px' });
        break;
      case 'top-left':
        Object.assign(el.style, { top: '16px', left: '16px' });
        break;
      case 'top-center':
        Object.assign(el.style, { top: '16px', left: '50%', transform: 'translateX(-50%)' });
        break;
      case 'bottom-right':
        Object.assign(el.style, { bottom: '16px', right: '16px' });
        break;
      case 'bottom-left':
        Object.assign(el.style, { bottom: '16px', left: '16px' });
        break;
      case 'bottom-center':
        Object.assign(el.style, { bottom: '16px', left: '50%', transform: 'translateX(-50%)' });
        break;
    }
  }
}
