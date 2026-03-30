import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FuseTooltipDirective } from './fuse-tooltip.directive';

const meta: Meta = {
  title: 'Fuse / Tooltip',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [FuseTooltipDirective] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    fuseTooltip: { control: 'text', description: 'Tooltip text' },
    fuseTooltipPlacement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Preferred placement',
    },
    fuseTooltipDelay: { control: 'number', description: 'Show delay in ms' },
    fuseTooltipDisabled: { control: 'boolean', description: 'Disable the tooltip' },
  },
};
export default meta;
type Story = StoryObj;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    fuseTooltip: 'This is a tooltip',
    fuseTooltipPlacement: 'top',
    fuseTooltipDelay: 200,
    fuseTooltipDisabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <button
          style="padding:8px 16px;background:var(--fuse-color-primary);
                 color:var(--fuse-color-on-primary);border:none;
                 border-radius:var(--fuse-radius-md,8px);cursor:pointer;
                 font-size:0.875rem"
          [fuseTooltip]="fuseTooltip"
          [fuseTooltipPlacement]="fuseTooltipPlacement"
          [fuseTooltipDelay]="fuseTooltipDelay"
          [fuseTooltipDisabled]="fuseTooltipDisabled">
          Hover me
        </button>
      </div>
    `,
  }),
};

// ─── All placements ───────────────────────────────────────────────────────────

export const AllPlacements: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,auto);
                  gap:16px;padding:100px;justify-items:center;align-items:center">
        <span></span>
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="Top tooltip" fuseTooltipPlacement="top" [fuseTooltipDelay]="0">
          Top
        </button>
        <span></span>
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="Left tooltip" fuseTooltipPlacement="left" [fuseTooltipDelay]="0">
          Left
        </button>
        <span style="width:60px"></span>
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="Right tooltip" fuseTooltipPlacement="right" [fuseTooltipDelay]="0">
          Right
        </button>
        <span></span>
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="Bottom tooltip" fuseTooltipPlacement="bottom" [fuseTooltipDelay]="0">
          Bottom
        </button>
        <span></span>
      </div>
    `,
  }),
};

// ─── Long text ────────────────────────────────────────────────────────────────

export const LongText: Story = {
  render: () => ({
    template: `
      <div style="padding:120px;display:flex;justify-content:center">
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="This is a much longer tooltip that wraps to multiple lines. Max width is 240px."
          fuseTooltipPlacement="top" [fuseTooltipDelay]="0">
          Long tooltip
        </button>
      </div>
    `,
  }),
};

// ─── Keyboard focus ───────────────────────────────────────────────────────────

export const KeyboardFocus: Story = {
  render: () => ({
    template: `
      <div style="padding:80px;display:flex;gap:16px;justify-content:center">
        <p style="color:var(--fuse-color-text-secondary);font-size:0.875rem;margin:0 0 16px">
          Tab to focus each button to trigger tooltip
        </p>
      </div>
      <div style="padding:0 80px 80px;display:flex;gap:16px">
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="Save the document" fuseTooltipPlacement="top" [fuseTooltipDelay]="0">
          Save
        </button>
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="Undo last action (Ctrl+Z)" fuseTooltipPlacement="top" [fuseTooltipDelay]="0">
          Undo
        </button>
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="Delete permanently" fuseTooltipPlacement="top" [fuseTooltipDelay]="0">
          Delete
        </button>
      </div>
    `,
  }),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="padding:80px;display:flex;gap:16px;justify-content:center">
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer"
          fuseTooltip="I will show" fuseTooltipPlacement="top" [fuseTooltipDelay]="0">
          Enabled tooltip
        </button>
        <button style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                       background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-secondary);cursor:pointer"
          fuseTooltip="I won't show" [fuseTooltipDisabled]="true">
          Disabled tooltip
        </button>
      </div>
    `,
  }),
};
