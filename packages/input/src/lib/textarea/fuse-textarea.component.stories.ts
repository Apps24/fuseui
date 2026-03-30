import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { FuseTextareaComponent } from './fuse-textarea.component';

const meta: Meta<FuseTextareaComponent> = {
  title: 'Fuse / Textarea',
  component: FuseTextareaComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [ReactiveFormsModule] }),
  ],
  argTypes: {
    label:        { control: 'text' },
    placeholder:  { control: 'text' },
    helperText:   { control: 'text' },
    errorMessage: { control: 'text' },
    hasError:     { control: 'boolean' },
    rows:         { control: 'number' },
    maxLength:    { control: 'number' },
    autoResize:   { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <fuse-textarea
        [label]="label"
        [placeholder]="placeholder"
        [helperText]="helperText"
        [errorMessage]="errorMessage"
        [hasError]="hasError"
        [rows]="rows"
        [maxLength]="maxLength"
        [autoResize]="autoResize">
      </fuse-textarea>
    `,
  }),
};

export default meta;
type Story = StoryObj<FuseTextareaComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: '',
    placeholder: 'Type something...',
    rows: 3,
    maxLength: null,
    autoResize: false,
    hasError: false,
    errorMessage: '',
    helperText: '',
  },
};

// ─── With Label and Helper ─────────────────────────────────────────────────────
export const WithLabelAndHelper: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    helperText: 'Keep it under 200 characters.',
    rows: 4,
  },
};

// ─── With Max Length ──────────────────────────────────────────────────────────
export const WithMaxLength: Story = {
  args: {
    label: 'Comment',
    placeholder: 'Write your comment...',
    maxLength: 280,
    rows: 4,
    helperText: 'Twitter-style limit.',
  },
};

// ─── With Error ───────────────────────────────────────────────────────────────
export const WithError: Story = {
  args: {
    label: 'Description',
    hasError: true,
    errorMessage: 'Description is required.',
    rows: 3,
  },
};

// ─── Auto Resize ──────────────────────────────────────────────────────────────
export const AutoResize: Story = {
  args: {
    label: 'Auto-resize textarea',
    placeholder: 'Start typing — I grow automatically!',
    autoResize: true,
    rows: 2,
    helperText: 'Expands as you type.',
  },
};

// ─── Disabled ────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => ({
    props: { ctrl: new FormControl({ value: 'Cannot edit this content.', disabled: true }) },
    template: `
      <div style="max-width:480px;padding:24px">
        <fuse-textarea label="Disabled" [formControl]="ctrl"></fuse-textarea>
      </div>
    `,
  }),
};

// ─── Reactive Form ────────────────────────────────────────────────────────────
export const ReactiveForm: Story = {
  render: () => ({
    props: {
      ctrl: new FormControl('', [Validators.required, Validators.maxLength(300)]),
    },
    template: `
      <div style="max-width:480px;padding:24px">
        <fuse-textarea
          label="Feedback"
          placeholder="Share your thoughts..."
          [maxLength]="300"
          [rows]="5"
          [formControl]="ctrl"
          [hasError]="ctrl.invalid && ctrl.touched"
          [errorMessage]="ctrl.hasError('required') && ctrl.touched ? 'Feedback is required.' : ''">
        </fuse-textarea>
      </div>
    `,
  }),
};
