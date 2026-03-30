import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseDropdownComponent } from './fuse-dropdown.component';
import { FuseDropdownItemComponent } from './fuse-dropdown-item.component';

// ─── Test hosts ───────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseDropdownComponent, FuseDropdownItemComponent],
  template: `
    <fuse-dropdown [(isOpen)]="isOpen" [closeOnOutside]="closeOnOutside">
      <button fuseDropdownTrigger class="trigger-btn">Options</button>
      <fuse-dropdown-item label="Edit"    (itemClick)="onItemClick('edit')"></fuse-dropdown-item>
      <fuse-dropdown-item label="Rename"  (itemClick)="onItemClick('rename')"></fuse-dropdown-item>
      <fuse-dropdown-item label="Delete"  [destructive]="true" (itemClick)="onItemClick('delete')"></fuse-dropdown-item>
      <fuse-dropdown-item label="Archive" [disabled]="true"></fuse-dropdown-item>
    </fuse-dropdown>
  `,
})
class TestHostComponent {
  isOpen        = false;
  closeOnOutside = true;
  lastClick     = '';
  onItemClick(action: string): void { this.lastClick = action; }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function triggerBtn(fix: ComponentFixture<unknown>): HTMLButtonElement {
  return fix.nativeElement.querySelector('.trigger-btn');
}

function dropPanel(fix: ComponentFixture<unknown>): HTMLElement | null {
  return fix.nativeElement.querySelector('.fuse-dropdown-panel');
}

function items(fix: ComponentFixture<unknown>): NodeListOf<Element> {
  return fix.nativeElement.querySelectorAll('fuse-dropdown-item');
}

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseDropdownComponent', () => {
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
    if (host.isOpen) {
      triggerBtn(fixture).click();
      fixture.detectChanges();
      tick(300);
      fixture.detectChanges();
    }
  }));

  // ── Initial state ──────────────────────────────────────────────────────────

  it('panel is hidden by default', () => {
    expect(dropPanel(fixture)).toBeNull();
  });

  it('isOpen model is false by default', () => {
    expect(host.isOpen).toBe(false);
  });

  // ── Show / hide ────────────────────────────────────────────────────────────

  it('shows panel on trigger click', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(dropPanel(fixture)).toBeTruthy();
  });

  it('hides panel on second trigger click', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    triggerBtn(fixture).click(); fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(dropPanel(fixture)).toBeNull();
  }));

  // ── model<boolean> ─────────────────────────────────────────────────────────

  it('updates isOpen to true when opened', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(host.isOpen).toBe(true);
  });

  it('updates isOpen to false when closed', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    triggerBtn(fixture).click(); fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(host.isOpen).toBe(false);
  }));

  // ── Items rendered ─────────────────────────────────────────────────────────

  it('renders projected items when panel is open', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(items(fixture).length).toBe(4);
  });

  it('renders item labels', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.fuse-dropdown-item');
    const labels = Array.from(buttons).map((b: Element) => (b as HTMLElement).textContent?.trim());
    expect(labels).toContain('Edit');
    expect(labels).toContain('Delete');
  });

  // ── Item interactions ──────────────────────────────────────────────────────

  it('emits itemClick when item button is clicked', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    const editBtn = fixture.nativeElement.querySelector('.fuse-dropdown-item') as HTMLButtonElement;
    editBtn.click();
    expect(host.lastClick).toBe('edit');
  });

  it('disabled item button is disabled', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    const allBtns = fixture.nativeElement.querySelectorAll('.fuse-dropdown-item') as NodeListOf<HTMLButtonElement>;
    const archiveBtn = allBtns[allBtns.length - 1];
    expect(archiveBtn.disabled).toBe(true);
  });

  it('destructive item has destructive modifier class', () => {
    triggerBtn(fixture).click();
    fixture.detectChanges();
    const allBtns = fixture.nativeElement.querySelectorAll('.fuse-dropdown-item');
    const deleteBtn = allBtns[2] as HTMLElement;
    expect(deleteBtn.classList).toContain('fuse-dropdown-item--destructive');
  });

  // ── closeOnOutside ─────────────────────────────────────────────────────────

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

  // ── Escape key ─────────────────────────────────────────────────────────────

  it('closes on Escape key', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    const panelEl = dropPanel(fixture)!;
    panelEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(host.isOpen).toBe(false);
  }));

  // ── Keyboard trigger ───────────────────────────────────────────────────────

  it('opens on Enter key on trigger', () => {
    const triggerEl = fixture.nativeElement.querySelector('.fuse-dropdown__trigger');
    triggerEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(dropPanel(fixture)).toBeTruthy();
  });

  it('opens on Space key on trigger', () => {
    const triggerEl = fixture.nativeElement.querySelector('.fuse-dropdown__trigger');
    triggerEl.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();
    expect(dropPanel(fixture)).toBeTruthy();
  });

  // ── ARIA ───────────────────────────────────────────────────────────────────

  it('trigger has aria-haspopup="menu"', () => {
    const triggerEl = fixture.nativeElement.querySelector('.fuse-dropdown__trigger');
    expect(triggerEl.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('trigger aria-expanded reflects open state', () => {
    const triggerEl = fixture.nativeElement.querySelector('.fuse-dropdown__trigger');
    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
    triggerBtn(fixture).click();
    fixture.detectChanges();
    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');
  });

  // ── No duplicate panels ────────────────────────────────────────────────────

  it('does not create a second panel on rapid re-open', fakeAsync(() => {
    triggerBtn(fixture).click(); fixture.detectChanges();
    triggerBtn(fixture).click(); fixture.detectChanges(); // close
    tick(0);
    triggerBtn(fixture).click(); fixture.detectChanges(); // re-open
    const panels = fixture.nativeElement.querySelectorAll('.fuse-dropdown-panel');
    expect(panels.length).toBeLessThanOrEqual(1);
  }));
});
