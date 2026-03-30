import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FusePopoverComponent } from './fuse-popover.component';

const meta: Meta = {
  title: 'Fuse / Popover',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [FusePopoverComponent] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Panel placement relative to trigger',
    },
    trigger: {
      control: 'radio',
      options: ['click', 'hover'],
      description: 'Interaction that opens the popover',
    },
    closeOnOutside: {
      control: 'boolean',
      description: 'Close when clicking outside',
    },
  },
};
export default meta;
type Story = StoryObj;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    placement: 'bottom',
    trigger: 'click',
    closeOnOutside: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:120px;display:flex;justify-content:center">
        <fuse-popover
          [placement]="placement"
          [trigger]="trigger"
          [closeOnOutside]="closeOnOutside">
          <button fusePopoverTrigger
            style="padding:8px 16px;border-radius:var(--fuse-radius-md,8px);
                   background:var(--fuse-color-primary);color:var(--fuse-color-on-primary);
                   border:none;cursor:pointer;font-size:0.875rem">
            Open popover
          </button>
          <div fusePopoverContent>
            <p style="margin:0 0 8px;font-weight:600;color:var(--fuse-color-text-primary)">
              Popover title
            </p>
            <p style="margin:0;font-size:0.875rem;color:var(--fuse-color-text-secondary)">
              This is some helpful popover content. Click outside to dismiss.
            </p>
          </div>
        </fuse-popover>
      </div>
    `,
  }),
};

// ─── All placements ───────────────────────────────────────────────────────────

export const AllPlacements: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,auto);
                  gap:16px;padding:160px;justify-items:center;align-items:center">
        <span></span>
        <fuse-popover placement="top">
          <button fusePopoverTrigger
            style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer">
            Top
          </button>
          <div fusePopoverContent style="white-space:nowrap">Opens above</div>
        </fuse-popover>
        <span></span>

        <fuse-popover placement="left">
          <button fusePopoverTrigger
            style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer">
            Left
          </button>
          <div fusePopoverContent style="white-space:nowrap">Opens to the left</div>
        </fuse-popover>

        <span style="width:60px"></span>

        <fuse-popover placement="right">
          <button fusePopoverTrigger
            style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer">
            Right
          </button>
          <div fusePopoverContent style="white-space:nowrap">Opens to the right</div>
        </fuse-popover>

        <span></span>
        <fuse-popover placement="bottom">
          <button fusePopoverTrigger
            style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer">
            Bottom
          </button>
          <div fusePopoverContent style="white-space:nowrap">Opens below</div>
        </fuse-popover>
        <span></span>
      </div>
    `,
  }),
};

// ─── Hover trigger ────────────────────────────────────────────────────────────

export const HoverTrigger: Story = {
  render: () => ({
    template: `
      <div style="padding:120px;display:flex;justify-content:center">
        <fuse-popover placement="top" trigger="hover">
          <button fusePopoverTrigger
            style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer">
            Hover me
          </button>
          <div fusePopoverContent>
            <p style="margin:0;font-size:0.875rem;color:var(--fuse-color-text-secondary)">
              Triggered on hover / focus
            </p>
          </div>
        </fuse-popover>
      </div>
    `,
  }),
};

// ─── Rich content ─────────────────────────────────────────────────────────────

export const RichContent: Story = {
  render: () => ({
    template: `
      <div style="padding:120px;display:flex;justify-content:center">
        <fuse-popover placement="bottom">
          <button fusePopoverTrigger
            style="padding:8px 16px;border-radius:6px;border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);color:var(--fuse-color-text-primary);cursor:pointer">
            Account info
          </button>
          <div fusePopoverContent style="width:220px">
            <div style="display:flex;flex-direction:column;gap:8px">
              <div style="font-weight:600;color:var(--fuse-color-text-primary)">Jane Doe</div>
              <div style="font-size:0.8125rem;color:var(--fuse-color-text-secondary)">jane@example.com</div>
              <hr style="border:none;border-top:1px solid var(--fuse-color-border-default);margin:4px 0">
              <button style="padding:6px 0;background:none;border:none;text-align:left;
                             font-size:0.875rem;color:var(--fuse-color-text-primary);cursor:pointer">
                View profile
              </button>
              <button style="padding:6px 0;background:none;border:none;text-align:left;
                             font-size:0.875rem;color:var(--fuse-color-danger);cursor:pointer">
                Sign out
              </button>
            </div>
          </div>
        </fuse-popover>
      </div>
    `,
  }),
};
