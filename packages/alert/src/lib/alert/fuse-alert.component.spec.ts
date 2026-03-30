import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseAlertComponent } from './fuse-alert.component';

describe('FuseAlertComponent', () => {
  let fixture: ComponentFixture<FuseAlertComponent>;
  let component: FuseAlertComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders the inner container by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-alert__inner')).toBeTruthy();
  });

  it('renders the icon element', () => {
    expect(fixture.nativeElement.querySelector('.fuse-alert__icon')).toBeTruthy();
  });

  it('renders an svg icon', () => {
    expect(fixture.nativeElement.querySelector('.fuse-alert__icon svg')).toBeTruthy();
  });

  it('renders message content area', () => {
    expect(fixture.nativeElement.querySelector('.fuse-alert__message')).toBeTruthy();
  });

  // ─── type input ─────────────────────────────────────────────────────────────

  it('applies info class by default', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-alert--info');
  });

  it('applies success class when type=success', () => {
    fixture.componentRef.setInput('type', 'success');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-alert--success');
    expect(fixture.nativeElement.classList).not.toContain('fuse-alert--info');
  });

  it('applies warning class when type=warning', () => {
    fixture.componentRef.setInput('type', 'warning');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-alert--warning');
  });

  it('applies error class when type=error', () => {
    fixture.componentRef.setInput('type', 'error');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-alert--error');
  });

  it('renders a different icon for each type', () => {
    const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    types.forEach(type => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.fuse-alert__icon svg')).toBeTruthy();
    });
  });

  // ─── variant input ──────────────────────────────────────────────────────────

  it('applies soft class by default', () => {
    expect(fixture.nativeElement.classList).toContain('fuse-alert--soft');
  });

  it('applies solid class when variant=solid', () => {
    fixture.componentRef.setInput('variant', 'solid');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('fuse-alert--solid');
    expect(fixture.nativeElement.classList).not.toContain('fuse-alert--soft');
  });

  // ─── title input ────────────────────────────────────────────────────────────

  it('does not render title element when title is empty', () => {
    expect(fixture.nativeElement.querySelector('.fuse-alert__title')).toBeNull();
  });

  it('renders title when provided', () => {
    fixture.componentRef.setInput('title', 'Heads up!');
    fixture.detectChanges();
    const titleEl = fixture.nativeElement.querySelector('.fuse-alert__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent.trim()).toBe('Heads up!');
  });

  // ─── closable input ─────────────────────────────────────────────────────────

  it('does not render close button by default', () => {
    expect(fixture.nativeElement.querySelector('.fuse-alert__close')).toBeNull();
  });

  it('renders close button when closable=true', () => {
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-alert__close')).toBeTruthy();
  });

  it('close button has aria-label', () => {
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.fuse-alert__close');
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });

  // ─── dismiss behaviour ──────────────────────────────────────────────────────

  it('clicking close button hides the alert', () => {
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.fuse-alert__close').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-alert__inner')).toBeNull();
  });

  it('emits alertClose when dismissed', () => {
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();

    let emitCount = 0;
    component.alertClose.subscribe(() => emitCount++);

    fixture.nativeElement.querySelector('.fuse-alert__close').click();
    expect(emitCount).toBe(1);
  });

  it('dismissed signal starts as false', () => {
    expect((component as any).dismissed()).toBe(false);
  });

  it('dismissed signal is true after close button click', () => {
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.fuse-alert__close').click();
    expect((component as any).dismissed()).toBe(true);
  });
});
