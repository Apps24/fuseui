import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseChipComponent } from './fuse-chip.component';

// ─── Test hosts ───────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseChipComponent],
  template: `
    <fuse-chip
      [variant]="variant"
      [color]="color"
      [size]="size"
      [closable]="closable"
      [selectable]="selectable"
      [(selected)]="selected"
      (chipClose)="onClose()">
      Label
    </fuse-chip>
  `,
})
class TestHostComponent {
  variant: 'solid' | 'flat' | 'bordered' = 'flat';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';
  size: 'sm' | 'md' = 'md';
  closable  = false;
  selectable = false;
  selected  = false;
  closeCalls = 0;
  onClose() { this.closeCalls++; }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function chip(fix: ComponentFixture<unknown>): HTMLElement {
  return fix.nativeElement.querySelector('.fuse-chip');
}

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseChipComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ───────────────────────────────────────────────────────────────

  it('renders the chip span', () => {
    expect(chip(fixture)).toBeTruthy();
  });

  it('renders projected label text', () => {
    expect(fixture.nativeElement.textContent).toContain('Label');
  });

  // ── Default classes ──────────────────────────────────────────────────────────

  it('applies flat variant class by default', () => {
    expect(chip(fixture).classList).toContain('fuse-chip--flat');
  });

  it('applies primary color class by default', () => {
    expect(chip(fixture).classList).toContain('fuse-chip--primary');
  });

  it('applies md size class by default', () => {
    expect(chip(fixture).classList).toContain('fuse-chip--md');
  });

  // ── Variant input ────────────────────────────────────────────────────────────

  it('applies solid variant class', () => {
    host.variant = 'solid';
    fixture.detectChanges();
    expect(chip(fixture).classList).toContain('fuse-chip--solid');
    expect(chip(fixture).classList).not.toContain('fuse-chip--flat');
  });

  it('applies bordered variant class', () => {
    host.variant = 'bordered';
    fixture.detectChanges();
    expect(chip(fixture).classList).toContain('fuse-chip--bordered');
  });

  // ── Color input ──────────────────────────────────────────────────────────────

  it('applies success color class', () => {
    host.color = 'success';
    fixture.detectChanges();
    expect(chip(fixture).classList).toContain('fuse-chip--success');
  });

  it('applies danger color class', () => {
    host.color = 'danger';
    fixture.detectChanges();
    expect(chip(fixture).classList).toContain('fuse-chip--danger');
  });

  it('applies warning color class', () => {
    host.color = 'warning';
    fixture.detectChanges();
    expect(chip(fixture).classList).toContain('fuse-chip--warning');
  });

  // ── Size input ───────────────────────────────────────────────────────────────

  it('applies sm size class', () => {
    host.size = 'sm';
    fixture.detectChanges();
    expect(chip(fixture).classList).toContain('fuse-chip--sm');
    expect(chip(fixture).classList).not.toContain('fuse-chip--md');
  });

  // ── Closable ─────────────────────────────────────────────────────────────────

  it('does not render close button by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-chip__close')).toBeNull();
  });

  it('renders close button when closable=true', () => {
    host.closable = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-chip__close')).toBeTruthy();
  });

  it('emits chipClose when close button is clicked', () => {
    host.closable = true;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.fuse-chip__close').click();
    expect(host.closeCalls).toBe(1);
  });

  it('close button click does not toggle selection', () => {
    host.closable   = true;
    host.selectable = true;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.fuse-chip__close').click();
    fixture.detectChanges();
    expect(host.selected).toBe(false);
  });

  // ── Selectable / selected model ───────────────────────────────────────────────

  it('does not toggle selection on click when selectable=false', () => {
    fixture.nativeElement.querySelector('.fuse-chip-host').click();
    fixture.detectChanges();
    expect(host.selected).toBe(false);
  });

  it('toggles selected to true on click when selectable=true', () => {
    host.selectable = true;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.fuse-chip-host').click();
    fixture.detectChanges();
    expect(host.selected).toBe(true);
  });

  it('toggles selected back to false on second click', () => {
    host.selectable = true;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.fuse-chip-host');
    el.click(); fixture.detectChanges();
    el.click(); fixture.detectChanges();
    expect(host.selected).toBe(false);
  });

  it('applies selected class when selected=true', () => {
    host.selectable = true;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.fuse-chip-host').click();
    fixture.detectChanges();
    expect(chip(fixture).classList).toContain('fuse-chip--selected');
  });

  it('sets data-selected attribute from model', () => {
    host.selected = true;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.fuse-chip-host').getAttribute('data-selected')
    ).toBe('true');
  });

  it('data-selectable attribute reflects selectable input', () => {
    host.selectable = true;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.fuse-chip-host').getAttribute('data-selectable')
    ).toBe('true');
  });
});
