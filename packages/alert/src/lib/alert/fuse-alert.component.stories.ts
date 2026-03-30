import { Meta, StoryObj } from '@storybook/angular';
import { FuseAlertComponent } from './fuse-alert.component';

const meta: Meta<FuseAlertComponent> = {
  title: 'Fuse / Alert',
  component: FuseAlertComponent,
  args: {
    type: 'info',
    title: '',
    closable: false,
    variant: 'soft',
  },
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    variant: { control: 'select', options: ['soft', 'solid'] },
    closable: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<FuseAlertComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fuse-alert [type]="type" [title]="title" [closable]="closable" [variant]="variant">
        This is an informational alert. Check it out!
      </fuse-alert>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:480px;">
        <fuse-alert type="info">    This is an <b>info</b> alert.    </fuse-alert>
        <fuse-alert type="success"> This is a <b>success</b> alert.  </fuse-alert>
        <fuse-alert type="warning"> This is a <b>warning</b> alert.  </fuse-alert>
        <fuse-alert type="error">   This is an <b>error</b> alert.   </fuse-alert>
      </div>
    `,
  }),
};

export const WithTitle: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:480px;">
        <fuse-alert type="success" title="Changes saved">Your profile has been updated successfully.</fuse-alert>
        <fuse-alert type="error"   title="Upload failed">The file exceeds the 5 MB size limit.</fuse-alert>
      </div>
    `,
  }),
};

export const Closable: Story = {
  render: () => ({
    template: `
      <fuse-alert type="warning" title="Heads up" [closable]="true" style="max-width:480px; display:block;">
        This alert can be dismissed by clicking the × button.
      </fuse-alert>
    `,
  }),
};

export const SolidVariant: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:480px;">
        <fuse-alert type="info"    variant="solid">Solid info alert.</fuse-alert>
        <fuse-alert type="success" variant="solid">Solid success alert.</fuse-alert>
        <fuse-alert type="warning" variant="solid">Solid warning alert.</fuse-alert>
        <fuse-alert type="error"   variant="solid">Solid error alert.</fuse-alert>
      </div>
    `,
  }),
};
