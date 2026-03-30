import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseChipComponent } from './fuse-chip.component';

const meta: Meta<FuseChipComponent> = {
  title: 'Fuse / Chip',
  component: FuseChipComponent,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideAnimations()] })],
  argTypes: {
    variant:   { control: 'select', options: ['solid', 'flat', 'bordered'] },
    color:     { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'danger'] },
    size:      { control: 'select', options: ['sm', 'md'] },
    closable:  { control: 'boolean' },
    selectable: { control: 'boolean' },
    selected:  { control: 'boolean' },
    chipClose: { action: 'chipClose' },
  },
  render: (args) => ({
    props: args,
    template: `
      <fuse-chip
        [variant]="variant"
        [color]="color"
        [size]="size"
        [closable]="closable"
        [selectable]="selectable"
        [(selected)]="selected"
        (chipClose)="chipClose()">
        Chip label
      </fuse-chip>
    `,
  }),
};

export default meta;
type Story = StoryObj<FuseChipComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { variant: 'flat', color: 'primary', size: 'md' },
};

// ─── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseChipComponent] },
    template: `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <fuse-chip variant="solid"   color="primary">Solid</fuse-chip>
        <fuse-chip variant="flat"    color="primary">Flat</fuse-chip>
        <fuse-chip variant="bordered" color="primary">Bordered</fuse-chip>
      </div>
    `,
  }),
};

// ─── All Colors ───────────────────────────────────────────────────────────────

export const AllColors: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseChipComponent] },
    template: `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <fuse-chip color="primary">Primary</fuse-chip>
        <fuse-chip color="secondary">Secondary</fuse-chip>
        <fuse-chip color="success">Success</fuse-chip>
        <fuse-chip color="warning">Warning</fuse-chip>
        <fuse-chip color="danger">Danger</fuse-chip>
      </div>
    `,
  }),
};

// ─── Closable ─────────────────────────────────────────────────────────────────

export const Closable: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseChipComponent] },
    template: `
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <fuse-chip [closable]="true" color="primary">Angular</fuse-chip>
        <fuse-chip [closable]="true" color="success">TypeScript</fuse-chip>
        <fuse-chip [closable]="true" color="secondary">RxJS</fuse-chip>
        <fuse-chip [closable]="true" color="warning" variant="bordered">Ionic</fuse-chip>
      </div>
    `,
  }),
};

// ─── Selectable ───────────────────────────────────────────────────────────────

export const Selectable: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseChipComponent] },
    template: `
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <fuse-chip [selectable]="true" color="primary">React</fuse-chip>
        <fuse-chip [selectable]="true" color="primary" [selected]="true">Angular</fuse-chip>
        <fuse-chip [selectable]="true" color="primary">Vue</fuse-chip>
        <fuse-chip [selectable]="true" color="primary">Svelte</fuse-chip>
      </div>
      <p style="margin-top:12px;color:var(--fuse-color-text-secondary);font-size:0.875rem">
        Click to toggle selection — spring press animation on click
      </p>
    `,
  }),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseChipComponent] },
    template: `
      <div style="display:flex;gap:10px;align-items:center">
        <fuse-chip size="sm" color="primary">Small</fuse-chip>
        <fuse-chip size="md" color="primary">Medium</fuse-chip>
      </div>
    `,
  }),
};
