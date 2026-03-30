import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuseFormFieldComponent } from './fuse-form-field.component';

// ─── Test host ────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseFormFieldComponent],
  template: `
    <fuse-form-field
      [label]="label"
      [required]="required"
      [helperText]="helperText"
      [errorMessage]="errorMessage"
      [hasError]="hasError">
      <input fuseControl type="text" />
    </fuse-form-field>
  `,
})
class TestHostComponent {
  label        = '';
  required     = false;
  helperText   = '';
  errorMessage = '';
  hasError     = false;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const el = (f: ComponentFixture<unknown>, sel: string): HTMLElement | null =>
  f.nativeElement.querySelector(sel);

// ─── Specs ────────────────────────────────────────────────────────────────────

describe('FuseFormFieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('renders the wrapper div', () => {
    expect(el(fixture, '.fuse-form-field')).toBeTruthy();
  });

  it('does not render label when label is empty', () => {
    expect(el(fixture, 'fuse-label')).toBeNull();
  });

  it('renders label when label is set', () => {
    host.label = 'Email';
    fixture.detectChanges();
    expect(el(fixture, 'fuse-label')).toBeTruthy();
    expect(el(fixture, 'fuse-label')!.textContent?.trim()).toBe('Email');
  });

  it('projects the control via ng-content', () => {
    expect(el(fixture, '[fuseControl]')).toBeTruthy();
  });

  // ── Helper text ───────────────────────────────────────────────────────────

  it('does not render helper text when empty', () => {
    expect(el(fixture, '.fuse-form-field__helper')).toBeNull();
  });

  it('renders helper text when set and no error', () => {
    host.helperText = 'Enter your email';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__helper')!.textContent?.trim()).toBe('Enter your email');
  });

  it('hides helper text when hasError=true', () => {
    host.helperText = 'Helper';
    host.hasError   = true;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__helper')).toBeNull();
  });

  // ── Error message ─────────────────────────────────────────────────────────

  it('does not render error when hasError=false', () => {
    expect(el(fixture, '.fuse-form-field__error')).toBeNull();
  });

  it('does not render error when hasError=true but errorMessage empty', () => {
    host.hasError = true;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__error')).toBeNull();
  });

  it('renders error when hasError=true and errorMessage set', () => {
    host.hasError     = true;
    host.errorMessage = 'Field is required';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__error')!.textContent?.trim()).toBe('Field is required');
  });

  it('error element has role="alert"', () => {
    host.hasError     = true;
    host.errorMessage = 'Error!';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__error')!.getAttribute('role')).toBe('alert');
  });

  it('error element has data-entering attribute', () => {
    host.hasError     = true;
    host.errorMessage = 'Error!';
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__error')!.hasAttribute('data-entering')).toBe(true);
  });

  // ── Error state class ─────────────────────────────────────────────────────

  it('adds --error modifier class when hasError=true', () => {
    host.hasError = true;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field--error')).toBeTruthy();
  });

  it('removes --error modifier class when hasError=false', () => {
    host.hasError = false;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field--error')).toBeNull();
  });

  // ── Required ──────────────────────────────────────────────────────────────

  it('passes required=true to fuse-label', () => {
    host.label    = 'Name';
    host.required = true;
    fixture.detectChanges();
    const labelComp = fixture.debugElement.children[0].children[0].componentInstance;
    expect((labelComp as { required: () => boolean }).required()).toBe(true);
  });

  // ── Mutual exclusivity (helper vs error) ──────────────────────────────────

  it('shows only error (not helper) when both are set and hasError=true', () => {
    host.helperText   = 'Enter name';
    host.errorMessage = 'Name required';
    host.hasError     = true;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__helper')).toBeNull();
    expect(el(fixture, '.fuse-form-field__error')).toBeTruthy();
  });

  it('shows only helper (not error) when both are set and hasError=false', () => {
    host.helperText   = 'Enter name';
    host.errorMessage = 'Name required';
    host.hasError     = false;
    fixture.detectChanges();
    expect(el(fixture, '.fuse-form-field__helper')).toBeTruthy();
    expect(el(fixture, '.fuse-form-field__error')).toBeNull();
  });
});
