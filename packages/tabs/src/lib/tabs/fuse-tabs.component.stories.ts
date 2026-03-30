import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseTabsComponent } from './fuse-tabs.component';
import { FuseTabComponent } from './fuse-tab.component';

const meta: Meta<FuseTabsComponent> = {
  title: 'Fuse / Tabs',
  component: FuseTabsComponent,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideAnimations()] })],
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'pills', 'boxed'],
      description: 'Visual style of the tab list',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
    activeTab: {
      control: 'text',
      description: 'tabId of the initially active tab',
    },
    tabChange: { action: 'tabChange' },
  },
};

export default meta;
type Story = StoryObj<FuseTabsComponent>;

// ─── Default (line) ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: { variant: 'line', size: 'md' },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [FuseTabsComponent, FuseTabComponent] },
    template: `
      <fuse-tabs [variant]="variant" [size]="size" (tabChange)="tabChange($event)">
        <fuse-tab tabId="overview" label="Overview">
          <p style="color:var(--fuse-color-text-primary);padding:8px 0">
            Overview content — project summary and key metrics.
          </p>
        </fuse-tab>
        <fuse-tab tabId="analytics" label="Analytics">
          <p style="color:var(--fuse-color-text-primary);padding:8px 0">
            Analytics content — charts and trends.
          </p>
        </fuse-tab>
        <fuse-tab tabId="settings" label="Settings">
          <p style="color:var(--fuse-color-text-primary);padding:8px 0">
            Settings content — configuration options.
          </p>
        </fuse-tab>
      </fuse-tabs>
    `,
  }),
};

// ─── Pills ────────────────────────────────────────────────────────────────────

export const Pills: Story = {
  args: { variant: 'pills', size: 'md' },
  render: () => ({
    moduleMetadata: { imports: [FuseTabsComponent, FuseTabComponent] },
    template: `
      <fuse-tabs variant="pills">
        <fuse-tab tabId="all"     label="All">All items</fuse-tab>
        <fuse-tab tabId="active"  label="Active">Active items</fuse-tab>
        <fuse-tab tabId="closed"  label="Closed">Closed items</fuse-tab>
      </fuse-tabs>
    `,
  }),
};

// ─── Boxed / segmented ────────────────────────────────────────────────────────

export const Boxed: Story = {
  args: { variant: 'boxed', size: 'md' },
  render: () => ({
    moduleMetadata: { imports: [FuseTabsComponent, FuseTabComponent] },
    template: `
      <div style="width:360px">
        <fuse-tabs variant="boxed">
          <fuse-tab tabId="monthly"  label="Monthly">Monthly view</fuse-tab>
          <fuse-tab tabId="yearly"   label="Yearly">Yearly view</fuse-tab>
          <fuse-tab tabId="all-time" label="All time">All time view</fuse-tab>
        </fuse-tabs>
      </div>
    `,
  }),
};

// ─── With badges ─────────────────────────────────────────────────────────────

export const WithBadge: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseTabsComponent, FuseTabComponent] },
    template: `
      <fuse-tabs variant="line">
        <fuse-tab tabId="inbox"  label="Inbox"  badge="12">
          <p style="color:var(--fuse-color-text-primary);padding:8px 0">12 unread messages</p>
        </fuse-tab>
        <fuse-tab tabId="sent"   label="Sent">
          <p style="color:var(--fuse-color-text-primary);padding:8px 0">Sent messages</p>
        </fuse-tab>
        <fuse-tab tabId="drafts" label="Drafts" badge="3">
          <p style="color:var(--fuse-color-text-primary);padding:8px 0">3 drafts</p>
        </fuse-tab>
      </fuse-tabs>
    `,
  }),
};

// ─── Disabled tab ─────────────────────────────────────────────────────────────

export const DisabledTab: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseTabsComponent, FuseTabComponent] },
    template: `
      <fuse-tabs variant="line">
        <fuse-tab tabId="general"     label="General">General settings</fuse-tab>
        <fuse-tab tabId="security"    label="Security">Security settings</fuse-tab>
        <fuse-tab tabId="billing"     label="Billing" [disabled]="true">
          Billing (requires upgrade)
        </fuse-tab>
        <fuse-tab tabId="integrations" label="Integrations">Integrations</fuse-tab>
      </fuse-tabs>
    `,
  }),
};

// ─── Animated indicator ───────────────────────────────────────────────────────

export const AnimatedIndicator: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseTabsComponent, FuseTabComponent] },
    template: `
      <div style="display:flex;flex-direction:column;gap:32px">
        <div>
          <p style="color:var(--fuse-color-text-secondary);font-size:0.75rem;
                    margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">
            Spring indicator — click to see animation
          </p>
          <fuse-tabs variant="line">
            <fuse-tab tabId="d1" label="Dashboard">Dashboard content</fuse-tab>
            <fuse-tab tabId="d2" label="Reports">Reports content</fuse-tab>
            <fuse-tab tabId="d3" label="Explore">Explore content</fuse-tab>
            <fuse-tab tabId="d4" label="Notifications">Notifications</fuse-tab>
          </fuse-tabs>
        </div>
        <div>
          <p style="color:var(--fuse-color-text-secondary);font-size:0.75rem;
                    margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">
            Small size
          </p>
          <fuse-tabs variant="line" size="sm">
            <fuse-tab tabId="s1" label="Overview">Overview</fuse-tab>
            <fuse-tab tabId="s2" label="Activity">Activity</fuse-tab>
            <fuse-tab tabId="s3" label="Settings">Settings</fuse-tab>
          </fuse-tabs>
        </div>
      </div>
    `,
  }),
};
