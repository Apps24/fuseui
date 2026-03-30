import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseEmptyStateComponent } from './fuse-empty-state.component';

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseEmptyStateComponent],
  template: `
    <fuse-empty-state
      [icon]="icon"
      [title]="title"
      [description]="description"
      [actionLabel]="actionLabel"
      [actionVariant]="actionVariant"
      (actionClick)="onAction()">
    </fuse-empty-state>
  `,
})
class TestHostComponent {
  icon          = '';
  title         = '';
  description   = '';
  actionLabel   = '';
  actionVariant: 'solid' | 'outline' = 'outline';
  actionCount   = 0;
  onAction(): void { this.actionCount++; }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const el = (f: ComponentFixture<unknown>, sel: string): HTMLElement | null =>
  f.nativeElement.querySelector(sel);

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseEmptyStateComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders the wrapper', () => {
    expect(el(fixture, '.fuse-empty-state')).toBeTruthy();
  });

  it('wrapper has data-entering attribute', () => {
    expect(el(fixture, '.fuse-empty-state')!.hasAttribute('data-entering')).toBe(true);
  });

  // ── Icon ──────────────────────────────────────────────────────────────────

  it('does not render icon wrapper when icon is empty', () => {
    expect(el(fixture, '.fuse-empty-state__icon')).toBeNull();
  });

  it('renders fuse-icon when icon is set', () => {
    host.icon = 'inbox';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-empty-state__icon')).toBeTruthy();
    expect(el(fixture, 'fuse-icon')).toBeTruthy();
  });

  it('fuse-icon receives the icon name', () => {
    host.icon = 'inbox';
    fixture.detectChanges();
    const iconEl = el(fixture, 'fuse-icon');
    expect(iconEl).toBeTruthy();
  });

  // ── Title ─────────────────────────────────────────────────────────────────

  it('does not render title when empty', () => {
    expect(el(fixture, '.fuse-empty-state__title')).toBeNull();
  });

  it('renders title when set', () => {
    host.title = 'No results found';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-empty-state__title')!.textContent?.trim()).toBe('No results found');
  });

  // ── Description ───────────────────────────────────────────────────────────

  it('does not render description when empty', () => {
    expect(el(fixture, '.fuse-empty-state__description')).toBeNull();
  });

  it('renders description when set', () => {
    host.description = 'Try adjusting your search.';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-empty-state__description')!.textContent?.trim()).toBe('Try adjusting your search.');
  });

  // ── Action button ─────────────────────────────────────────────────────────

  it('does not render button when actionLabel is empty', () => {
    expect(el(fixture, 'fuse-button')).toBeNull();
  });

  it('renders button when actionLabel is set', () => {
    host.actionLabel = 'Create item';
    fixture.detectChanges();
    expect(el(fixture, 'fuse-button')).toBeTruthy();
  });

  it('button text matches actionLabel', () => {
    host.actionLabel = 'Add new';
    fixture.detectChanges();
    expect(el(fixture, 'fuse-button')!.textContent?.trim()).toBe('Add new');
  });

  it('emits actionClick when button clicked', () => {
    host.actionLabel = 'Click me';
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('fuse-button button') as HTMLElement;
    btn.click();
    fixture.detectChanges();
    expect(host.actionCount).toBe(1);
  });

  // ── All content together ──────────────────────────────────────────────────

  it('renders all elements when all inputs are set', () => {
    host.icon        = 'star';
    host.title       = 'Nothing here';
    host.description = 'Add something to get started.';
    host.actionLabel = 'Get started';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-empty-state__icon')).toBeTruthy();
    expect(el(fixture, '.fuse-empty-state__title')).toBeTruthy();
    expect(el(fixture, '.fuse-empty-state__description')).toBeTruthy();
    expect(el(fixture, 'fuse-button')).toBeTruthy();
  });

  // ── Content projection (illustration slot) ────────────────────────────────

  it('does not render icon wrapper when no icon — illustration slot is available', () => {
    host.icon = '';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-empty-state__icon')).toBeNull();
  });
});
