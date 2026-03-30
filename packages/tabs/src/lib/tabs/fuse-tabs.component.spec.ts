import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FuseTabsComponent } from './fuse-tabs.component';
import { FuseTabComponent } from './fuse-tab.component';

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseTabsComponent, FuseTabComponent],
  template: `
    <fuse-tabs
      [activeTab]="activeTab"
      [variant]="variant"
      [size]="size"
      (tabChange)="onTabChange($event)">
      <fuse-tab tabId="t1" label="Tab 1">Content 1</fuse-tab>
      <fuse-tab tabId="t2" label="Tab 2">Content 2</fuse-tab>
      <fuse-tab tabId="t3" label="Disabled" [disabled]="true">Content 3</fuse-tab>
    </fuse-tabs>
  `,
})
class TestHostComponent {
  activeTab = '';
  variant: 'line' | 'pills' | 'boxed' = 'line';
  size: 'sm' | 'md' = 'md';
  lastTabChange = '';
  onTabChange(id: string) { this.lastTabChange = id; }
}

@Component({
  standalone: true,
  imports: [FuseTabsComponent, FuseTabComponent],
  template: `
    <fuse-tabs>
      <fuse-tab tabId="a" label="A" badge="3">Alpha</fuse-tab>
      <fuse-tab tabId="b" label="B">Beta</fuse-tab>
    </fuse-tabs>
  `,
})
class BadgeHostComponent {}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buttons(fix: ComponentFixture<unknown>): HTMLButtonElement[] {
  return fix.nativeElement.querySelectorAll('.fuse-tab-btn');
}

function panels(fix: ComponentFixture<unknown>): HTMLElement[] {
  return fix.nativeElement.querySelectorAll('[role="tabpanel"]');
}

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseTabsComponent', () => {
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

  it('renders a button for each tab', () => {
    expect(buttons(fixture).length).toBe(3);
  });

  it('renders a tabpanel for each tab', () => {
    expect(panels(fixture).length).toBe(3);
  });

  it('applies role="tablist" to the list container', () => {
    const list = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(list).toBeTruthy();
  });

  it('renders button labels from tab label input', () => {
    const btns = buttons(fixture);
    expect(btns[0].textContent?.trim()).toContain('Tab 1');
    expect(btns[1].textContent?.trim()).toContain('Tab 2');
  });

  // ── Defaults ────────────────────────────────────────────────────────────────

  it('activates the first tab by default', () => {
    const btns = buttons(fixture);
    expect(btns[0].getAttribute('aria-selected')).toBe('true');
    expect(btns[1].getAttribute('aria-selected')).toBe('false');
  });

  it('shows the first panel and hides others by default', () => {
    const pnls = panels(fixture);
    expect(pnls[0].hidden).toBe(false);
    expect(pnls[1].hidden).toBe(true);
  });

  // ── activeTab input ──────────────────────────────────────────────────────────

  it('activates the tab matching activeTab input', () => {
    host.activeTab = 't2';
    fixture.detectChanges();
    const btns = buttons(fixture);
    expect(btns[1].getAttribute('aria-selected')).toBe('true');
    expect(btns[0].getAttribute('aria-selected')).toBe('false');
  });

  it('shows the correct panel when activeTab is set', () => {
    host.activeTab = 't2';
    fixture.detectChanges();
    const pnls = panels(fixture);
    expect(pnls[1].hidden).toBe(false);
    expect(pnls[0].hidden).toBe(true);
  });

  // ── Click / setActive ────────────────────────────────────────────────────────

  it('activates a tab on click', () => {
    buttons(fixture)[1].click();
    fixture.detectChanges();
    expect(buttons(fixture)[1].getAttribute('aria-selected')).toBe('true');
  });

  it('emits tabChange with the clicked tabId', () => {
    buttons(fixture)[1].click();
    fixture.detectChanges();
    expect(host.lastTabChange).toBe('t2');
  });

  it('shows the clicked panel', () => {
    buttons(fixture)[1].click();
    fixture.detectChanges();
    expect(panels(fixture)[1].hidden).toBe(false);
    expect(panels(fixture)[0].hidden).toBe(true);
  });

  // ── Disabled tab ────────────────────────────────────────────────────────────

  it('disables the button for a disabled tab', () => {
    expect(buttons(fixture)[2].disabled).toBe(true);
  });

  it('does not change active tab when disabled button is clicked', () => {
    buttons(fixture)[2].click();
    fixture.detectChanges();
    // t1 should still be active (or whatever was active before)
    expect(buttons(fixture)[0].getAttribute('aria-selected')).toBe('true');
  });

  // ── Variant ─────────────────────────────────────────────────────────────────

  it('applies line variant class by default', () => {
    const list = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(list.classList).toContain('fuse-tabs__list--line');
  });

  it('applies pills variant class', () => {
    host.variant = 'pills';
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(list.classList).toContain('fuse-tabs__list--pills');
    expect(list.classList).not.toContain('fuse-tabs__list--line');
  });

  it('applies boxed variant class', () => {
    host.variant = 'boxed';
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(list.classList).toContain('fuse-tabs__list--boxed');
  });

  // ── Size ────────────────────────────────────────────────────────────────────

  it('applies md size class by default', () => {
    const list = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(list.classList).toContain('fuse-tabs__list--md');
  });

  it('applies sm size class', () => {
    host.size = 'sm';
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(list.classList).toContain('fuse-tabs__list--sm');
  });

  // ── Indicator ───────────────────────────────────────────────────────────────

  it('renders indicator element for line variant', () => {
    const indicator = fixture.nativeElement.querySelector('.fuse-tabs__indicator');
    expect(indicator).toBeTruthy();
  });

  it('does not render indicator for pills variant', () => {
    host.variant = 'pills';
    fixture.detectChanges();
    const indicator = fixture.nativeElement.querySelector('.fuse-tabs__indicator');
    expect(indicator).toBeNull();
  });

  it('does not render indicator for boxed variant', () => {
    host.variant = 'boxed';
    fixture.detectChanges();
    const indicator = fixture.nativeElement.querySelector('.fuse-tabs__indicator');
    expect(indicator).toBeNull();
  });

  // ── Accessibility ───────────────────────────────────────────────────────────

  it('sets aria-controls on each button matching panel id', () => {
    const btns = buttons(fixture);
    expect(btns[0].getAttribute('aria-controls')).toBe('panel-t1');
    expect(btns[1].getAttribute('aria-controls')).toBe('panel-t2');
  });

  it('sets id on each panel matching tabId', () => {
    const pnls = panels(fixture);
    expect(pnls[0].id).toBe('panel-t1');
    expect(pnls[1].id).toBe('panel-t2');
  });

  it('sets aria-labelledby on each panel', () => {
    const pnls = panels(fixture);
    expect(pnls[0].getAttribute('aria-labelledby')).toBe('t1');
  });
});

// ─── Badge spec ───────────────────────────────────────────────────────────────

describe('FuseTabComponent — badge', () => {
  let fixture: ComponentFixture<BadgeHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeHostComponent);
    fixture.detectChanges();
  });

  it('renders fuse-badge inside the tab button when badge is set', () => {
    const badge = fixture.nativeElement.querySelector('fuse-badge');
    expect(badge).toBeTruthy();
  });

  it('does not render badge when badge input is null', () => {
    // Tab "b" has no badge — only one badge total
    const badges = fixture.nativeElement.querySelectorAll('fuse-badge');
    expect(badges.length).toBe(1);
  });
});
