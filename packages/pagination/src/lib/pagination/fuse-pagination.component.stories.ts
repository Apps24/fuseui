import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FusePaginationComponent } from './fuse-pagination.component';

const meta: Meta<FusePaginationComponent> = {
  title: 'Fuse / Pagination',
  decorators: [moduleMetadata({ imports: [FusePaginationComponent] })],
  tags: ['autodocs'],
  argTypes: {
    total:        { control: { type: 'number', min: 0 } },
    pageSize:     { control: { type: 'number', min: 1 } },
    currentPage:  { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
  },
};
export default meta;
type Story = StoryObj<FusePaginationComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { total: 100, pageSize: 10, currentPage: 1, siblingCount: 1 },
  render: (args) => ({
    props: args,
    template: `
      <fuse-pagination
        [total]="total"
        [pageSize]="pageSize"
        [(currentPage)]="currentPage"
        [siblingCount]="siblingCount">
      </fuse-pagination>
    `,
  }),
};

// ─── Middle page ──────────────────────────────────────────────────────────────

export const MiddlePage: Story = {
  args: { total: 100, pageSize: 10, currentPage: 5, siblingCount: 1 },
  render: Default.render,
};

// ─── Last page ────────────────────────────────────────────────────────────────

export const LastPage: Story = {
  args: { total: 100, pageSize: 10, currentPage: 10, siblingCount: 1 },
  render: Default.render,
};

// ─── Wider siblings ───────────────────────────────────────────────────────────

export const WideSiblings: Story = {
  args: { total: 200, pageSize: 10, currentPage: 10, siblingCount: 2 },
  render: Default.render,
};

// ─── Small list ───────────────────────────────────────────────────────────────

export const SmallList: Story = {
  args: { total: 30, pageSize: 10, currentPage: 2, siblingCount: 1 },
  render: Default.render,
};
