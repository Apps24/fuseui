import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseEmptyStateComponent } from './fuse-empty-state.component';

const meta: Meta<FuseEmptyStateComponent> = {
  title: 'Fuse / EmptyState',
  decorators: [moduleMetadata({ imports: [FuseEmptyStateComponent] })],
  tags: ['autodocs'],
  argTypes: {
    icon:          { control: 'text' },
    title:         { control: 'text' },
    description:   { control: 'text' },
    actionLabel:   { control: 'text' },
    actionVariant: { control: 'select', options: ['solid', 'outline'] },
  },
};
export default meta;
type Story = StoryObj<FuseEmptyStateComponent>;

export const Default: Story = {
  args: {
    icon:        'inbox',
    title:       'No messages',
    description: 'Your inbox is empty. When you receive messages they will appear here.',
    actionLabel: 'Compose',
    actionVariant: 'outline',
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="max-width:480px;padding:32px;border:1px dashed #e5e7eb;border-radius:12px">
        <fuse-empty-state
          [icon]="icon"
          [title]="title"
          [description]="description"
          [actionLabel]="actionLabel"
          [actionVariant]="actionVariant">
        </fuse-empty-state>
      </div>
    `,
  }),
};

export const NoAction: Story = {
  args: {
    icon:        'search',
    title:       'No results found',
    description: 'Try adjusting your search or filter to find what you are looking for.',
  },
  render: Default.render,
};

export const WithIllustration: Story = {
  render: () => ({
    props: { title: 'Nothing here yet', description: 'Add your first item to get started.' },
    template: `
      <div style="max-width:480px;padding:32px;border:1px dashed #e5e7eb;border-radius:12px">
        <fuse-empty-state
          [title]="title"
          [description]="description">
          <div fuseEmptyStateIllustration style="width:80px;height:80px;background:var(--fuse-color-surface-raised,#f3f4f6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem">
            📭
          </div>
        </fuse-empty-state>
      </div>
    `,
  }),
};
