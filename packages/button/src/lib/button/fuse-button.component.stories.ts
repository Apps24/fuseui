import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseButtonComponent } from './fuse-button.component';

const meta: Meta<FuseButtonComponent> = {
  title: 'Fuse / Button',
  component: FuseButtonComponent,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideAnimations()] })],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link'],
      description: 'Visual style of the button',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger'],
      description: 'Colour theme',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    clicked: { action: 'clicked' },
  },
  render: (args) => ({
    props: args,
    template: `
      <fuse-button
        [variant]="variant"
        [color]="color"
        [size]="size"
        [disabled]="disabled"
        [loading]="loading"
        [type]="type"
        (clicked)="clicked($event)">
        Button
      </fuse-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<FuseButtonComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button',
  },
};

// ─── All Variants ─────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  args: {
    variant: 'outline',
  },

  render: () => ({
    template: `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <fuse-button variant="solid">Solid</fuse-button>
        <fuse-button variant="outline">Outline</fuse-button>
        <fuse-button variant="ghost">Ghost</fuse-button>
        <fuse-button variant="link">Link</fuse-button>
      </div>
    `,
  }),
};

// ─── All Colors ───────────────────────────────────────────────────────────────
export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <fuse-button color="primary">Primary</fuse-button>
        <fuse-button color="secondary">Secondary</fuse-button>
        <fuse-button color="success">Success</fuse-button>
        <fuse-button color="danger">Danger</fuse-button>
      </div>
    `,
  }),
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <fuse-button size="sm">Small</fuse-button>
        <fuse-button size="md">Medium</fuse-button>
        <fuse-button size="lg">Large</fuse-button>
      </div>
    `,
  }),
};

// ─── Loading ─────────────────────────────────────────────────────────────────
export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <fuse-button [loading]="loading" color="primary">Saving…</fuse-button>
        <fuse-button [loading]="loading" color="danger" variant="outline">Deleting…</fuse-button>
      </div>
    `,
  }),
};

// ─── Disabled ────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <fuse-button [disabled]="true" variant="solid">Disabled Solid</fuse-button>
        <fuse-button [disabled]="true" variant="outline">Disabled Outline</fuse-button>
        <fuse-button [disabled]="true" variant="ghost">Disabled Ghost</fuse-button>
      </div>
    `,
  }),
};

// ─── As Submit ───────────────────────────────────────────────────────────────
export const AsSubmit: Story = {
  render: () => ({
    template: `
      <form (ngSubmit)="null" style="display:flex;gap:12px">
        <fuse-button type="submit" color="success">Submit Form</fuse-button>
        <fuse-button type="reset" variant="outline">Reset</fuse-button>
      </form>
    `,
  }),
};

// ─── With Icon (slot) ─────────────────────────────────────────────────────────
export const WithIcon: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <fuse-button color="primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Item
        </fuse-button>
        <fuse-button color="danger" variant="outline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path><path d="M14 11v6"></path>
          </svg>
          Delete
        </fuse-button>
      </div>
    `,
  }),
};
