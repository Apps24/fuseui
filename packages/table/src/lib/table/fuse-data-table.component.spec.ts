import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseDataTableComponent, FuseColumnDef, FuseSortEvent } from './fuse-data-table.component';

// ─── Sample data ──────────────────────────────────────────────────────────────

interface Person { id: number; name: string; age: number }

const COLUMNS: FuseColumnDef[] = [
  { key: 'id',   label: 'ID',   sortable: true  },
  { key: 'name', label: 'Name', sortable: true  },
  { key: 'age',  label: 'Age',  sortable: false },
];

const DATA: Person[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob',   age: 25 },
  { id: 3, name: 'Carol', age: 35 },
];

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseDataTableComponent],
  template: `
    <fuse-data-table
      [data]="data"
      [columns]="columns"
      [sortable]="sortable"
      [loading]="loading"
      [stickyHeader]="stickyHeader"
      (sortChange)="onSort($event)">
    </fuse-data-table>
  `,
})
class TestHostComponent {
  data         = DATA;
  columns      = COLUMNS;
  sortable     = false;
  loading      = false;
  stickyHeader = false;
  lastSort: FuseSortEvent | null = null;
  onSort(e: FuseSortEvent): void { this.lastSort = e; }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const el  = (f: ComponentFixture<unknown>, sel: string) =>
  f.nativeElement.querySelector(sel) as HTMLElement | null;

const els = (f: ComponentFixture<unknown>, sel: string) =>
  f.nativeElement.querySelectorAll(sel) as NodeListOf<HTMLElement>;

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseDataTableComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Container ─────────────────────────────────────────────────────────────

  it('renders the table container', () => {
    expect(el(fixture, '.fuse-table-container')).toBeTruthy();
  });

  it('renders a table element', () => {
    expect(el(fixture, 'table.fuse-table')).toBeTruthy();
  });

  // ── Headers ───────────────────────────────────────────────────────────────

  it('renders a header cell for each column', () => {
    expect(els(fixture, '.fuse-table__th').length).toBe(COLUMNS.length);
  });

  it('header cell text matches column label', () => {
    const ths = els(fixture, '.fuse-table__th');
    expect(ths[0].textContent?.trim()).toContain('ID');
    expect(ths[1].textContent?.trim()).toContain('Name');
    expect(ths[2].textContent?.trim()).toContain('Age');
  });

  // ── Data rows ─────────────────────────────────────────────────────────────

  it('renders one row per data item', () => {
    expect(els(fixture, '.fuse-table__row').length).toBe(DATA.length);
  });

  it('renders cell values', () => {
    const firstRow = fixture.nativeElement.querySelector('.fuse-table__row');
    expect(firstRow?.textContent).toContain('Alice');
  });

  // ── displayedColumns ──────────────────────────────────────────────────────

  it('displayedColumns matches column keys', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    expect(comp.displayedColumns()).toEqual(['id', 'name', 'age']);
  });

  // ── Sorting ───────────────────────────────────────────────────────────────

  it('does not render sort icon when sortable=false', () => {
    expect(el(fixture, '.fuse-table__sort-icon')).toBeNull();
  });

  it('renders sort icon for sortable columns when sortable=true', () => {
    host.sortable = true;
    fixture.detectChanges();
    // ID and Name are sortable, Age is not → 2 icons
    expect(els(fixture, '.fuse-table__sort-icon').length).toBe(2);
  });

  it('clicking a sortable header emits sortChange asc', () => {
    host.sortable = true;
    fixture.detectChanges();
    const ths = els(fixture, '.fuse-table__th');
    ths[0].click(); // ID column
    expect(host.lastSort).toEqual({ key: 'id', dir: 'asc' });
  });

  it('clicking same header twice emits desc', () => {
    host.sortable = true;
    fixture.detectChanges();
    const ths = els(fixture, '.fuse-table__th');
    ths[0].click();
    ths[0].click();
    expect(host.lastSort?.dir).toBe('desc');
  });

  it('clicking same header three times resets sort', () => {
    host.sortable = true;
    fixture.detectChanges();
    const ths = els(fixture, '.fuse-table__th');
    ths[0].click();
    ths[0].click();
    ths[0].click();
    expect(host.lastSort?.dir).toBe('');
    expect(host.lastSort?.key).toBe('');
  });

  it('clicking a non-sortable header does not emit', () => {
    host.sortable = true;
    fixture.detectChanges();
    const ths = els(fixture, '.fuse-table__th');
    ths[2].click(); // Age — not sortable
    expect(host.lastSort).toBeNull();
  });

  it('clicking header when sortable=false does not emit', () => {
    host.sortable = false;
    fixture.detectChanges();
    const ths = els(fixture, '.fuse-table__th');
    ths[0].click();
    expect(host.lastSort).toBeNull();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it('renders skeleton rows when loading=true', () => {
    host.loading = true;
    fixture.detectChanges();
    expect(els(fixture, '.fuse-table__row--skeleton').length).toBeGreaterThan(0);
  });

  it('renders no skeleton rows when loading=false', () => {
    host.loading = false;
    fixture.detectChanges();
    expect(els(fixture, '.fuse-table__row--skeleton').length).toBe(0);
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  it('does not render empty container when data is present', () => {
    expect(el(fixture, '.fuse-table__empty')).toBeNull();
  });

  it('renders empty container when data is empty and not loading', () => {
    host.data    = [];
    host.loading = false;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-table__empty')).toBeTruthy();
  });

  it('does not render empty container when loading=true even if data is empty', () => {
    host.data    = [];
    host.loading = true;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-table__empty')).toBeNull();
  });

  // ── isSkeletonRow / isDataRow ─────────────────────────────────────────────

  it('isSkeletonRow returns true for sentinel rows', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    expect(comp.isSkeletonRow(0, { __skeleton: true })).toBe(true);
  });

  it('isDataRow returns true for real rows', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    expect(comp.isDataRow(0, { id: 1, name: 'Alice' })).toBe(true);
  });

  // ── tableData computed ────────────────────────────────────────────────────

  it('tableData uses skeleton sentinels when loading=true', () => {
    host.loading = true;
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    const td = comp.tableData();
    expect(td.every((r: unknown) => (r as { __skeleton: boolean }).__skeleton === true)).toBe(true);
  });

  it('tableData uses real data when loading=false', () => {
    host.loading = false;
    fixture.detectChanges();
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    expect(comp.tableData()).toEqual(DATA);
  });

  // ── getCellValue ──────────────────────────────────────────────────────────

  it('getCellValue extracts the correct key', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    expect(comp.getCellValue({ id: 42, name: 'Test' }, 'name')).toBe('Test');
  });

  // ── sortIconFor ───────────────────────────────────────────────────────────

  it('sortIconFor returns chevron-up-down when no sort active', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    expect(comp.sortIconFor('id')).toBe('chevron-up-down');
  });

  it('sortIconFor returns chevron-up for asc sort', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    comp.sortKey.set('id');
    comp.sortDir.set('asc');
    expect(comp.sortIconFor('id')).toBe('chevron-up');
  });

  it('sortIconFor returns chevron-down for desc sort', () => {
    const comp = fixture.debugElement.children[0].componentInstance as FuseDataTableComponent;
    comp.sortKey.set('id');
    comp.sortDir.set('desc');
    expect(comp.sortIconFor('id')).toBe('chevron-down');
  });
});
