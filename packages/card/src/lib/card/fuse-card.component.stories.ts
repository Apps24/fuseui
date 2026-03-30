import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseCardComponent } from './fuse-card.component';

const meta: Meta<FuseCardComponent> = {
  title: 'Fuse / Card',
  component: FuseCardComponent,
  decorators: [moduleMetadata({ imports: [FuseCardComponent] })],
  args: {
    variant: 'elevated',
    padding: 'md',
    clickable: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['flat', 'elevated', 'outlined'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    clickable: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<FuseCardComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fuse-card [variant]="variant" [padding]="padding" [clickable]="clickable"
                 style="max-width:360px;">
        <div fuseCardBody>
          <p style="margin:0;">This is a card with default elevated variant.</p>
        </div>
      </fuse-card>
    `,
  }),
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:20px; flex-wrap:wrap;">
        <fuse-card variant="elevated" style="flex:1; min-width:200px;">
          <div fuseCardBody><p style="margin:0;"><strong>Elevated</strong><br/>Default shadow.</p></div>
        </fuse-card>
        <fuse-card variant="flat" style="flex:1; min-width:200px;">
          <div fuseCardBody><p style="margin:0;"><strong>Flat</strong><br/>Muted background.</p></div>
        </fuse-card>
        <fuse-card variant="outlined" style="flex:1; min-width:200px;">
          <div fuseCardBody><p style="margin:0;"><strong>Outlined</strong><br/>Border only.</p></div>
        </fuse-card>
      </div>
    `,
  }),
};

// ─── With all slots ───────────────────────────────────────────────────────────

export const WithAllSlots: Story = {
  render: () => ({
    template: `
      <fuse-card style="max-width:360px;">
        <div fuseCardHeader>
          <strong>Card Header</strong>
        </div>
        <div fuseCardBody>
          <p style="margin:0;">
            This card uses all three named slots: header, body, and footer.
          </p>
        </div>
        <div fuseCardFooter style="display:flex; justify-content:flex-end; gap:8px;">
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      </fuse-card>
    `,
  }),
};

// ─── Clickable ────────────────────────────────────────────────────────────────

export const Clickable: Story = {
  render: () => ({
    template: `
      <fuse-card [clickable]="true" style="max-width:280px; cursor:pointer;">
        <div fuseCardBody>
          <p style="margin:0;">Hover me for the lift effect, click to trigger <code>cardClick</code>.</p>
        </div>
      </fuse-card>
    `,
  }),
};

// ─── All padding sizes ────────────────────────────────────────────────────────

export const AllPaddings: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:320px;">
        <fuse-card padding="none" variant="outlined">
          <div fuseCardBody>padding="none"</div>
        </fuse-card>
        <fuse-card padding="sm" variant="outlined">
          <div fuseCardBody>padding="sm"</div>
        </fuse-card>
        <fuse-card padding="md" variant="outlined">
          <div fuseCardBody>padding="md" (default)</div>
        </fuse-card>
        <fuse-card padding="lg" variant="outlined">
          <div fuseCardBody>padding="lg"</div>
        </fuse-card>
      </div>
    `,
  }),
};
