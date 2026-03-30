import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseSkeletonComponent } from './fuse-skeleton.component';

describe('FuseSkeletonComponent', () => {
  let fixture: ComponentFixture<FuseSkeletonComponent>;
  let component: FuseSkeletonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders a single skeleton element by default', () => {
    const elements = fixture.nativeElement.querySelectorAll('.fuse-skeleton');
    expect(elements.length).toBe(1);
  });

  it('host element has fuse-skeleton-host class', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-skeleton-host');
  });

  // ─── Variant classes ────────────────────────────────────────────────────────

  it('applies rect class by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-skeleton--rect')).toBeTruthy();
  });

  it('applies circle class when variant is circle', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-skeleton--circle')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-skeleton--rect')).toBeNull();
  });

  it('applies text class when variant is text', () => {
    fixture.componentRef.setInput('variant', 'text');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-skeleton--text')).toBeTruthy();
  });

  // ─── Width / height styles ──────────────────────────────────────────────────

  it('applies default width 100% to rect skeleton', () => {
    const el = fixture.nativeElement.querySelector('.fuse-skeleton') as HTMLElement;
    expect(el.style.width).toBe('100%');
  });

  it('applies custom width', () => {
    fixture.componentRef.setInput('width', '200px');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.fuse-skeleton') as HTMLElement;
    expect(el.style.width).toBe('200px');
  });

  it('applies custom height', () => {
    fixture.componentRef.setInput('height', '3rem');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.fuse-skeleton') as HTMLElement;
    expect(el.style.height).toBe('3rem');
  });

  it('sets width equal to height for circle variant (square aspect)', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.componentRef.setInput('height', '48px');
    fixture.componentRef.setInput('width', '200px');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.fuse-skeleton') as HTMLElement;
    // circle width is driven by height, not width input
    expect(el.style.width).toBe('48px');
  });

  // ─── Multi-line text ────────────────────────────────────────────────────────

  it('renders N skeleton lines when variant=text and lines > 1', () => {
    fixture.componentRef.setInput('variant', 'text');
    fixture.componentRef.setInput('lines', 4);
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.fuse-skeleton--text');
    expect(lines.length).toBe(4);
  });

  it('renders 1 skeleton when variant=text and lines=1', () => {
    fixture.componentRef.setInput('variant', 'text');
    fixture.componentRef.setInput('lines', 1);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.fuse-skeleton--text').length).toBe(1);
  });

  it('last line in a multi-line block has reduced width (70%)', () => {
    fixture.componentRef.setInput('variant', 'text');
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.fuse-skeleton--text') as NodeListOf<HTMLElement>;
    expect(lines[0].style.width).toBe('100%');
    expect(lines[1].style.width).toBe('100%');
    expect(lines[2].style.width).toBe('70%');
  });

  it('does NOT use ngFor for non-text variant even when lines > 1', () => {
    fixture.componentRef.setInput('variant', 'rect');
    fixture.componentRef.setInput('lines', 5);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.fuse-skeleton').length).toBe(1);
  });

  // ─── lineArray getter ───────────────────────────────────────────────────────

  it('lineArray returns an array of the correct length', () => {
    fixture.componentRef.setInput('lines', 5);
    fixture.detectChanges();
    expect(component.lineArray().length).toBe(5);
  });

  it('lineArray contains sequential indices starting at 0', () => {
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    expect(component.lineArray()).toEqual([0, 1, 2]);
  });
});
