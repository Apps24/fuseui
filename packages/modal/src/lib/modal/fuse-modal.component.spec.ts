import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { FuseModalComponent } from './fuse-modal.component';
import { FuseModalRef } from './fuse-modal-ref';
import type { FuseModalConfig } from './fuse-modal.config';
import {
  FUSE_MODAL_COMPONENT,
  FUSE_MODAL_CONFIG,
  FUSE_MODAL_REF,
} from './fuse-modal.tokens';

// ── Stub content component ────────────────────────────────────────────────────

@Component({
  selector: 'fuse-test-content',
  standalone: true,
  template: '<p class="content-text">Hello from content</p>',
})
class TestContentComponent {}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildModalRef(): FuseModalRef {
  const overlayRef: any = { dispose: jest.fn() };
  return new FuseModalRef(overlayRef);
}

/**
 * Sets up and creates a FuseModalComponent fixture.
 * IMPORTANT: must be called BEFORE any TestBed.inject() to avoid the
 * "module already instantiated" error when using overrideComponent.
 */
function createFixture(
  config: Partial<FuseModalConfig> = {},
  modalRef?: FuseModalRef,
): { fixture: ComponentFixture<FuseModalComponent>; modalRef: FuseModalRef } {
  const ref = modalRef ?? buildModalRef();

  const resolvedConfig: Required<FuseModalConfig> = {
    size: config.size ?? 'md',
    closable: config.closable !== false,
    backdropDismiss: config.backdropDismiss !== false,
    data: config.data ?? null,
  };

  // overrideComponent must be called BEFORE createComponent / inject
  TestBed.overrideComponent(FuseModalComponent, {
    set: {
      providers: [
        { provide: FUSE_MODAL_COMPONENT, useValue: TestContentComponent },
        { provide: FUSE_MODAL_CONFIG, useValue: resolvedConfig },
        { provide: FUSE_MODAL_REF, useValue: ref },
      ],
    },
  });

  const fixture = TestBed.createComponent(FuseModalComponent);
  fixture.detectChanges();
  return { fixture, modalRef: ref };
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('FuseModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseModalComponent, A11yModule],
    }).compileComponents();
    // NOTE: do NOT call TestBed.inject() here — it would instantiate the module
    // and prevent overrideComponent from working inside createFixture.
  });

  afterEach(() => {
    // Clean up the OverlayContainer AFTER the test (module already used)
    TestBed.inject(OverlayContainer).ngOnDestroy();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the modal panel with the correct size class for lg', () => {
    const { fixture } = createFixture({ size: 'lg' });
    const panel = fixture.nativeElement.querySelector('.fuse-modal__panel');
    expect(panel).toBeTruthy();
    expect(panel.classList).toContain('fuse-modal__panel--lg');
  });

  it('renders the correct size class for sm', () => {
    const { fixture } = createFixture({ size: 'sm' });
    const panel = fixture.nativeElement.querySelector('.fuse-modal__panel');
    expect(panel.classList).toContain('fuse-modal__panel--sm');
  });

  it('renders the correct size class for md (default)', () => {
    const { fixture } = createFixture();
    const panel = fixture.nativeElement.querySelector('.fuse-modal__panel');
    expect(panel.classList).toContain('fuse-modal__panel--md');
  });

  it('renders the correct size class for fullscreen', () => {
    const { fixture } = createFixture({ size: 'fullscreen' });
    const panel = fixture.nativeElement.querySelector('.fuse-modal__panel');
    expect(panel.classList).toContain('fuse-modal__panel--fullscreen');
  });

  it('sets role="dialog" and aria-modal="true" on the panel', () => {
    const { fixture } = createFixture();
    const panel = fixture.nativeElement.querySelector('.fuse-modal__panel');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
  });

  // ── Dynamic content ────────────────────────────────────────────────────────

  it('renders the hosted component inside the modal', () => {
    const { fixture } = createFixture();
    const content = fixture.nativeElement.querySelector('.content-text');
    expect(content).toBeTruthy();
    expect(content.textContent).toBe('Hello from content');
  });

  // ── Close button ──────────────────────────────────────────────────────────

  it('shows the close button when closable=true', () => {
    const { fixture } = createFixture({ closable: true });
    const btn = fixture.nativeElement.querySelector('.fuse-modal__close');
    expect(btn).toBeTruthy();
  });

  it('hides the close button when closable=false', () => {
    const { fixture } = createFixture({ closable: false });
    const btn = fixture.nativeElement.querySelector('.fuse-modal__close');
    expect(btn).toBeNull();
  });

  it('calls modalRef.close() when close button is clicked', () => {
    const { fixture, modalRef } = createFixture({ closable: true });
    const closeSpy = jest.spyOn(modalRef, 'close');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.fuse-modal__close');
    btn.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('close button has accessible aria-label', () => {
    const { fixture } = createFixture({ closable: true });
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.fuse-modal__close');
    expect(btn.getAttribute('aria-label')).toBe('Close modal');
  });

  // ── ESC key ───────────────────────────────────────────────────────────────

  it('closes the modal on ESC when closable=true', fakeAsync(() => {
    const { modalRef } = createFixture({ closable: true });
    const closeSpy = jest.spyOn(modalRef, 'close');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    tick();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  }));

  it('does NOT close the modal on ESC when closable=false', fakeAsync(() => {
    const { modalRef } = createFixture({ closable: false });
    const closeSpy = jest.spyOn(modalRef, 'close');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    tick();

    expect(closeSpy).not.toHaveBeenCalled();
  }));

  it('does not close on non-Escape keydown', fakeAsync(() => {
    const { modalRef } = createFixture({ closable: true });
    const closeSpy = jest.spyOn(modalRef, 'close');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    tick();

    expect(closeSpy).not.toHaveBeenCalled();
  }));

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  it('destroys the focus trap on ngOnDestroy', () => {
    const { fixture } = createFixture();
    const component = fixture.componentInstance as any;
    const destroySpy = jest.spyOn(component.focusTrap, 'destroy');
    fixture.destroy();
    expect(destroySpy).toHaveBeenCalledTimes(1);
  });
});
