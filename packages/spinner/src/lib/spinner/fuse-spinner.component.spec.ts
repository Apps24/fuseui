import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseSpinnerComponent } from './fuse-spinner.component';

describe('FuseSpinnerComponent', () => {
  let fixture: ComponentFixture<FuseSpinnerComponent>;
  let component: FuseSpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders a .fuse-spinner ring element', () => {
    expect(fixture.nativeElement.querySelector('.fuse-spinner')).toBeTruthy();
  });

  it('does NOT render an overlay by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-spinner__overlay')).toBeNull();
  });

  // ─── size input ─────────────────────────────────────────────────────────────

  it('applies fuse-spinner--md class by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-spinner--md')).toBeTruthy();
  });

  it('applies fuse-spinner--sm class when size is sm', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-spinner--sm')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-spinner--md')).toBeNull();
  });

  it('applies fuse-spinner--lg class when size is lg', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-spinner--lg')).toBeTruthy();
  });

  it('host has fuse-spinner-host--md class by default', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-spinner-host--md');
  });

  it('host class updates when size changes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-spinner-host--lg');
    expect(fixture.nativeElement.classList).not.toContain('fuse-spinner-host--md');
  });

  // ─── color input ────────────────────────────────────────────────────────────

  it('sets border-top-color style when color is provided', () => {
    fixture.componentRef.setInput('color', '#ff0000');
    fixture.detectChanges();
    const ring = fixture.nativeElement.querySelector('.fuse-spinner') as HTMLElement;
    expect(ring.style.borderTopColor).toBeTruthy();
  });

  it('does not set border-top-color when color is empty', () => {
    fixture.componentRef.setInput('color', '');
    fixture.detectChanges();
    const ring = fixture.nativeElement.querySelector('.fuse-spinner') as HTMLElement;
    // null binding means no inline style override
    expect(ring.style.borderTopColor).toBeFalsy();
  });

  // ─── overlay input ──────────────────────────────────────────────────────────

  it('renders overlay div when overlay=true', () => {
    fixture.componentRef.setInput('overlay', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-spinner__overlay')).toBeTruthy();
  });

  it('host has fuse-spinner-host--overlay class when overlay=true', () => {
    fixture.componentRef.setInput('overlay', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-spinner-host--overlay');
  });

  it('ring is inside overlay div when overlay=true', () => {
    fixture.componentRef.setInput('overlay', true);
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.fuse-spinner__overlay');
    expect(overlay.querySelector('.fuse-spinner')).toBeTruthy();
  });

  // ─── Accessibility ──────────────────────────────────────────────────────────

  it('host has role=status', () => {
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('host has aria-label=Loading', () => {
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Loading');
  });
});
