import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuseSelectComponent, FuseSelectOption } from './fuse-select.component';

const COUNTRIES: FuseSelectOption[] = [
  { value: 'ng', label: 'Nigeria' },
  { value: 'gh', label: 'Ghana' },
  { value: 'ke', label: 'Kenya' },
  { value: 'za', label: 'South Africa' },
  { value: 'eg', label: 'Egypt' },
  { value: 'et', label: 'Ethiopia' },
  { value: 'tz', label: 'Tanzania' },
  { value: 'ug', label: 'Uganda' },
];

const ROLES: FuseSelectOption[] = [
  { value: 'admin',  label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest',  label: 'Guest',  disabled: true },
];

const meta: Meta<FuseSelectComponent> = {
  title: 'Fuse / Select',
  component: FuseSelectComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [ReactiveFormsModule] }),
  ],
  argTypes: {
    options:     { control: false },
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    multiple:    { control: 'boolean' },
    searchable:  { control: 'boolean' },
    disabled:    { control: 'boolean' },
    hasError:    { control: 'boolean' },
    selectionChange: { action: 'selectionChange' },
  },
  render: (args) => ({
    props: { ...args, opts: COUNTRIES },
    template: `
      <div style="max-width:320px;padding:24px">
        <fuse-select
          [options]="opts"
          [label]="label"
          [placeholder]="placeholder"
          [size]="size"
          [multiple]="multiple"
          [searchable]="searchable"
          [disabled]="disabled"
          [hasError]="hasError"
          (selectionChange)="selectionChange($event)">
        </fuse-select>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<FuseSelectComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    size: 'md',
    multiple: false,
    searchable: false,
    disabled: false,
    hasError: false,
  },
};

// ─── Searchable ───────────────────────────────────────────────────────────────
export const Searchable: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    searchable: true,
  },
};

// ─── Multiple ────────────────────────────────────────────────────────────────
export const Multiple: Story = {
  args: {
    label: 'Countries',
    placeholder: 'Select countries',
    multiple: true,
    searchable: true,
  },
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => ({
    props: { opts: COUNTRIES },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:320px;padding:24px">
        <fuse-select [options]="opts" label="Small"  size="sm" placeholder="Small select"></fuse-select>
        <fuse-select [options]="opts" label="Medium" size="md" placeholder="Medium select"></fuse-select>
        <fuse-select [options]="opts" label="Large"  size="lg" placeholder="Large select"></fuse-select>
      </div>
    `,
  }),
};

// ─── With Error ───────────────────────────────────────────────────────────────
export const WithError: Story = {
  args: {
    label: 'Role',
    placeholder: 'Select a role',
    hasError: true,
  },
  render: (args) => ({
    props: { ...args, opts: ROLES },
    template: `
      <div style="max-width:320px;padding:24px">
        <fuse-select [options]="opts" [label]="label" [placeholder]="placeholder" [hasError]="hasError"></fuse-select>
      </div>
    `,
  }),
};

// ─── With Disabled Options ────────────────────────────────────────────────────
export const WithDisabledOptions: Story = {
  render: () => ({
    props: { opts: ROLES },
    template: `
      <div style="max-width:320px;padding:24px">
        <fuse-select [options]="opts" label="Role" placeholder="Select a role"></fuse-select>
        <p style="margin-top:8px;font-size:12px;color:var(--fuse-color-text-secondary,#6b7280)">
          "Guest" is disabled.
        </p>
      </div>
    `,
  }),
};

// ─── Disabled ────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => ({
    props: { ctrl: new FormControl({ value: 'ke', disabled: true }), opts: COUNTRIES },
    template: `
      <div style="max-width:320px;padding:24px">
        <fuse-select [options]="opts" label="Country" [formControl]="ctrl"></fuse-select>
      </div>
    `,
  }),
};

// ─── Reactive Form ────────────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [FuseSelectComponent, ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width:360px;padding:24px;display:flex;flex-direction:column;gap:16px">
      <fuse-select
        [options]="countries"
        label="Country"
        placeholder="Select your country"
        formControlName="country"
        [hasError]="form.get('country')?.invalid && form.get('country')?.touched"
        (selectionChange)="onCountryChange($event)">
      </fuse-select>
      <fuse-select
        [options]="roles"
        label="Roles"
        placeholder="Select roles"
        [multiple]="true"
        [searchable]="true"
        formControlName="roles">
      </fuse-select>
      <button type="submit" style="padding:8px 16px;background:var(--fuse-color-primary,#3880ff);color:#fff;border:none;border-radius:6px;cursor:pointer">
        Submit
      </button>
      <pre *ngIf="submitted" style="font-size:12px">{{ form.value | json }}</pre>
    </form>
  `,
})
class ReactiveExampleComponent {
  countries = COUNTRIES;
  roles = ROLES;
  submitted = false;
  form = new FormBuilder().group({
    country: [null, Validators.required],
    roles:   [[]],
  });
  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) this.submitted = true;
  }
  onCountryChange(val: string) { console.log('country changed:', val); }
}

export const ReactiveForm: Story = {
  render: () => ({ component: ReactiveExampleComponent }),
};

// ─── Keyboard Navigation ──────────────────────────────────────────────────────
export const KeyboardNavigation: Story = {
  render: () => ({
    props: { opts: COUNTRIES },
    template: `
      <div style="max-width:320px;padding:24px">
        <p style="margin-bottom:12px;font-size:13px;color:var(--fuse-color-text-secondary,#6b7280)">
          Click the select, then use ↑ ↓ to navigate, Enter to select, Escape to close.
        </p>
        <fuse-select [options]="opts" label="Country" placeholder="Keyboard navigate me"></fuse-select>
      </div>
    `,
  }),
};
