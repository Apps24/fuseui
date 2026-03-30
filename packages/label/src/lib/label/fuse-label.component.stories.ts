import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseLabelComponent } from './fuse-label.component';

const meta: Meta<FuseLabelComponent> = {
  title: 'Fuse / Label',
  component: FuseLabelComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
  ],
  argTypes: {
    for:      { control: 'text', description: 'ID of associated form control' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <fuse-label [for]="for" [required]="required" [disabled]="disabled">
        Label text
      </fuse-label>
    `,
  }),
};

export default meta;
type Story = StoryObj<FuseLabelComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: { for: '', required: false, disabled: false },
  render: (args) => ({
    props: args,
    template: `<fuse-label [for]="for" [required]="required" [disabled]="disabled">Email address</fuse-label>`,
  }),
};

// ─── Required ────────────────────────────────────────────────────────────────
export const Required: Story = {
  render: () => ({
    template: `<fuse-label [required]="true">Full name</fuse-label>`,
  }),
};

// ─── Disabled ────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => ({
    template: `<fuse-label [disabled]="true">Disabled field</fuse-label>`,
  }),
};

// ─── Required and Disabled ────────────────────────────────────────────────────
export const RequiredAndDisabled: Story = {
  render: () => ({
    template: `<fuse-label [required]="true" [disabled]="true">Username</fuse-label>`,
  }),
};

// ─── With Native Input ────────────────────────────────────────────────────────
export const WithNativeInput: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:6px;max-width:320px;padding:24px">
        <fuse-label for="demo-input" [required]="true">Email address</fuse-label>
        <input
          id="demo-input"
          type="email"
          placeholder="you@example.com"
          style="padding:8px 12px;border:1.5px solid var(--fuse-color-border-default,#d1d5db);border-radius:6px;font-size:14px;outline:none">
      </div>
    `,
  }),
};

// ─── All States ───────────────────────────────────────────────────────────────
export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;padding:24px">
        <fuse-label>Default label</fuse-label>
        <fuse-label [required]="true">Required label</fuse-label>
        <fuse-label [disabled]="true">Disabled label</fuse-label>
        <fuse-label [required]="true" [disabled]="true">Required + Disabled</fuse-label>
      </div>
    `,
  }),
};
