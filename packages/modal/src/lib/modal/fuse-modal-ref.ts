import { signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { OverlayRef } from '@angular/cdk/overlay';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FuseModalRef<T = any> {
  /** Internal signal carrying the close result. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _result = signal<any>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _closed$ = new Subject<any>();

  private _disposed = false;

  constructor(private readonly overlayRef: OverlayRef) {}

  /**
   * Close the modal and pass an optional result to `afterClosed()`.
   * Safe to call multiple times — subsequent calls are no-ops.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close(result?: any): void {
    if (this._disposed) return;
    this._disposed = true;
    this._result.set(result);
    this.overlayRef.dispose();
    this._closed$.next(result);
    this._closed$.complete();
  }

  /** Emits once with the close result then completes. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterClosed(): Observable<any> {
    return this._closed$.asObservable();
  }
}
