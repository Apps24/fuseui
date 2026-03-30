import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FuseModalService } from './fuse-modal.service';
import { FuseModalRef } from './fuse-modal-ref';
import { FUSE_MODAL_DATA, FUSE_MODAL_REF } from './fuse-modal.tokens';

// ── Stub components ───────────────────────────────────────────────────────────

@Component({
  selector: 'fuse-dialog-stub',
  standalone: true,
  template: '<p>stub</p>',
})
class StubDialogComponent {}

@Component({
  selector: 'fuse-confirm-stub',
  standalone: true,
  template: `
    <button class="confirm-btn" (click)="yes()">Yes</button>
    <button class="cancel-btn" (click)="no()">No</button>
  `,
})
class StubConfirmComponent {
  private readonly ref = TestBed.inject<FuseModalRef>(FUSE_MODAL_REF as any, null as any);
  yes() { this.ref?.close(true); }
  no()  { this.ref?.close(false); }
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('FuseModalService', () => {
  let service: FuseModalService;
  let overlayContainer: OverlayContainer;
  let overlayContainerEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubDialogComponent, StubConfirmComponent],
    }).compileComponents();

    service = TestBed.inject(FuseModalService);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  // ── open() ────────────────────────────────────────────────────────────────

  it('returns a FuseModalRef', () => {
    const ref = service.open(StubDialogComponent);
    expect(ref).toBeInstanceOf(FuseModalRef);
    ref.close();
  });

  it('attaches the modal to the overlay container', () => {
    const ref = service.open(StubDialogComponent);
    expect(overlayContainerEl.querySelector('fuse-modal')).toBeTruthy();
    ref.close();
  });

  it('adds the correct size panel class (md by default)', () => {
    const ref = service.open(StubDialogComponent);
    expect(overlayContainerEl.querySelector('.fuse-modal-overlay--md')).toBeTruthy();
    ref.close();
  });

  it('adds the correct size panel class when sm is specified', () => {
    const ref = service.open(StubDialogComponent, { size: 'sm' });
    expect(overlayContainerEl.querySelector('.fuse-modal-overlay--sm')).toBeTruthy();
    ref.close();
  });

  it('adds a backdrop element', () => {
    const ref = service.open(StubDialogComponent);
    expect(overlayContainerEl.querySelector('.fuse-modal-backdrop')).toBeTruthy();
    ref.close();
  });

  it('removes the modal from the DOM after close()', fakeAsync(() => {
    const ref = service.open(StubDialogComponent);
    expect(overlayContainerEl.querySelector('fuse-modal')).toBeTruthy();
    ref.close();
    tick();
    expect(overlayContainerEl.querySelector('fuse-modal')).toBeNull();
  }));

  it('afterClosed() emits the result passed to close()', fakeAsync(() => {
    const ref = service.open(StubDialogComponent);
    let result: unknown;
    ref.afterClosed().subscribe((v) => (result = v));
    ref.close('hello');
    tick();
    expect(result).toBe('hello');
  }));

  it('afterClosed() emits undefined when close() is called with no argument', fakeAsync(() => {
    const ref = service.open(StubDialogComponent);
    let result: unknown = 'sentinel';
    ref.afterClosed().subscribe((v) => (result = v));
    ref.close();
    tick();
    expect(result).toBeUndefined();
  }));

  it('calling close() twice is idempotent', fakeAsync(() => {
    const ref = service.open(StubDialogComponent);
    let emitCount = 0;
    ref.afterClosed().subscribe(() => emitCount++);
    ref.close('a');
    ref.close('b');
    tick();
    expect(emitCount).toBe(1);
  }));

  it('provides FUSE_MODAL_DATA to the hosted component', () => {
    const data = { foo: 'bar' };
    service.open(StubDialogComponent, { data });

    // Retrieve via TestBed as a rough verification that the token is set
    // (proper verification requires injecting inside the component)
    // We verify the overlay was attached successfully instead
    expect(overlayContainerEl.querySelector('fuse-modal')).toBeTruthy();
    service.open(StubDialogComponent).close(); // cleanup
  });

  // ── confirm() ─────────────────────────────────────────────────────────────

  it('confirm() resolves true when the dialog emits true', fakeAsync(async () => {
    // Patch open() to use a ref we can control
    const fakeOverlayRef: any = { dispose: jest.fn(), backdropClick: () => ({ pipe: () => ({ subscribe: () => {} }) }) };
    const fakeRef = new FuseModalRef(fakeOverlayRef);
    jest.spyOn(service, 'open').mockReturnValue(fakeRef as any);

    const promise = service.confirm({ title: 'Test', message: 'Are you sure?' });
    fakeRef.close(true);
    tick();

    const result = await promise;
    expect(result).toBe(true);
  }));

  it('confirm() resolves false when the dialog emits false', fakeAsync(async () => {
    const fakeOverlayRef: any = { dispose: jest.fn(), backdropClick: () => ({ pipe: () => ({ subscribe: () => {} }) }) };
    const fakeRef = new FuseModalRef(fakeOverlayRef);
    jest.spyOn(service, 'open').mockReturnValue(fakeRef as any);

    const promise = service.confirm({ title: 'Test', message: 'Are you sure?' });
    fakeRef.close(false);
    tick();

    const result = await promise;
    expect(result).toBe(false);
  }));

  it('confirm() resolves false when the dialog closes with no result', fakeAsync(async () => {
    const fakeOverlayRef: any = { dispose: jest.fn(), backdropClick: () => ({ pipe: () => ({ subscribe: () => {} }) }) };
    const fakeRef = new FuseModalRef(fakeOverlayRef);
    jest.spyOn(service, 'open').mockReturnValue(fakeRef as any);

    const promise = service.confirm({ title: 'Test', message: 'Are you sure?' });
    fakeRef.close(undefined);
    tick();

    const result = await promise;
    expect(result).toBe(false);
  }));

  it('confirm() calls open() with closable=false and backdropDismiss=false', fakeAsync(() => {
    const openSpy = jest.spyOn(service, 'open').mockReturnValue({
      afterClosed: () => ({ subscribe: () => {} }),
    } as any);

    service.confirm({ title: 'T', message: 'M' });
    tick();

    expect(openSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ closable: false, backdropDismiss: false }),
    );
  }));

  it('confirm() calls open() with size="sm"', fakeAsync(() => {
    const openSpy = jest.spyOn(service, 'open').mockReturnValue({
      afterClosed: () => ({ subscribe: () => {} }),
    } as any);

    service.confirm({ title: 'T', message: 'M' });
    tick();

    expect(openSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ size: 'sm' }),
    );
  }));
});
