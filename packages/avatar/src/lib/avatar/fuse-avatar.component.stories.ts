import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseAvatarComponent } from './fuse-avatar.component';

const meta: Meta<FuseAvatarComponent> = {
  title: 'Fuse / Avatar',
  component: FuseAvatarComponent,
  decorators: [moduleMetadata({ imports: [FuseAvatarComponent] })],
  args: {
    src: '',
    alt: '',
    name: 'Jane Doe',
    size: 'md',
    shape: 'circle',
    status: null,
  },
  argTypes: {
    size:   { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape:  { control: 'select', options: ['circle', 'square'] },
    status: { control: 'select', options: [null, 'online', 'offline', 'busy', 'away'] },
  },
};
export default meta;

type Story = StoryObj<FuseAvatarComponent>;

// ─── Default (initials) ───────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fuse-avatar [src]="src" [alt]="alt" [name]="name"
                   [size]="size" [shape]="shape" [status]="status">
      </fuse-avatar>
    `,
  }),
};

// ─── With image ───────────────────────────────────────────────────────────────

export const WithImage: Story = {
  render: () => ({
    template: `
      <fuse-avatar
        src="https://i.pravatar.cc/150?img=47"
        alt="Random avatar"
        name="Jane Doe"
        size="lg"
      ></fuse-avatar>
    `,
  }),
};

// ─── Initials ────────────────────────────────────────────────────────────────

export const Initials: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <fuse-avatar name="Alice"></fuse-avatar>
        <fuse-avatar name="Bob Builder"></fuse-avatar>
        <fuse-avatar name="Charlie D. Nguyen"></fuse-avatar>
      </div>
    `,
  }),
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <fuse-avatar name="XS" size="xs"></fuse-avatar>
        <fuse-avatar name="SM" size="sm"></fuse-avatar>
        <fuse-avatar name="MD" size="md"></fuse-avatar>
        <fuse-avatar name="LG" size="lg"></fuse-avatar>
        <fuse-avatar name="XL" size="xl"></fuse-avatar>
      </div>
    `,
  }),
};

// ─── Shapes ──────────────────────────────────────────────────────────────────

export const AllShapes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:16px; align-items:center;">
        <fuse-avatar name="Jane Doe" shape="circle" size="lg"></fuse-avatar>
        <fuse-avatar name="Jane Doe" shape="square" size="lg"></fuse-avatar>
      </div>
    `,
  }),
};

// ─── With status ─────────────────────────────────────────────────────────────

export const WithStatus: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:16px; align-items:center;">
        <fuse-avatar name="Online"  status="online"  size="lg"></fuse-avatar>
        <fuse-avatar name="Away"    status="away"    size="lg"></fuse-avatar>
        <fuse-avatar name="Busy"    status="busy"    size="lg"></fuse-avatar>
        <fuse-avatar name="Offline" status="offline" size="lg"></fuse-avatar>
      </div>
    `,
  }),
};

// ─── Image error fallback ─────────────────────────────────────────────────────

export const ImageErrorFallback: Story = {
  render: () => ({
    template: `
      <fuse-avatar
        src="https://example.invalid/404.jpg"
        name="Fallback User"
        size="lg"
      ></fuse-avatar>
    `,
  }),
};
