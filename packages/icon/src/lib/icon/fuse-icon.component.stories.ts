import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseIconComponent } from './fuse-icon.component';

const BUILTIN_ICONS = [
  'check', 'x', 'chevron-down', 'chevron-right', 'chevron-up',
  'search', 'eye', 'eye-off', 'info', 'warning', 'danger-triangle',
  'plus', 'minus', 'menu', 'close', 'arrow-right', 'arrow-left', 'spinner',
];

const meta: Meta<FuseIconComponent> = {
  title: 'Fuse / Icon',
  component: FuseIconComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
  ],
  argTypes: {
    name: {
      control: 'select',
      options: BUILTIN_ICONS,
      description: 'Icon name registered in FuseIconRegistryService',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant (xs=12, sm=16, md=20, lg=24, xl=32)',
    },
    color: {
      control: 'color',
      description: 'CSS colour value applied to the icon',
    },
  },
  render: (args) => ({
    props: args,
    template: `<fuse-icon [name]="name" [size]="size" [color]="color"></fuse-icon>`,
  }),
};

export default meta;
type Story = StoryObj<FuseIconComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    name: 'check',
    size: 'md',
    color: 'currentColor',
  },
};

// ─── All Built-in Icons ───────────────────────────────────────────────────────
export const AllBuiltinIcons: Story = {
  render: () => ({
    template: `
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 16px;
        padding: 24px;
      ">
        <div
          *ngFor="let icon of icons"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 16px 8px;
            border: 1px solid var(--fuse-color-neutral-200, #e5e7eb);
            border-radius: var(--fuse-radius-md, 6px);
          ">
          <fuse-icon [name]="icon" size="lg"></fuse-icon>
          <span style="font-size: 11px; color: var(--fuse-color-neutral-600, #4b5563); text-align:center; word-break:break-all">
            {{ icon }}
          </span>
        </div>
      </div>
    `,
    props: { icons: BUILTIN_ICONS },
  }),
};

// ─── All Sizes ────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:24px; padding:24px; flex-wrap:wrap">
        <div *ngFor="let s of sizes" style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <fuse-icon name="check" [size]="s.key"></fuse-icon>
          <span style="font-size:11px;color:var(--fuse-color-neutral-600,#4b5563)">
            {{ s.key }} ({{ s.px }}px)
          </span>
        </div>
      </div>
    `,
    props: {
      sizes: [
        { key: 'xs', px: 12 },
        { key: 'sm', px: 16 },
        { key: 'md', px: 20 },
        { key: 'lg', px: 24 },
        { key: 'xl', px: 32 },
      ],
    },
  }),
};

// ─── Custom Color ────────────────────────────────────────────────────────────
export const CustomColor: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:20px; padding:24px; flex-wrap:wrap">
        <fuse-icon name="warning" size="xl" color="var(--fuse-color-warning, #f59e0b)"></fuse-icon>
        <fuse-icon name="check"   size="xl" color="var(--fuse-color-success, #10b981)"></fuse-icon>
        <fuse-icon name="info"    size="xl" color="var(--fuse-color-primary, #3880ff)"></fuse-icon>
        <fuse-icon name="x"       size="xl" color="var(--fuse-color-danger,  #ef4444)"></fuse-icon>
        <fuse-icon name="star"    size="xl" color="var(--fuse-color-secondary, #6c757d)"></fuse-icon>
      </div>
    `,
  }),
};

// ─── Fallback — Missing Icon ─────────────────────────────────────────────────
export const FallbackMissing: Story = {
  render: () => ({
    template: `
      <div style="padding:24px">
        <p style="margin-bottom:12px;font-size:14px;color:var(--fuse-color-neutral-600,#4b5563)">
          An unregistered icon name renders nothing (empty span) without throwing:
        </p>
        <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;
                    border:1px dashed var(--fuse-color-neutral-300,#d1d5db);border-radius:4px">
          <fuse-icon name="this-icon-does-not-exist" size="lg"></fuse-icon>
          <span style="font-size:13px;color:var(--fuse-color-neutral-500,#6b7280)">← empty, no error</span>
        </div>
      </div>
    `,
  }),
};
