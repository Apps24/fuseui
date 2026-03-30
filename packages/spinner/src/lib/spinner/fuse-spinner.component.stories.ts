import { Meta, StoryObj } from '@storybook/angular';
import { FuseSpinnerComponent } from './fuse-spinner.component';

const meta: Meta<FuseSpinnerComponent> = {
  title: 'Fuse / Spinner',
  component: FuseSpinnerComponent,
  args: { size: 'md', color: '', overlay: false },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
    overlay: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<FuseSpinnerComponent>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:24px; align-items:center; padding:24px;">
        <fuse-spinner size="sm"></fuse-spinner>
        <fuse-spinner size="md"></fuse-spinner>
        <fuse-spinner size="lg"></fuse-spinner>
      </div>
    `,
  }),
};

export const CustomColor: Story = {
  args: { size: 'lg', color: '#10b981' },
};

export const WithOverlay: Story = {
  render: () => ({
    template: `
      <div style="position:relative; width:200px; height:120px; border:1px dashed #ccc; border-radius:8px; padding:16px;">
        <p>Content behind overlay</p>
        <fuse-spinner [overlay]="true" size="lg"></fuse-spinner>
      </div>
    `,
  }),
};
