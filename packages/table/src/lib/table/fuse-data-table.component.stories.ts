import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseDataTableComponent, FuseColumnDef } from './fuse-data-table.component';
import { FuseEmptyStateComponent } from '@fuse_ui/empty-state';

const meta: Meta<FuseDataTableComponent> = {
  title: 'Fuse / DataTable',
  decorators: [moduleMetadata({ imports: [FuseDataTableComponent, FuseEmptyStateComponent] })],
  tags: ['autodocs'],
  argTypes: {
    sortable:     { control: 'boolean' },
    loading:      { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<FuseDataTableComponent>;

const COLUMNS: FuseColumnDef[] = [
  { key: 'id',    label: 'ID',         sortable: true  },
  { key: 'name',  label: 'Name',       sortable: true  },
  { key: 'email', label: 'Email',      sortable: false },
  { key: 'role',  label: 'Role',       sortable: true  },
];

const DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin'   },
  { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   role: 'Editor'  },
  { id: 3, name: 'Carol White',   email: 'carol@example.com', role: 'Viewer'  },
  { id: 4, name: 'David Brown',   email: 'david@example.com', role: 'Editor'  },
  { id: 5, name: 'Eva Green',     email: 'eva@example.com',   role: 'Admin'   },
];

export const Default: Story = {
  args: { sortable: true, loading: false, stickyHeader: true },
  render: (args) => ({
    props: { ...args, data: DATA, columns: COLUMNS },
    template: `
      <div style="max-width:800px">
        <fuse-data-table
          [data]="data"
          [columns]="columns"
          [sortable]="sortable"
          [loading]="loading"
          [stickyHeader]="stickyHeader">
        </fuse-data-table>
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: { sortable: false, loading: true, stickyHeader: false },
  render: (args) => ({
    props: { ...args, data: [], columns: COLUMNS },
    template: `
      <div style="max-width:800px">
        <fuse-data-table
          [data]="data"
          [columns]="columns"
          [loading]="loading">
        </fuse-data-table>
      </div>
    `,
  }),
};

export const Empty: Story = {
  args: { sortable: false, loading: false, stickyHeader: false },
  render: (args) => ({
    props: { ...args, data: [], columns: COLUMNS },
    template: `
      <div style="max-width:800px">
        <fuse-data-table [data]="data" [columns]="columns">
          <fuse-empty-state
            fuseEmptyState
            icon="table-cells"
            title="No records found"
            description="Try adjusting your filters or add a new entry."
            actionLabel="Add entry">
          </fuse-empty-state>
        </fuse-data-table>
      </div>
    `,
  }),
};
