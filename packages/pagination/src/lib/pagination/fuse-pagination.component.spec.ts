import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FusePaginationComponent } from './fuse-pagination.component';

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FusePaginationComponent],
  template: `
    <fuse-pagination
      [total]="total"
      [pageSize]="pageSize"
      [siblingCount]="siblingCount"
      [(currentPage)]="currentPage"
      (pageChange)="onPageChange($event)">
    </fuse-pagination>
  `,
})
class TestHostComponent {
  total        = 100;
  pageSize     = 10;
  siblingCount = 1;
  currentPage  = 1;
  lastPageChange = 0;
  onPageChange(p: number) { this.lastPageChange = p; }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const prevBtn  = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-pagination__prev') as HTMLButtonElement;

const nextBtn  = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-pagination__next') as HTMLButtonElement;

const pageBtns = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelectorAll('.fuse-pagination__page') as NodeListOf<HTMLButtonElement>;

const activeBtn = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelector('.fuse-pagination__page--active') as HTMLButtonElement | null;

const ellipses = (f: ComponentFixture<unknown>) =>
  f.nativeElement.querySelectorAll('.fuse-pagination__ellipsis') as NodeListOf<HTMLElement>;

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FusePaginationComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders prev and next buttons', () => {
    expect(prevBtn(fixture)).toBeTruthy();
    expect(nextBtn(fixture)).toBeTruthy();
  });

  it('nav has aria-label="Pagination"', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it('prev button is disabled on page 1', () => {
    expect(prevBtn(fixture).disabled).toBe(true);
  });

  it('next button is NOT disabled on page 1', () => {
    expect(nextBtn(fixture).disabled).toBe(false);
  });

  it('next button is disabled on last page', () => {
    host.currentPage = 10; // total=100, pageSize=10 → totalPages=10
    fixture.detectChanges();
    expect(nextBtn(fixture).disabled).toBe(true);
  });

  it('prev button is NOT disabled when not on page 1', () => {
    host.currentPage = 5;
    fixture.detectChanges();
    expect(prevBtn(fixture).disabled).toBe(false);
  });

  // ── Active page ───────────────────────────────────────────────────────────

  it('first page button has active class by default', () => {
    expect(activeBtn(fixture)?.textContent?.trim()).toBe('1');
  });

  it('active page has aria-current="page"', () => {
    expect(activeBtn(fixture)?.getAttribute('aria-current')).toBe('page');
  });

  it('non-active pages do not have aria-current', () => {
    const nonActive = Array.from(pageBtns(fixture)).filter(
      (b) => !b.classList.contains('fuse-pagination__page--active'),
    );
    for (const b of nonActive) expect(b.getAttribute('aria-current')).toBeNull();
  });

  // ── goTo ─────────────────────────────────────────────────────────────────

  it('clicking a page button emits pageChange', () => {
    const btns = pageBtns(fixture);
    (btns[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.lastPageChange).toBe(2);
  });

  it('clicking next increments currentPage', () => {
    nextBtn(fixture).click();
    fixture.detectChanges();
    expect(host.currentPage).toBe(2);
  });

  it('clicking prev decrements currentPage', () => {
    host.currentPage = 3;
    fixture.detectChanges();
    prevBtn(fixture).click();
    fixture.detectChanges();
    expect(host.currentPage).toBe(2);
  });

  it('goTo ignores page < 1', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FusePaginationComponent;
    comp.goTo(0);
    fixture.detectChanges();
    expect(host.currentPage).toBe(1);
  });

  it('goTo ignores page > totalPages', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FusePaginationComponent;
    comp.goTo(999);
    fixture.detectChanges();
    expect(host.currentPage).toBe(1);
  });

  // ── buildPages algorithm ───────────────────────────────────────────────────

  it('no ellipsis for small total', () => {
    host.total    = 30;
    host.pageSize = 10; // 3 pages
    fixture.detectChanges();
    expect(ellipses(fixture).length).toBe(0);
    expect(pageBtns(fixture).length).toBe(3);
  });

  it('right ellipsis when current page is near start', () => {
    host.total       = 100;
    host.currentPage = 1;
    fixture.detectChanges();
    expect(ellipses(fixture).length).toBe(1);
  });

  it('left ellipsis when current page is near end', () => {
    host.total       = 100;
    host.currentPage = 10;
    fixture.detectChanges();
    expect(ellipses(fixture).length).toBe(1);
  });

  it('both ellipses when current page is in the middle', () => {
    host.total       = 100;
    host.currentPage = 5;
    fixture.detectChanges();
    expect(ellipses(fixture).length).toBe(2);
  });

  it('first and last pages always present in large lists', () => {
    host.total       = 100;
    host.currentPage = 5;
    fixture.detectChanges();
    const texts = Array.from(pageBtns(fixture)).map((b) => b.textContent?.trim());
    expect(texts).toContain('1');
    expect(texts).toContain('10');
  });

  it('siblingCount=2 shows more pages around current', () => {
    host.total        = 200;
    host.pageSize     = 10;
    host.siblingCount = 2;
    host.currentPage  = 10;
    fixture.detectChanges();
    const texts = Array.from(pageBtns(fixture)).map((b) => Number(b.textContent?.trim()));
    expect(texts).toContain(8);
    expect(texts).toContain(9);
    expect(texts).toContain(11);
    expect(texts).toContain(12);
  });

  // ── totalPages computed ───────────────────────────────────────────────────

  it('totalPages rounds up correctly', () => {
    host.total    = 25;
    host.pageSize = 10;
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FusePaginationComponent;
    expect(comp.totalPages()).toBe(3);
  });
});
