import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FuseBreadcrumbComponent,
  FuseBreadcrumbItem,
} from './fuse-breadcrumb.component';

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseBreadcrumbComponent],
  template: `
    <fuse-breadcrumb
      [items]="items"
      [maxVisible]="maxVisible"
      [separator]="separator">
    </fuse-breadcrumb>
  `,
})
class TestHostComponent {
  items: FuseBreadcrumbItem[] = [
    { label: 'Home',     href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/cat' },
    { label: 'Item' },
  ];
  maxVisible = 4;
  separator: '/' | '>' | '·' = '/';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const links  = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelectorAll('.fuse-breadcrumb__link') as NodeListOf<HTMLAnchorElement>;

const labels  = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelectorAll('.fuse-breadcrumb__label') as NodeListOf<HTMLElement>;

const seps  = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelectorAll('.fuse-breadcrumb__sep') as NodeListOf<HTMLElement>;

const ellipsis = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-breadcrumb__ellipsis') as HTMLButtonElement | null;

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseBreadcrumbComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── ARIA ────────────────────────────────────────────────────────────────────

  it('wraps in <nav aria-label="Breadcrumb">', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('last item has aria-current="page"', () => {
    const last = Array.from(labels(fixture)).at(-1)!;
    expect(last.getAttribute('aria-current')).toBe('page');
  });

  it('non-last items do not have aria-current', () => {
    const nonLast = Array.from(labels(fixture)).slice(0, -1);
    for (const el of nonLast) {
      expect(el.getAttribute('aria-current')).toBeNull();
    }
  });

  // ── Rendering — items within maxVisible ──────────────────────────────────────

  it('renders all items when count === maxVisible', () => {
    // 4 items, maxVisible=4: no ellipsis
    expect(ellipsis(fixture)).toBeNull();
  });

  it('last item renders as <span> not <a>', () => {
    const lastLabel = Array.from(labels(fixture)).at(-1)!;
    expect(lastLabel.tagName).toBe('SPAN');
  });

  it('non-last items with href render as <a>', () => {
    expect(links(fixture).length).toBe(3);
  });

  it('link href is set correctly', () => {
    expect(links(fixture)[0].getAttribute('href')).toBe('/');
    expect(links(fixture)[1].getAttribute('href')).toBe('/products');
  });

  it('label text matches item label', () => {
    expect(fixture.nativeElement.textContent).toContain('Home');
    expect(fixture.nativeElement.textContent).toContain('Item');
  });

  // ── Separator ────────────────────────────────────────────────────────────────

  it('renders separator between items (not after last)', () => {
    // 4 items → 3 separators
    expect(seps(fixture).length).toBe(3);
  });

  it('separator text defaults to "/"', () => {
    expect(seps(fixture)[0].textContent?.trim()).toBe('/');
  });

  it('separator changes via input', () => {
    host.separator = '>';
    fixture.detectChanges();
    expect(seps(fixture)[0].textContent?.trim()).toBe('>');
  });

  it('separator "·" renders correctly', () => {
    host.separator = '·';
    fixture.detectChanges();
    expect(seps(fixture)[0].textContent?.trim()).toBe('·');
  });

  // ── Ellipsis (truncation) ────────────────────────────────────────────────────

  it('shows ellipsis button when items exceed maxVisible', () => {
    host.items = [
      { label: 'Home', href: '/' },
      { label: 'A', href: '/a' },
      { label: 'B', href: '/b' },
      { label: 'C', href: '/c' },
      { label: 'Current' },
    ];
    host.maxVisible = 4;
    fixture.detectChanges();
    expect(ellipsis(fixture)).toBeTruthy();
  });

  it('with 5 items and maxVisible=4: shows first, ellipsis, last 2', () => {
    host.items = [
      { label: 'Home',    href: '/' },
      { label: 'Mid1',   href: '/m1' },
      { label: 'Mid2',   href: '/m2' },
      { label: 'Penult', href: '/p' },
      { label: 'Last' },
    ];
    host.maxVisible = 4;
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Home');   // first kept
    expect(text).toContain('Penult'); // last-2 kept
    expect(text).toContain('Last');   // last kept
    expect(text).not.toContain('Mid1');
    expect(text).not.toContain('Mid2');
    expect(ellipsis(fixture)).toBeTruthy();
  });

  it('clicking ellipsis shows all items', () => {
    host.items = [
      { label: 'Home', href: '/' },
      { label: 'A', href: '/a' },
      { label: 'B', href: '/b' },
      { label: 'C', href: '/c' },
      { label: 'Current' },
    ];
    host.maxVisible = 4;
    fixture.detectChanges();

    ellipsis(fixture)!.click();
    fixture.detectChanges();

    expect(ellipsis(fixture)).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('A');
    expect(fixture.nativeElement.textContent).toContain('B');
  });

  it('no ellipsis when items === maxVisible', () => {
    host.maxVisible = 4;
    fixture.detectChanges();
    expect(ellipsis(fixture)).toBeNull();
  });

  it('no ellipsis when items < maxVisible', () => {
    host.items = [{ label: 'Home', href: '/' }, { label: 'Current' }];
    fixture.detectChanges();
    expect(ellipsis(fixture)).toBeNull();
  });

  // ── maxVisible ───────────────────────────────────────────────────────────────

  it('maxVisible=2 truncates to first + ellipsis + last 2', () => {
    host.items = [
      { label: 'Home', href: '/' },
      { label: 'A', href: '/a' },
      { label: 'B', href: '/b' },
    ];
    host.maxVisible = 2;
    fixture.detectChanges();
    expect(ellipsis(fixture)).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Home');
  });
});
