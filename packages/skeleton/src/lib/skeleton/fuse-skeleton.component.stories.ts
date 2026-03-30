import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseSkeletonComponent } from './fuse-skeleton.component';

const meta: Meta<FuseSkeletonComponent> = {
  title: 'Fuse / Skeleton',
  component: FuseSkeletonComponent,
  decorators: [moduleMetadata({ imports: [FuseSkeletonComponent] })],
  args: {
    variant: 'rect',
    width: '100%',
    height: '1rem',
    lines: 1,
  },
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect'] },
    width:   { control: 'text' },
    height:  { control: 'text' },
    lines:   { control: 'number' },
  },
};
export default meta;

type Story = StoryObj<FuseSkeletonComponent>;

// ─── Default (rect) ───────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fuse-skeleton [variant]="variant" [width]="width" [height]="height" [lines]="lines"
                     style="max-width:360px; display:block;">
      </fuse-skeleton>
    `,
  }),
};

// ─── Text multi-line ─────────────────────────────────────────────────────────

export const TextMultiLine: Story = {
  render: () => ({
    template: `
      <fuse-skeleton variant="text" height="0.85rem" [lines]="4"
                     style="max-width:360px; display:block;">
      </fuse-skeleton>
    `,
  }),
};

// ─── Circle ──────────────────────────────────────────────────────────────────

export const Circle: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <fuse-skeleton variant="circle" height="32px"></fuse-skeleton>
        <fuse-skeleton variant="circle" height="48px"></fuse-skeleton>
        <fuse-skeleton variant="circle" height="64px"></fuse-skeleton>
      </div>
    `,
  }),
};

// ─── Custom dimensions ────────────────────────────────────────────────────────

export const CustomDimensions: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:400px;">
        <fuse-skeleton variant="rect" width="100%" height="180px"></fuse-skeleton>
        <fuse-skeleton variant="text" width="60%" height="1rem"></fuse-skeleton>
        <fuse-skeleton variant="text" width="40%" height="0.875rem"></fuse-skeleton>
      </div>
    `,
  }),
};

// ─── Card skeleton ────────────────────────────────────────────────────────────

export const CardSkeleton: Story = {
  render: () => ({
    template: `
      <div style="max-width:360px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
        <!-- Hero image -->
        <fuse-skeleton variant="rect" width="100%" height="160px"
                       style="display:block; border-radius:0;"></fuse-skeleton>

        <div style="padding:16px; display:flex; flex-direction:column; gap:12px;">
          <!-- Avatar + name row -->
          <div style="display:flex; align-items:center; gap:12px;">
            <fuse-skeleton variant="circle" height="40px"></fuse-skeleton>
            <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
              <fuse-skeleton variant="text" width="50%" height="0.875rem"></fuse-skeleton>
              <fuse-skeleton variant="text" width="35%" height="0.75rem"></fuse-skeleton>
            </div>
          </div>

          <!-- Body text -->
          <fuse-skeleton variant="text" height="0.875rem" [lines]="3"></fuse-skeleton>
        </div>
      </div>
    `,
  }),
};
