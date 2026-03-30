import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseBadgeComponent } from './fuse-badge.component';

const meta: Meta<FuseBadgeComponent> = {
  title: 'Fuse / Badge',
  component: FuseBadgeComponent,
  decorators: [moduleMetadata({ imports: [FuseBadgeComponent] })],
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'sm',
    dot: false,
    content: '3',
  },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'flat', 'outline'] },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
    content: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<FuseBadgeComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fuse-badge [variant]="variant" [color]="color" [size]="size"
                  [dot]="dot" [content]="content"></fuse-badge>
    `,
  }),
};

// ─── All colors ───────────────────────────────────────────────────────────────

export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
        <fuse-badge content="Primary"   color="primary"></fuse-badge>
        <fuse-badge content="Secondary" color="secondary"></fuse-badge>
        <fuse-badge content="Success"   color="success"></fuse-badge>
        <fuse-badge content="Warning"   color="warning"></fuse-badge>
        <fuse-badge content="Danger"    color="danger"></fuse-badge>
      </div>
    `,
  }),
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:8px; align-items:center;">
        <fuse-badge content="Solid"   variant="solid"></fuse-badge>
        <fuse-badge content="Flat"    variant="flat"></fuse-badge>
        <fuse-badge content="Outline" variant="outline"></fuse-badge>
      </div>
    `,
  }),
};

// ─── Dot mode ────────────────────────────────────────────────────────────────

export const DotMode: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <fuse-badge [dot]="true" color="primary"></fuse-badge>
        <fuse-badge [dot]="true" color="success"></fuse-badge>
        <fuse-badge [dot]="true" color="danger"></fuse-badge>
        <fuse-badge [dot]="true" color="warning" size="md"></fuse-badge>
      </div>
    `,
  }),
};

// ─── Overlay wrapping ─────────────────────────────────────────────────────────

export const OverlayWrapping: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:24px; align-items:flex-start;">
        <!-- Wrapping an icon-sized placeholder -->
        <fuse-badge content="5" color="danger">
          <div style="width:40px; height:40px; background:#e2e8f0; border-radius:8px;"></div>
        </fuse-badge>

        <!-- Dot overlay -->
        <fuse-badge [dot]="true" color="success">
          <div style="width:40px; height:40px; background:#e2e8f0; border-radius:50%;"></div>
        </fuse-badge>

        <!-- Notification count -->
        <fuse-badge content="99+" color="danger" size="md">
          <div style="width:48px; height:48px; background:#e2e8f0; border-radius:8px;"></div>
        </fuse-badge>
      </div>
    `,
  }),
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:8px; align-items:center;">
        <fuse-badge content="sm" size="sm"></fuse-badge>
        <fuse-badge content="md" size="md"></fuse-badge>
      </div>
    `,
  }),
};
