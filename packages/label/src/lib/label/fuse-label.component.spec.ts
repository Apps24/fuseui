import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FuseLabelComponent } from './fuse-label.component';

describe('FuseLabelComponent', () => {
  let fixture: ComponentFixture<FuseLabelComponent>;
  let component: FuseLabelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a <label> element', () => {
    expect(fixture.debugElement.query(By.css('label'))).toBeTruthy();
  });

  it('does not render asterisk by default', () => {
    expect(fixture.debugElement.query(By.css('.fuse-label__asterisk'))).toBeNull();
  });

  // ─── @Input: for ────────────────────────────────────────────────────────────

  it('defaults for to empty string (no for attribute)', () => {
    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.getAttribute('for')).toBeNull();
  });

  it('sets for attribute when for input is provided', () => {
    fixture.componentRef.setInput('for', 'email-input');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.getAttribute('for')).toBe('email-input');
  });

  it('removes for attribute when for is reset to empty string', () => {
    fixture.componentRef.setInput('for', 'some-id');
    fixture.detectChanges();
    fixture.componentRef.setInput('for', '');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.getAttribute('for')).toBeNull();
  });

  // ─── @Input: required ─────────────────────────────────────────────────────────

  it('defaults required to false', () => {
    expect(component.required()).toBe(false);
  });

  it('adds fuse-label--required class when required=true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.fuse-label--required'));
    expect(label).toBeTruthy();
  });

  it('renders asterisk span when required=true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const asterisk = fixture.debugElement.query(By.css('.fuse-label__asterisk'));
    expect(asterisk).toBeTruthy();
    expect(asterisk.nativeElement.textContent.trim()).toBe('*');
  });

  it('asterisk has aria-hidden="true"', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const asterisk = fixture.debugElement.query(By.css('.fuse-label__asterisk'));
    expect(asterisk.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('removes required class and asterisk when required=false', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    fixture.componentRef.setInput('required', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fuse-label--required'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.fuse-label__asterisk'))).toBeNull();
  });

  // ─── @Input: disabled ─────────────────────────────────────────────────────────

  it('defaults disabled to false', () => {
    expect(component.disabled()).toBe(false);
  });

  it('adds fuse-label--disabled class when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.fuse-label--disabled'));
    expect(label).toBeTruthy();
  });

  it('removes disabled class when disabled=false', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fuse-label--disabled'))).toBeNull();
  });

  // ─── Combinations ─────────────────────────────────────────────────────────────

  it('can be both required and disabled simultaneously', () => {
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.classList).toContain('fuse-label--required');
    expect(label.nativeElement.classList).toContain('fuse-label--disabled');
    expect(fixture.debugElement.query(By.css('.fuse-label__asterisk'))).toBeTruthy();
  });
});
