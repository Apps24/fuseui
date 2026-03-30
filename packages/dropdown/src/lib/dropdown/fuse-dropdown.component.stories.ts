import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseDropdownComponent } from './fuse-dropdown.component';
import { FuseDropdownItemComponent } from './fuse-dropdown-item.component';

const meta: Meta = {
  title: 'Fuse / Dropdown',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({ imports: [FuseDropdownComponent, FuseDropdownItemComponent] }),
  ],
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <fuse-dropdown>
          <button fuseDropdownTrigger
            style="display:flex;align-items:center;gap:6px;padding:8px 16px;
                   border-radius:var(--fuse-radius-md,8px);
                   border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);
                   color:var(--fuse-color-text-primary);cursor:pointer;font-size:0.875rem">
            Options
            <span style="font-size:0.75rem">▾</span>
          </button>
          <fuse-dropdown-item label="Edit" icon="pencil"></fuse-dropdown-item>
          <fuse-dropdown-item label="Rename" icon="pencil-square"></fuse-dropdown-item>
          <fuse-dropdown-item label="Duplicate" icon="document-duplicate"></fuse-dropdown-item>
          <fuse-dropdown-item label="Delete" icon="trash" [destructive]="true"></fuse-dropdown-item>
        </fuse-dropdown>
      </div>
    `,
  }),
};

// ─── Destructive item ─────────────────────────────────────────────────────────

export const WithDestructiveItem: Story = {
  render: () => ({
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <fuse-dropdown>
          <button fuseDropdownTrigger
            style="padding:8px 16px;border-radius:var(--fuse-radius-md,8px);
                   border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);
                   color:var(--fuse-color-text-primary);cursor:pointer;font-size:0.875rem">
            File actions ▾
          </button>
          <fuse-dropdown-item label="Save"   icon="document-arrow-down"></fuse-dropdown-item>
          <fuse-dropdown-item label="Export" icon="arrow-up-tray"></fuse-dropdown-item>
          <fuse-dropdown-item label="Archive" [disabled]="true"></fuse-dropdown-item>
          <fuse-dropdown-item label="Delete permanently" [destructive]="true"></fuse-dropdown-item>
        </fuse-dropdown>
      </div>
    `,
  }),
};

// ─── Disabled item ────────────────────────────────────────────────────────────

export const WithDisabledItem: Story = {
  render: () => ({
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <fuse-dropdown>
          <button fuseDropdownTrigger
            style="padding:8px 16px;border-radius:var(--fuse-radius-md,8px);
                   border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);
                   color:var(--fuse-color-text-primary);cursor:pointer;font-size:0.875rem">
            Actions ▾
          </button>
          <fuse-dropdown-item label="Edit"></fuse-dropdown-item>
          <fuse-dropdown-item label="Publish" [disabled]="true"></fuse-dropdown-item>
          <fuse-dropdown-item label="Unpublish" [disabled]="true"></fuse-dropdown-item>
          <fuse-dropdown-item label="Delete" [destructive]="true"></fuse-dropdown-item>
        </fuse-dropdown>
      </div>
    `,
  }),
};

// ─── Icon-only items ──────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => ({
    template: `
      <div style="padding:80px;display:flex;justify-content:center">
        <fuse-dropdown>
          <button fuseDropdownTrigger
            style="padding:8px;width:36px;height:36px;border-radius:var(--fuse-radius-full,50%);
                   border:1px solid var(--fuse-color-border-default);
                   background:var(--fuse-color-bg-surface);
                   color:var(--fuse-color-text-primary);cursor:pointer;
                   display:flex;align-items:center;justify-content:center;font-size:1.1rem">
            ⋯
          </button>
          <fuse-dropdown-item label="Profile"   icon="user"></fuse-dropdown-item>
          <fuse-dropdown-item label="Settings"  icon="cog-6-tooth"></fuse-dropdown-item>
          <fuse-dropdown-item label="Help"      icon="question-mark-circle"></fuse-dropdown-item>
          <fuse-dropdown-item label="Sign out"  [destructive]="true"></fuse-dropdown-item>
        </fuse-dropdown>
      </div>
    `,
  }),
};
