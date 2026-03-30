import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FusePopoverComponent } from './fuse-popover.component';

// ─── Test hosts ───────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FusePopoverComponent],
  template: `
    <fuse-popover
      [placement]="placement"
      [trigger]="triggerType"
      [closeOnOutside]="closeOnOutside"
      [(isOpen)]="isOpen">
      <button fusePopoverTrigger class="trigger-btn">Open</button>
      <div fusePopoverContent class="popover-body">Popover content</div>
    </fuse-popover>
  `,
})
class TestHostComponent {
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  triggerType: 'click' | 'hover' = 'click';
  closeOnOutside = true;
  isOpen = false;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function triggerBtn(fix: ComponentFixture<unknown>): HTMLButtonElement {
  return fix.nativeElement.querySelector('.trigger-btn');
}

function panel(fix: ComponentFixture<unknown>): HTMLElement | null {
  return fix.nativeElement.querySelector('.fuse-popover__panel');
}

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FusePopoverComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(fakeAsync(() => {
    // Ensure any pending leave animations are flushed
    if (host.isOpen) {
      triggerBtn(fixture).click();
      fixture.detectChanges();
      tick(300);
      fixture.detectChanges();
    }
  }));

  // ── Initial state ────────────────────────────────────────────────────────────

  it('panel is hidden by default', () => {
    expect(panel(fixture)).toBeNull();
  });

  it('isOpen model is false by default', () => {
    expect(host.isOpen).toBe(false);
  });

  // ── Show / hide ──────────────────────────────────────────────────────────────

  it('shows panel on trigger click', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(panel(fixture)).toBeTruthy();
  });

  it('hides panel on second trigger click', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    triggerBtn(fixture).click(); fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(panel(fixture)).toBeNull();
  }));

  // ── Content ──────────────────────────────────────────────────────────────────

  it('renders projected popover content', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(panel(fixture)?.textContent?.trim()).toContain('Popover content');
  });

  // ── Placement ────────────────────────────────────────────────────────────────

  it('sets data-placement="bottom" by default', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(panel(fixture)?.getAttribute('data-placement')).toBe('bottom');
  });

  it('sets data-placement from placement input', () => {
    host.placement = 'top';
    fixture.detectChanges();
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(panel(fixture)?.getAttribute('data-placement')).toBe('top');
  });

  it('sets data-placement=left', () => {
    host.placement = 'left';
    fixture.detectChanges();
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(panel(fixture)?.getAttribute('data-placement')).toBe('left');
  });

  it('sets data-placement=right', () => {
    host.placement = 'right';
    fixture.detectChanges();
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(panel(fixture)?.getAttribute('data-placement')).toBe('right');
  });

  // ── model<boolean> ───────────────────────────────────────────────────────────

  it('updates isOpen model to true when opened', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(host.isOpen).toBe(true);
  });

  it('updates isOpen model to false when closed', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    triggerBtn(fixture).click(); fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(host.isOpen).toBe(false);
  }));

  // ── Hover trigger ─────────────────────────────────────────────────────────────

  it('opens on mouseenter when trigger=hover', () => {
    host.triggerType = 'hover';
    fixture.detectChanges();
    const triggerEl = fixture.nativeElement.querySelector('.fuse-popover__trigger');
    triggerEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    expect(panel(fixture)).toBeTruthy();
  });

  it('does not open on click when trigger=hover', () => {
    host.triggerType = 'hover';
    fixture.detectChanges();
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(panel(fixture)).toBeNull();
  });

  it('closes on mouseleave when trigger=hover', fakeAsync(() => {
    host.triggerType = 'hover';
    fixture.detectChanges();
    const triggerEl = fixture.nativeElement.querySelector('.fuse-popover__trigger');
    triggerEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    triggerEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(panel(fixture)).toBeNull();
  }));

  // ── closeOnOutside ────────────────────────────────────────────────────────────

  it('closes on outside click when closeOnOutside=true', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(host.isOpen).toBe(false);
  }));

  it('stays open on outside click when closeOnOutside=false', fakeAsync(() => {
    host.closeOnOutside = false;
    fixture.detectChanges();
    triggerBtn(fixture).click(); fixture.detectChanges();
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(host.isOpen).toBe(true);
  }));

  it('does not close when clicking inside the popover host', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    // Click inside the host (panel content)
    const bodyEl = fixture.nativeElement.querySelector('.popover-body');
    bodyEl?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(host.isOpen).toBe(true);
  }));

  // ── No double-open ────────────────────────────────────────────────────────────

  it('open() is idempotent — does not create second panel', () => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    triggerBtn(fixture).click(); fixture.detectChanges(); // toggle closes
    // Rapid re-open
    const popover = fixture.nativeElement.querySelector('fuse-popover');
    const comp = fixture.debugElement.children[0].componentInstance as FusePopoverComponent;
    comp.open(); comp.open();
    fixture.detectChanges();
    const panels = fixture.nativeElement.querySelectorAll('.fuse-popover__panel');
    expect(panels.length).toBeLessThanOrEqual(1);
  });
});
