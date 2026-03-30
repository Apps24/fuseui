import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { FuseInputComponent } from './fuse-input.component';

const meta: Meta<FuseInputComponent> = {
  title: 'Fuse / Input',
  component: FuseInputComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [ReactiveFormsModule, FormsModule] }),
  ],
  argTypes: {
    label:        { control: 'text' },
    type:         { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] },
    placeholder:  { control: 'text' },
    required:     { control: 'boolean' },
    helperText:   { control: 'text' },
    errorMessage: { control: 'text' },
    hasError:     { control: 'boolean' },
    size:         { control: 'select', options: ['sm', 'md', 'lg'] },
    readonly:     { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <fuse-input
        [label]="label"
        [type]="type"
        [placeholder]="placeholder"
        [required]="required"
        [helperText]="helperText"
        [errorMessage]="errorMessage"
        [hasError]="hasError"
        [size]="size"
        [readonly]="readonly">
      </fuse-input>
    `,
  }),
};

export default meta;
type Story = StoryObj<FuseInputComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: '',
    type: 'text',
    placeholder: 'Type something…',
    required: false,
    helperText: '',
    errorMessage: '',
    hasError: false,
    size: 'md',
    readonly: false,
  },
};

// ─── With Label ───────────────────────────────────────────────────────────────
export const WithLabel: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
    required: true,
    helperText: "We'll never share your email.",
  },
};

// ─── With Error ───────────────────────────────────────────────────────────────
export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    hasError: true,
    errorMessage: 'Username is already taken.',
  },
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px;padding:24px">
        <fuse-input label="Small" size="sm" placeholder="Small input"></fuse-input>
        <fuse-input label="Medium" size="md" placeholder="Medium input"></fuse-input>
        <fuse-input label="Large" size="lg" placeholder="Large input"></fuse-input>
      </div>
    `,
  }),
};

// ─── With Prefix ─────────────────────────────────────────────────────────────
export const WithPrefix: Story = {
  render: () => ({
    template: `
      <div style="max-width:360px;padding:24px">
        <fuse-input label="Website" placeholder="example.com">
          <span fusePrefix style="font-size:13px;color:var(--fuse-color-text-secondary,#6b7280);padding:0 8px;border-right:1px solid var(--fuse-color-border-default,#d1d5db);white-space:nowrap">
            https://
          </span>
        </fuse-input>
      </div>
    `,
  }),
};

// ─── With Suffix ─────────────────────────────────────────────────────────────
export const WithSuffix: Story = {
  render: () => ({
    template: `
      <div style="max-width:360px;padding:24px">
        <fuse-input label="Amount" type="number" placeholder="0.00">
          <span fuseSuffix style="font-size:13px;color:var(--fuse-color-text-secondary,#6b7280);padding:0 8px;border-left:1px solid var(--fuse-color-border-default,#d1d5db)">
            USD
          </span>
        </fuse-input>
      </div>
    `,
  }),
};

// ─── Disabled ────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => ({
    props: { ctrl: new FormControl({ value: 'Cannot edit this', disabled: true }) },
    template: `
      <div style="max-width:360px;padding:24px">
        <fuse-input label="Disabled field" [formControl]="ctrl"></fuse-input>
      </div>
    `,
  }),
};

// ─── Readonly ────────────────────────────────────────────────────────────────
export const Readonly: Story = {
  args: {
    label: 'API Key',
    readonly: true,
  },
  render: (args) => ({
    props: { ...args, ctrl: new FormControl('sk-••••••••••••••••') },
    template: `
      <div style="max-width:360px;padding:24px">
        <fuse-input
          [label]="label"
          [readonly]="readonly"
          [formControl]="ctrl">
        </fuse-input>
      </div>
    `,
  }),
};

// ─── Reactive Form Example ────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [FuseInputComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width:360px;padding:24px;display:flex;flex-direction:column;gap:16px">
      <fuse-input
        label="Email"
        type="email"
        placeholder="you@example.com"
        [required]="true"
        formControlName="email"
        [hasError]="form.get('email')?.invalid && form.get('email')?.touched"
        [errorMessage]="form.get('email')?.hasError('required') && form.get('email')?.touched ? 'Email is required' : form.get('email')?.hasError('email') && form.get('email')?.touched ? 'Enter a valid email' : ''">
      </fuse-input>
      <fuse-input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        [required]="true"
        formControlName="password"
        [hasError]="form.get('password')?.invalid && form.get('password')?.touched"
        [errorMessage]="form.get('password')?.hasError('minlength') && form.get('password')?.touched ? 'Minimum 8 characters' : ''">
      </fuse-input>
      <button type="submit" style="padding:8px 16px;background:var(--fuse-color-primary,#3880ff);color:#fff;border:none;border-radius:6px;cursor:pointer">
        Submit
      </button>
      <pre *ngIf="submitted" style="font-size:12px">{{ form.value | json }}</pre>
    </form>
  `,
})
class ReactiveExampleComponent {
  submitted = false;
  form = new FormBuilder().group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) this.submitted = true;
  }
}

export const ReactiveFormExample: Story = {
  render: () => ({ component: ReactiveExampleComponent }),
};

// ─── Template Form Example ────────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [FuseInputComponent, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" style="max-width:360px;padding:24px;display:flex;flex-direction:column;gap:16px">
      <fuse-input
        label="Display name"
        placeholder="Your name"
        [(ngModel)]="name"
        name="name">
      </fuse-input>
      <button type="submit" style="padding:8px 16px;background:var(--fuse-color-primary,#3880ff);color:#fff;border:none;border-radius:6px;cursor:pointer">
        Save
      </button>
      <p *ngIf="saved" style="font-size:13px;color:var(--fuse-color-success,#10b981)">Saved: {{ name }}</p>
    </form>
  `,
})
class TemplateExampleComponent {
  name = '';
  saved = false;
  onSubmit() { this.saved = true; }
}

export const TemplateFormExample: Story = {
  render: () => ({ component: TemplateExampleComponent }),
};
