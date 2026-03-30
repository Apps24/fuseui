import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseFormFieldComponent } from './fuse-form-field.component';
import { FuseInputComponent } from '@fuse/input';

const meta: Meta<FuseFormFieldComponent> = {
  title: 'Fuse / FormField',
  decorators: [moduleMetadata({ imports: [FuseFormFieldComponent, FuseInputComponent] })],
  tags: ['autodocs'],
  argTypes: {
    label:        { control: 'text' },
    required:     { control: 'boolean' },
    helperText:   { control: 'text' },
    errorMessage: { control: 'text' },
    hasError:     { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<FuseFormFieldComponent>;

export const Default: Story = {
  args: {
    label:      'Email address',
    helperText: "We'll never share your email.",
    hasError:   false,
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="max-width:360px;padding:32px">
        <fuse-form-field
          [label]="label"
          [required]="required"
          [helperText]="helperText"
          [errorMessage]="errorMessage"
          [hasError]="hasError">
          <fuse-input fuseControl placeholder="you@example.com"></fuse-input>
        </fuse-form-field>
      </div>
    `,
  }),
};

export const WithError: Story = {
  args: {
    label:        'Email address',
    required:     true,
    errorMessage: 'Please enter a valid email address.',
    hasError:     true,
  },
  render: Default.render,
};

export const Required: Story = {
  args: {
    label:      'Full name',
    required:   true,
    helperText: 'As it appears on your ID.',
    hasError:   false,
  },
  render: Default.render,
};
