import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { FuseInputComponent } from './fuse-input.component';

// ─── Host wrapper for CVA integration tests ───────────────────────────────────
@Component({
  standalone: true,
  imports: [FuseInputComponent, ReactiveFormsModule],
  template: `<fuse-input [formControl]="ctrl"></fuse-input>`,
})
class TestHostComponent {
  ctrl = new FormControl('');
}

describe('FuseInputComponent', () => {
  let fixture: ComponentFixture<FuseInputComponent>;
  let component: FuseInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseInputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a native <input> element', () => {
    expect(fixture.debugElement.query(By.css('input'))).toBeTruthy();
  });

  it('does not render label by default', () => {
    expect(fixture.debugElement.query(By.css('.fuse-input__label'))).toBeNull();
  });

  it('renders label when label input is set', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.fuse-input__label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Email');
  });

  // ─── @Input: type ────────────────────────────────────────────────────────────

  it('defaults type to text', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.type).toBe('text');
  });

  it.each(['text', 'password', 'email', 'number'] as const)(
    'sets native type=%s',
    (type) => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('input')).nativeElement.type).toBe(type);
    }
  );

  // ─── @Input: placeholder ──────────────────────────────────────────────────────

  it('sets placeholder attribute', () => {
    fixture.componentRef.setInput('placeholder', 'Enter email');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.placeholder).toBe('Enter email');
  });

  // ─── @Input: required ─────────────────────────────────────────────────────────

  it('defaults required to false', () => {
    expect(component.required()).toBe(false);
  });

  it('sets required attribute when required=true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.required).toBe(true);
  });

  it('adds --required modifier to label when required=true and label is set', () => {
    fixture.componentRef.setInput('label', 'Name');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.fuse-input__label--required'));
    expect(label).toBeTruthy();
  });

  // ─── @Input: readonly ─────────────────────────────────────────────────────────

  it('sets readonly attribute on native input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.readOnly).toBe(true);
  });

  // ─── @Input: size ────────────────────────────────────────────────────────────

  it('defaults size to md', () => {
    expect(component.size()).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)('adds fuse-input--%s class for size=%s', (size) => {
    fixture.componentRef.setInput('size', size);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('.fuse-input'));
    expect(wrapper.nativeElement.classList).toContain(`fuse-input--${size}`);
  });

  // ─── @Input: hasError / errorMessage ──────────────────────────────────────────

  it('showError is false by default', () => {
    expect(component.showError()).toBe(false);
  });

  it('showError is true when hasError=true', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    expect(component.showError()).toBe(true);
  });

  it('showError is true when errorMessage is set', () => {
    fixture.componentRef.setInput('errorMessage', 'Required field');
    fixture.detectChanges();
    expect(component.showError()).toBe(true);
  });

  it('renders error span with role=alert when errorMessage is set', () => {
    fixture.componentRef.setInput('errorMessage', 'This field is required');
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.fuse-input__error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.getAttribute('role')).toBe('alert');
    expect(error.nativeElement.textContent.trim()).toBe('This field is required');
  });

  it('does not render error span when no error', () => {
    expect(fixture.debugElement.query(By.css('.fuse-input__error'))).toBeNull();
  });

  // ─── @Input: helperText ───────────────────────────────────────────────────────

  it('renders helper text when helperText is set and no error', () => {
    fixture.componentRef.setInput('helperText', 'Enter your email address');
    fixture.detectChanges();
    const helper = fixture.debugElement.query(By.css('.fuse-input__helper'));
    expect(helper).toBeTruthy();
    expect(helper.nativeElement.textContent.trim()).toBe('Enter your email address');
  });

  it('hides helper text when showError is true', () => {
    fixture.componentRef.setInput('helperText', 'some help');
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fuse-input__helper'))).toBeNull();
  });

  // ─── CSS state classes ────────────────────────────────────────────────────────

  it('adds fuse-input--error class when showError is true', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('.fuse-input--error'));
    expect(wrapper).toBeTruthy();
  });

  it('adds fuse-input--disabled class when disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('.fuse-input--disabled'));
    expect(wrapper).toBeTruthy();
  });

  it('adds fuse-input--focused class on focus, removes on blur', () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('focus', null);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fuse-input--focused'))).toBeTruthy();

    input.triggerEventHandler('blur', null);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fuse-input--focused'))).toBeNull();
  });

  it('adds fuse-input--readonly class when readonly=true', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('.fuse-input--readonly'));
    expect(wrapper).toBeTruthy();
  });

  // ─── ControlValueAccessor ────────────────────────────────────────────────────

  it('writeValue sets internal value signal', () => {
    component.writeValue('hello');
    expect(component['value']()).toBe('hello');
  });

  it('writeValue with null/undefined sets empty string', () => {
    component.writeValue(null as unknown as string);
    expect(component['value']()).toBe('');
  });

  it('setDisabledState(true) disables the native input', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
  });

  it('setDisabledState(false) re-enables the native input', () => {
    component.setDisabledState(true);
    component.setDisabledState(false);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(false);
  });

  it('calls onChange when user types', () => {
    const spy = jest.fn();
    component.registerOnChange(spy);
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'test';
    input.triggerEventHandler('input', { target: input.nativeElement });
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('calls onTouched when input is blurred', () => {
    const spy = jest.fn();
    component.registerOnTouched(spy);
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('blur', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // ─── Reactive form integration ────────────────────────────────────────────────

  it('syncs value with ReactiveForm FormControl', async () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    const host = hostFixture.componentInstance;
    hostFixture.detectChanges();

    host.ctrl.setValue('reactive value');
    hostFixture.detectChanges();

    const inputEl = hostFixture.debugElement.query(By.css('input'));
    expect(inputEl.nativeElement.value).toBe('reactive value');
  });

  it('disables native input when FormControl is disabled', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    const host = hostFixture.componentInstance;
    hostFixture.detectChanges();

    host.ctrl.disable();
    hostFixture.detectChanges();

    const inputEl = hostFixture.debugElement.query(By.css('input'));
    expect(inputEl.nativeElement.disabled).toBe(true);
  });
});
