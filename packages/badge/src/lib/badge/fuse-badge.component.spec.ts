import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseBadgeComponent } from './fuse-badge.component';

describe('FuseBadgeComponent', () => {
  let fixture: ComponentFixture<FuseBadgeComponent>;
  let component: FuseBadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders the badge indicator element', () => {
    expect(fixture.nativeElement.querySelector('.fuse-badge')).toBeTruthy();
  });

  it('host element has fuse-badge-host class', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-badge-host');
  });

  // ─── Defaults ──────────────────────────────────────────────────────────────

  it('applies solid variant class by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-badge--solid')).toBeTruthy();
  });

  it('applies primary color class by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-badge--primary')).toBeTruthy();
  });

  it('applies sm size class by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-badge--sm')).toBeTruthy();
  });

  // ─── Variant input ──────────────────────────────────────────────────────────

  it('applies flat class when variant is flat', () => {
    fixture.componentRef.setInput('variant', 'flat');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--flat')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-badge--solid')).toBeNull();
  });

  it('applies outline class when variant is outline', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--outline')).toBeTruthy();
  });

  // ─── Color input ────────────────────────────────────────────────────────────

  it('applies secondary color class', () => {
    fixture.componentRef.setInput('color', 'secondary');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--secondary')).toBeTruthy();
  });

  it('applies success color class', () => {
    fixture.componentRef.setInput('color', 'success');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--success')).toBeTruthy();
  });

  it('applies warning color class', () => {
    fixture.componentRef.setInput('color', 'warning');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--warning')).toBeTruthy();
  });

  it('applies danger color class', () => {
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--danger')).toBeTruthy();
  });

  // ─── Size input ─────────────────────────────────────────────────────────────

  it('applies md size class', () => {
    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--md')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-badge--sm')).toBeNull();
  });

  // ─── Content input ──────────────────────────────────────────────────────────

  it('renders text content when dot is false', () => {
    fixture.componentRef.setInput('content', '42');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.fuse-badge__text');
    expect(text).toBeTruthy();
    expect(text.textContent.trim()).toBe('42');
  });

  it('renders text content as string labels', () => {
    fixture.componentRef.setInput('content', 'New');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge__text').textContent.trim()).toBe('New');
  });

  // ─── Dot mode ───────────────────────────────────────────────────────────────

  it('hides text span when dot is true', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge__text')).toBeNull();
  });

  it('applies dot class on the indicator when dot is true', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-badge--dot')).toBeTruthy();
  });

  it('does not apply dot class when dot is false', () => {
    expect(fixture.nativeElement.querySelector('.fuse-badge--dot')).toBeNull();
  });
});
