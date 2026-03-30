import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FuseIconRegistryService } from '@fuse/core';
import { FuseIconComponent } from './fuse-icon.component';

describe('FuseIconComponent', () => {
  let fixture: ComponentFixture<FuseIconComponent>;
  let component: FuseIconComponent;
  let registry: FuseIconRegistryService;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseIconComponent);
    component = fixture.componentInstance;
    registry = TestBed.inject(FuseIconRegistryService);
    sanitizer = TestBed.inject(DomSanitizer);

    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();
  });

  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a <span> container', () => {
    const span = fixture.debugElement.query(By.css('span'));
    expect(span).toBeTruthy();
  });

  it('sets aria-hidden on the span', () => {
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  // ─── @Input: name (required) ─────────────────────────────────────────────────

  it('loads SVG for a known icon name', () => {
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.innerHTML).toContain('<svg');
  });

  it('renders empty innerHTML for an unknown icon name', () => {
    fixture.componentRef.setInput('name', 'does-not-exist');
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.innerHTML.trim()).toBe('');
  });

  it('reacts to name changes', () => {
    fixture.componentRef.setInput('name', 'x');
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.innerHTML).toContain('<svg');
  });

  // ─── @Input: size ────────────────────────────────────────────────────────────

  it('defaults size to md (20px)', () => {
    expect(component.size()).toBe('md');
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.style.width).toBe('20px');
    expect(span.nativeElement.style.height).toBe('20px');
  });

  it.each([
    ['xs', '12px'],
    ['sm', '16px'],
    ['md', '20px'],
    ['lg', '24px'],
    ['xl', '32px'],
  ] as const)('sets %spx dimensions for size=%s', (size, px) => {
    fixture.componentRef.setInput('size', size);
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.style.width).toBe(px);
    expect(span.nativeElement.style.height).toBe(px);
  });

  // ─── @Input: color ───────────────────────────────────────────────────────────

  it('defaults color to currentColor', () => {
    expect(component.color()).toBe('currentColor');
  });

  it('applies color to span style', () => {
    fixture.componentRef.setInput('color', 'red');
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.style.color).toBe('red');
  });

  // ─── sizeMap ─────────────────────────────────────────────────────────────────

  it('sizeMap covers all five size keys', () => {
    expect(component.sizeMap).toMatchObject({
      xs: 12, sm: 16, md: 20, lg: 24, xl: 32,
    });
  });

  // ─── Registry integration ────────────────────────────────────────────────────

  it('loads a custom icon registered at runtime', () => {
    const customSvg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/></svg>';
    registry.register('custom-circle', customSvg);
    fixture.componentRef.setInput('name', 'custom-circle');
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.innerHTML).toContain('circle');
  });

  it('renders empty for missing icon without throwing', () => {
    expect(() => {
      fixture.componentRef.setInput('name', 'totally-missing');
      fixture.detectChanges();
    }).not.toThrow();
  });

  // ─── All built-in icons load without error ────────────────────────────────────

  const builtinIcons = [
    'check', 'x', 'chevron-down', 'chevron-right', 'chevron-up',
    'search', 'eye', 'eye-off', 'info', 'warning', 'danger-triangle',
    'plus', 'minus', 'menu', 'close', 'arrow-right', 'arrow-left', 'spinner',
  ];

  it.each(builtinIcons)('renders built-in icon: %s', (iconName) => {
    fixture.componentRef.setInput('name', iconName);
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('span'));
    expect(span.nativeElement.innerHTML).toContain('<svg');
  });
});
