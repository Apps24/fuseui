import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FuseButtonComponent } from './fuse-button.component';

describe('FuseButtonComponent', () => {
  let fixture: ComponentFixture<FuseButtonComponent>;
  let component: FuseButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a <button> element', () => {
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn).toBeTruthy();
  });

  it('renders content via ng-content slot', () => {
    const span = fixture.debugElement.query(By.css('.fuse-btn__content'));
    expect(span).toBeTruthy();
  });

  // ─── input: variant ─────────────────────────────────────────────────────────

  it('defaults variant to solid', () => {
    expect(component.variant()).toBe('solid');
  });

  it.each(['solid', 'outline', 'ghost', 'link'] as const)(
    'applies fuse-btn--%s class for variant=%s',
    (variant) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();
      expect(component.hostClasses()).toContain(`fuse-btn--${variant}`);
    }
  );

  // ─── input: color ────────────────────────────────────────────────────────────

  it('defaults color to primary', () => {
    expect(component.color()).toBe('primary');
  });

  it.each(['primary', 'secondary', 'success', 'danger'] as const)(
    'applies fuse-btn--%s class for color=%s',
    (color) => {
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();
      expect(component.hostClasses()).toContain(`fuse-btn--${color}`);
    }
  );

  it('sets data-color attribute on host', () => {
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-color')).toBe('danger');
  });

  it('sets data-variant attribute on host', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-variant')).toBe('outline');
  });

  // ─── input: size ─────────────────────────────────────────────────────────────

  it('defaults size to md', () => {
    expect(component.size()).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'applies fuse-btn--%s class for size=%s',
    (size) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();
      expect(component.hostClasses()).toContain(`fuse-btn--${size}`);
    }
  );

  // ─── input: disabled ─────────────────────────────────────────────────────────

  it('defaults disabled to false', () => {
    expect(component.disabled()).toBe(false);
  });

  it('adds fuse-btn--disabled class when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.hostClasses()).toContain('fuse-btn--disabled');
  });

  it('does not add fuse-btn--disabled class when disabled=false', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(component.hostClasses()).not.toContain('fuse-btn--disabled');
  });

  it('sets native button disabled attribute when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  // ─── input: loading ──────────────────────────────────────────────────────────

  it('defaults loading to false', () => {
    expect(component.loading()).toBe(false);
  });

  it('adds fuse-btn--loading class when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(component.hostClasses()).toContain('fuse-btn--loading');
  });

  it('shows spinner element when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.fuse-btn__spinner'));
    expect(spinner).toBeTruthy();
  });

  it('hides spinner when loading=false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.fuse-btn__spinner'));
    expect(spinner).toBeNull();
  });

  it('disables the native button when loading=true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  // ─── input: type ─────────────────────────────────────────────────────────────

  it('defaults type to button', () => {
    expect(component.type()).toBe('button');
  });

  it.each(['button', 'submit', 'reset'] as const)(
    'sets native type=%s on the <button>',
    (type) => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button'));
      expect(btn.nativeElement.type).toBe(type);
    }
  );

  // ─── output: clicked ─────────────────────────────────────────────────────────

  it('emits clicked when the button is clicked', () => {
    const spy = jest.fn();
    component.clicked.subscribe(spy);
    const btn = fixture.debugElement.query(By.css('button'));
    btn.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does NOT emit clicked when disabled', () => {
    const spy = jest.fn();
    component.clicked.subscribe(spy);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.handleClick(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('does NOT emit clicked when loading', () => {
    const spy = jest.fn();
    component.clicked.subscribe(spy);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    component.handleClick(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('emits the original MouseEvent', () => {
    const spy = jest.fn();
    component.clicked.subscribe(spy);
    const event = new MouseEvent('click');
    component.handleClick(event);
    expect(spy).toHaveBeenCalledWith(event);
  });

  // ─── hostClasses ─────────────────────────────────────────────────────────────

  it('hostClasses always starts with fuse-btn', () => {
    expect(component.hostClasses().startsWith('fuse-btn')).toBe(true);
  });

  it('hostClasses contains no empty entries', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    const parts = component.hostClasses().split(' ');
    expect(parts.every((p) => p.length > 0)).toBe(true);
  });
});
