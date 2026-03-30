import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FuseCheckboxComponent } from './fuse-checkbox.component';

describe('FuseCheckboxComponent (standalone)', () => {
  let fixture: ComponentFixture<FuseCheckboxComponent>;
  let component: FuseCheckboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuseCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FuseCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Rendering ─────────────────────────────────────────────────────────────

  it('renders the host label', () => {
    const label = fixture.nativeElement.querySelector('.fuse-checkbox');
    expect(label).toBeTruthy();
  });

  it('renders a hidden native checkbox input', () => {
    const input = fixture.nativeElement.querySelector('.fuse-checkbox__native');
    expect(input).toBeTruthy();
    expect(input.type).toBe('checkbox');
  });

  it('does not render label span when label is empty', () => {
    const labelSpan = fixture.nativeElement.querySelector('.fuse-checkbox__label');
    expect(labelSpan).toBeNull();
  });

  it('renders label span when label input is set', () => {
    fixture.componentRef.setInput('label', 'Accept terms');
    fixture.detectChanges();
    const labelSpan = fixture.nativeElement.querySelector('.fuse-checkbox__label');
    expect(labelSpan?.textContent?.trim()).toBe('Accept terms');
  });

  // ─── Size classes ───────────────────────────────────────────────────────────

  it('applies md class by default', () => {
    const el = fixture.nativeElement.querySelector('.fuse-checkbox--md');
    expect(el).toBeTruthy();
  });

  it('applies sm class when size is sm', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--sm')).toBeTruthy();
  });

  it('applies lg class when size is lg', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--lg')).toBeTruthy();
  });

  // ─── Checked state ──────────────────────────────────────────────────────────

  it('is unchecked by default', () => {
    const box = fixture.nativeElement.querySelector('.fuse-checkbox');
    expect(box.classList).not.toContain('fuse-checkbox--checked');
    expect(fixture.nativeElement.querySelector('.fuse-checkbox__native').checked).toBe(false);
  });

  it('shows checkmark icon when checked', () => {
    component.writeValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--checked')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox__icon')).toBeTruthy();
  });

  it('hides checkmark icon when unchecked', () => {
    component.writeValue(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox__icon')).toBeNull();
  });

  // ─── Indeterminate state ────────────────────────────────────────────────────

  it('applies indeterminate class and sets native property', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('.fuse-checkbox');
    expect(wrapper.classList).toContain('fuse-checkbox--indeterminate');
    const input = fixture.nativeElement.querySelector('.fuse-checkbox__native');
    expect(input.indeterminate).toBe(true);
  });

  it('shows dash icon when indeterminate (regardless of checked state)', () => {
    component.writeValue(true);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    // There should be exactly one icon — the dash, not the checkmark
    const icons = fixture.nativeElement.querySelectorAll('.fuse-checkbox__icon');
    expect(icons.length).toBe(1);
  });

  // ─── Disabled state ─────────────────────────────────────────────────────────

  it('applies disabled class when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--disabled')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox__native').disabled).toBe(true);
  });

  it('does not emit when clicked while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const emitted: boolean[] = [];
    component.checkedChange.subscribe((v: boolean) => emitted.push(v));

    const input = fixture.nativeElement.querySelector('.fuse-checkbox__native');
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted.length).toBe(0);
  });

  // ─── User interaction ───────────────────────────────────────────────────────

  it('emits checkedChange true when user checks the box', () => {
    const emitted: boolean[] = [];
    component.checkedChange.subscribe((v: boolean) => emitted.push(v));

    const input = fixture.nativeElement.querySelector('.fuse-checkbox__native') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
  });

  it('emits checkedChange false when user unchecks the box', () => {
    component.writeValue(true);
    fixture.detectChanges();

    const emitted: boolean[] = [];
    component.checkedChange.subscribe((v: boolean) => emitted.push(v));

    const input = fixture.nativeElement.querySelector('.fuse-checkbox__native') as HTMLInputElement;
    input.checked = false;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emitted).toEqual([false]);
  });

  // ─── ControlValueAccessor ───────────────────────────────────────────────────

  it('writeValue(true) marks the checkbox as checked', () => {
    component.writeValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--checked')).toBeTruthy();
  });

  it('writeValue(false) marks the checkbox as unchecked', () => {
    component.writeValue(true);
    fixture.detectChanges();
    component.writeValue(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--checked')).toBeNull();
  });

  it('writeValue(null) treats null as falsy', () => {
    component.writeValue(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--checked')).toBeNull();
  });

  it('calls onChange when the user toggles', () => {
    const onChange = jest.fn();
    component.registerOnChange(onChange);

    const input = fixture.nativeElement.querySelector('.fuse-checkbox__native') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onTouched when the input blurs', () => {
    const onTouched = jest.fn();
    component.registerOnTouched(onTouched);

    fixture.nativeElement.querySelector('.fuse-checkbox__native').dispatchEvent(new Event('blur'));
    expect(onTouched).toHaveBeenCalled();
  });

  it('setDisabledState(true) disables the checkbox via CVA', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox__native').disabled).toBe(true);
  });
});

// ─── Reactive form integration ──────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseCheckboxComponent, ReactiveFormsModule],
  template: `<fuse-checkbox [formControl]="ctrl" label="Agree"></fuse-checkbox>`,
})
class CheckboxFormHost {
  ctrl = new FormControl(false);
}

describe('FuseCheckboxComponent with FormControl', () => {
  let fixture: ComponentFixture<CheckboxFormHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxFormHost],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxFormHost);
    fixture.detectChanges();
  });

  it('reflects initial false from FormControl', () => {
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--checked')).toBeNull();
  });

  it('updates the DOM when FormControl value changes to true', () => {
    fixture.componentInstance.ctrl.setValue(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--checked')).toBeTruthy();
  });

  it('disables via FormControl.disable()', () => {
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.fuse-checkbox--disabled')).toBeTruthy();
  });

  it('updates FormControl when user checks the box', () => {
    const input = fixture.nativeElement.querySelector('.fuse-checkbox__native') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(true);
  });
});
