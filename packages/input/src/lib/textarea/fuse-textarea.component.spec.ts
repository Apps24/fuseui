import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { FuseTextareaComponent } from './fuse-textarea.component';

@Component({
  standalone: true,
  imports: [FuseTextareaComponent, ReactiveFormsModule],
  template: `<fuse-textarea [formControl]="ctrl"></fuse-textarea>`,
})
class TestHostComponent {
  ctrl = new FormControl('');
}

describe('FuseTextareaComponent', () => {
  let fixture: ComponentFixture<FuseTextareaComponent>;
  let component: FuseTextareaComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseTextareaComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a native <textarea>', () => {
    expect(fixture.debugElement.query(By.css('textarea'))).toBeTruthy();
  });

  it('does not render label by default', () => {
    expect(fixture.debugElement.query(By.css('.fuse-textarea__label'))).toBeNull();
  });

  it('renders label when label input is set', () => {
    fixture.componentRef.setInput('label', 'Bio');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.fuse-textarea__label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Bio');
  });

  // ─── @Input: rows ────────────────────────────────────────────────────────────

  it('defaults rows to 3', () => {
    expect(component.rows()).toBe(3);
    const ta = fixture.debugElement.query(By.css('textarea'));
    expect(ta.nativeElement.rows).toBe(3);
  });

  it('sets rows attribute on textarea', () => {
    fixture.componentRef.setInput('rows', 6);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('textarea')).nativeElement.rows).toBe(6);
  });

  // ─── @Input: placeholder ──────────────────────────────────────────────────────

  it('sets placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Write something...');
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('textarea')).nativeElement.placeholder
    ).toBe('Write something...');
  });

  // ─── @Input: maxLength ────────────────────────────────────────────────────────

  it('does not render character count when maxLength is null', () => {
    expect(fixture.debugElement.query(By.css('.fuse-textarea__count'))).toBeNull();
  });

  it('renders character count when maxLength is set', () => {
    fixture.componentRef.setInput('maxLength', 200);
    fixture.detectChanges();
    const count = fixture.debugElement.query(By.css('.fuse-textarea__count'));
    expect(count).toBeTruthy();
    expect(count.nativeElement.textContent).toContain('200');
  });

  it('sets maxlength attribute on textarea when maxLength is set', () => {
    fixture.componentRef.setInput('maxLength', 100);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('textarea')).nativeElement.maxLength
    ).toBe(100);
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
    fixture.componentRef.setInput('errorMessage', 'Too long');
    fixture.detectChanges();
    expect(component.showError()).toBe(true);
  });

  it('renders error span with role=alert', () => {
    fixture.componentRef.setInput('errorMessage', 'Required');
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.fuse-textarea__error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.getAttribute('role')).toBe('alert');
    expect(error.nativeElement.textContent.trim()).toBe('Required');
  });

  it('renders helper text when no error', () => {
    fixture.componentRef.setInput('helperText', 'Max 500 chars');
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.fuse-textarea__helper'))
    ).toBeTruthy();
  });

  it('hides helper text when showError is true', () => {
    fixture.componentRef.setInput('helperText', 'hint');
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.fuse-textarea__helper'))).toBeNull();
  });

  // ─── CSS state classes ────────────────────────────────────────────────────────

  it('adds fuse-textarea--error class when showError', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.fuse-textarea--error'))
    ).toBeTruthy();
  });

  it('adds fuse-textarea--disabled class when disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.fuse-textarea--disabled'))
    ).toBeTruthy();
  });

  it('adds fuse-textarea--auto-resize class when autoResize=true', () => {
    fixture.componentRef.setInput('autoResize', true);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.fuse-textarea--auto-resize'))
    ).toBeTruthy();
  });

  // ─── ControlValueAccessor ────────────────────────────────────────────────────

  it('writeValue sets internal signal', () => {
    component.writeValue('hello world');
    expect(component['value']()).toBe('hello world');
  });

  it('writeValue with null sets empty string', () => {
    component.writeValue(null as unknown as string);
    expect(component['value']()).toBe('');
  });

  it('setDisabledState(true) disables the textarea', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('textarea')).nativeElement.disabled
    ).toBe(true);
  });

  it('setDisabledState(false) re-enables the textarea', () => {
    component.setDisabledState(true);
    component.setDisabledState(false);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('textarea')).nativeElement.disabled
    ).toBe(false);
  });

  it('calls onChange with typed value', () => {
    const spy = jest.fn();
    component.registerOnChange(spy);
    const ta = fixture.debugElement.query(By.css('textarea'));
    ta.nativeElement.value = 'some text';
    ta.triggerEventHandler('input', { target: ta.nativeElement });
    expect(spy).toHaveBeenCalledWith('some text');
  });

  it('calls onTouched on blur', () => {
    const spy = jest.fn();
    component.registerOnTouched(spy);
    fixture.debugElement.query(By.css('textarea')).triggerEventHandler('blur', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('updates value signal on input event', () => {
    const ta = fixture.debugElement.query(By.css('textarea'));
    ta.nativeElement.value = 'updated';
    ta.triggerEventHandler('input', { target: ta.nativeElement });
    expect(component['value']()).toBe('updated');
  });

  // ─── Reactive form integration ────────────────────────────────────────────────

  it('syncs with FormControl', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.componentInstance.ctrl.setValue('from control');
    hostFixture.detectChanges();
    const ta = hostFixture.debugElement.query(By.css('textarea'));
    expect(ta.nativeElement.value).toBe('from control');
  });

  it('disables textarea when FormControl is disabled', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    hostFixture.componentInstance.ctrl.disable();
    hostFixture.detectChanges();
    expect(
      hostFixture.debugElement.query(By.css('textarea')).nativeElement.disabled
    ).toBe(true);
  });
});
