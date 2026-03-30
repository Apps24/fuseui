import { ApplicationRef, Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FuseToastService } from './fuse-toast.service';

// Minimal host to bootstrap ApplicationRef in TestBed
@Component({ standalone: true, template: '' })
class TestHostComponent {}

describe('FuseToastService', () => {
  let service: FuseToastService;
  let appRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    service = TestBed.inject(FuseToastService);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    // Remove any toast containers created during the test
    document.querySelectorAll('.fuse-toast-container').forEach(el => el.remove());
    document.querySelectorAll('fuse-toast').forEach(el => el.remove());
  });

  // ─── Injectable ──────────────────────────────────────────────────────────────

  it('is injectable', () => {
    expect(service).toBeTruthy();
  });

  // ─── show() basic ────────────────────────────────────────────────────────────

  it('show() returns a FuseToastRef with a dismiss() function', () => {
    const ref = service.show('Hello');
    appRef.tick();
    expect(typeof ref.dismiss).toBe('function');
  });

  it('show() appends a fuse-toast element to the DOM', () => {
    service.show('Visible toast');
    appRef.tick();
    expect(document.querySelector('fuse-toast')).toBeTruthy();
  });

  it('show() renders the correct message', () => {
    service.show('My message');
    appRef.tick();
    const msg = document.querySelector('.fuse-toast__message');
    expect(msg?.textContent?.trim()).toBe('My message');
  });

  it('show() creates a container div in the DOM', () => {
    service.show('Test');
    expect(document.querySelector('.fuse-toast-container')).toBeTruthy();
  });

  // ─── Position ────────────────────────────────────────────────────────────────

  it('default position is top-right', () => {
    service.show('Test');
    expect(document.querySelector('.fuse-toast-container--top-right')).toBeTruthy();
  });

  it('uses the requested position for the container', () => {
    service.show('Test', { position: 'bottom-center' });
    expect(document.querySelector('.fuse-toast-container--bottom-center')).toBeTruthy();
  });

  it('reuses the same container for the same position', () => {
    service.show('First');
    service.show('Second');
    appRef.tick();
    const containers = document.querySelectorAll('.fuse-toast-container--top-right');
    expect(containers.length).toBe(1);
  });

  it('creates separate containers for different positions', () => {
    service.show('Top', { position: 'top-right' });
    service.show('Bottom', { position: 'bottom-left' });
    expect(document.querySelectorAll('.fuse-toast-container').length).toBe(2);
  });

  // ─── Auto-dismiss ────────────────────────────────────────────────────────────

  it('auto-dismisses after the specified duration', fakeAsync(() => {
    service.show('Auto', { duration: 1000 });
    appRef.tick();
    expect(document.querySelector('fuse-toast')).toBeTruthy();

    tick(1000);
    appRef.tick();

    // After dismiss(), close() is called → fuse-toast--leaving class is applied.
    // The actual removal waits for animationend; dispatch a plain Event (JSDOM
    // does not define AnimationEvent; the handler only reads target/currentTarget).
    const toastEl = document.querySelector('fuse-toast') as HTMLElement;
    if (toastEl) {
      toastEl.dispatchEvent(new Event('animationend'));
      appRef.tick();
    }

    expect(document.querySelector('fuse-toast')).toBeNull();
  }));

  it('does NOT auto-dismiss when duration is 0', fakeAsync(() => {
    service.show('Persistent', { duration: 0 });
    appRef.tick();
    tick(10000);
    appRef.tick();
    // Still present — no auto-dismiss
    expect(document.querySelector('fuse-toast')).toBeTruthy();
  }));

  // ─── Manual dismiss ──────────────────────────────────────────────────────────

  it('FuseToastRef.dismiss() removes the toast after animationend', fakeAsync(() => {
    const ref = service.show('Persistent', { duration: 0 });
    appRef.tick();

    ref.dismiss();
    appRef.tick();

    // Simulate leave animation ending (plain Event — JSDOM has no AnimationEvent)
    const toastEl = document.querySelector('fuse-toast') as HTMLElement;
    toastEl.dispatchEvent(new Event('animationend'));
    appRef.tick();

    expect(document.querySelector('fuse-toast')).toBeNull();
  }));

  // ─── Convenience methods ─────────────────────────────────────────────────────

  it('success() calls show() with type=success', () => {
    const spy = jest.spyOn(service, 'show');
    service.success('Done!');
    expect(spy).toHaveBeenCalledWith('Done!', expect.objectContaining({ type: 'success' }));
  });

  it('error() calls show() with type=error', () => {
    const spy = jest.spyOn(service, 'show');
    service.error('Oops');
    expect(spy).toHaveBeenCalledWith('Oops', expect.objectContaining({ type: 'error' }));
  });

  it('warning() calls show() with type=warning', () => {
    const spy = jest.spyOn(service, 'show');
    service.warning('Watch out');
    expect(spy).toHaveBeenCalledWith('Watch out', expect.objectContaining({ type: 'warning' }));
  });

  it('info() calls show() with type=info', () => {
    const spy = jest.spyOn(service, 'show');
    service.info('FYI');
    expect(spy).toHaveBeenCalledWith('FYI', expect.objectContaining({ type: 'info' }));
  });

  // ─── Multiple toasts ─────────────────────────────────────────────────────────

  it('stacks multiple toasts in the same container', () => {
    service.show('First',  { duration: 0 });
    service.show('Second', { duration: 0 });
    service.show('Third',  { duration: 0 });
    appRef.tick();
    expect(document.querySelectorAll('fuse-toast').length).toBe(3);
  });
});
