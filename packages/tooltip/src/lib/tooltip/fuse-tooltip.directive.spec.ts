import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseTooltipDirective } from './fuse-tooltip.directive';

// ─── Test hosts ───────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseTooltipDirective],
  template: `
    <button
      [fuseTooltip]="text"
      [fuseTooltipPlacement]="placement"
      [fuseTooltipDelay]="delay"
      [fuseTooltipDisabled]="disabled">
      Hover me
    </button>
  `,
})
class TestHostComponent {
  text      = 'Hello tooltip';
  placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  delay     = 0;   // 0ms so tests don't need long waits
  disabled  = false;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function triggerMouseEnter(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
}
function triggerMouseLeave(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
}
function triggerFocus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
}
function triggerBlur(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
}

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseTooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
    button = fixture.nativeElement.querySelector('button');
  });

  afterEach(() => {
    triggerMouseLeave(button);
    fixture.detectChanges();
  });

  // ── Show / hide ─────────────────────────────────────────────────────────────

  it('shows tooltip after mouseenter + delay', fakeAsync(() => {
    triggerMouseEnter(button);
    tick(0);
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')).toBeTruthy();
  }));

  it('hides tooltip on mouseleave', fakeAsync(() => {
    triggerMouseEnter(button);
    tick(0);
    fixture.detectChanges();
    triggerMouseLeave(button);
    fixture.detectChanges();
    // overlay detaches (animation is skipped when reduceMotion mock returns immediately)
    expect(overlayEl.querySelector('[role="tooltip"]')).toBeNull();
  }));

  it('shows tooltip on focus', fakeAsync(() => {
    triggerFocus(button);
    tick(0);
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')).toBeTruthy();
  }));

  it('hides tooltip on blur', fakeAsync(() => {
    triggerFocus(button);
    tick(0);
    fixture.detectChanges();
    triggerBlur(button);
    fixture.detectChanges();
    expect(overlayEl.querySelector('[role="tooltip"]')).toBeNull();
  }));

  // ── Content ─────────────────────────────────────────────────────────────────

  it('renders tooltip text from fuseTooltip input', fakeAsync(() => {
    triggerMouseEnter(button);
    tick(0);
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')?.textContent?.trim()).toBe('Hello tooltip');
  }));

  it('updates tooltip text when input changes', fakeAsync(() => {
    host.text = 'Updated text';
    fixture.detectChanges();
    triggerMouseEnter(button);
    tick(0);
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')?.textContent?.trim()).toBe('Updated text');
  }));

  // ── role="tooltip" ───────────────────────────────────────────────────────────

  it('tooltip element has role="tooltip"', fakeAsync(() => {
    triggerMouseEnter(button);
    tick(0);
    fixture.detectChanges();
    expect(overlayEl.querySelector('[role="tooltip"]')).toBeTruthy();
  }));

  // ── aria-describedby ─────────────────────────────────────────────────────────

  it('sets aria-describedby on host element when tooltip is shown', fakeAsync(() => {
    triggerMouseEnter(button);
    tick(0);
    fixture.detectChanges();
    expect(button.getAttribute('aria-describedby')).toBeTruthy();
  }));

  it('removes aria-describedby when tooltip is hidden', fakeAsync(() => {
    triggerMouseEnter(button);
    tick(0);
    fixture.detectChanges();
    triggerMouseLeave(button);
    fixture.detectChanges();
    expect(button.getAttribute('aria-describedby')).toBeNull();
  }));

  // ── Disabled ─────────────────────────────────────────────────────────────────

  it('does not show tooltip when fuseTooltipDisabled=true', fakeAsync(() => {
    host.disabled = true;
    fixture.detectChanges();
    triggerMouseEnter(button);
    tick(200);
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')).toBeNull();
  }));

  // ── Delay ───────────────────────────────────────────────────────────────────

  it('does not show immediately before delay elapses', fakeAsync(() => {
    host.delay = 300;
    fixture.detectChanges();
    triggerMouseEnter(button);
    tick(100); // before delay
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')).toBeNull();
    tick(200); // after delay
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')).toBeTruthy();
  }));

  it('cancels pending open when mouseleave fires before delay', fakeAsync(() => {
    host.delay = 300;
    fixture.detectChanges();
    triggerMouseEnter(button);
    tick(100);
    triggerMouseLeave(button);
    tick(300); // full delay would have elapsed
    fixture.detectChanges();
    expect(overlayEl.querySelector('.fuse-tooltip')).toBeNull();
  }));

  // ── No duplicate overlays ───────────────────────────────────────────────────

  it('does not create a second overlay on rapid re-hover', fakeAsync(() => {
    triggerMouseEnter(button); tick(0); fixture.detectChanges();
    triggerMouseLeave(button); fixture.detectChanges();
    triggerMouseEnter(button); tick(0); fixture.detectChanges();
    const tooltips = overlayEl.querySelectorAll('.fuse-tooltip');
    expect(tooltips.length).toBeLessThanOrEqual(1);
  }));
});
