import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseBreadcrumbComponent, FuseBreadcrumbItem } from './fuse-breadcrumb.component';

const meta: Meta<FuseBreadcrumbComponent> = {
  title: 'Fuse / Breadcrumb',
  decorators: [moduleMetadata({ imports: [FuseBreadcrumbComponent] })],
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'select', options: ['/', '>', '·'] },
    maxVisible: { control: { type: 'number', min: 2, max: 10 } },
  },
};
export default meta;
type Story = StoryObj<FuseBreadcrumbComponent>;

const ITEMS_SHORT: FuseBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Sneakers' },
];

const ITEMS_LONG: FuseBreadcrumbItem[] = [
  { label: 'Home',       href: '/' },
  { label: 'Apparel',    href: '/apparel' },
  { label: 'Men',        href: '/apparel/men' },
  { label: 'Footwear',   href: '/apparel/men/footwear' },
  { label: 'Sneakers',   href: '/apparel/men/footwear/sneakers' },
  { label: 'Air Max 90' },
];

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { items: ITEMS_SHORT, separator: '/', maxVisible: 4 },
  render: (args) => ({
    props: args,
    template: `<fuse-breadcrumb [items]="items" [separator]="separator" [maxVisible]="maxVisible"></fuse-breadcrumb>`,
  }),
};

// ─── Long — with ellipsis ─────────────────────────────────────────────────────

export const LongWithEllipsis: Story = {
  args: { items: ITEMS_LONG, separator: '/', maxVisible: 4 },
  render: (args) => ({
    props: args,
    template: `<fuse-breadcrumb [items]="items" [separator]="separator" [maxVisible]="maxVisible"></fuse-breadcrumb>`,
  }),
};

// ─── Chevron separator ────────────────────────────────────────────────────────

export const ChevronSeparator: Story = {
  args: { items: ITEMS_SHORT, separator: '>', maxVisible: 4 },
  render: (args) => ({
    props: args,
    template: `<fuse-breadcrumb [items]="items" [separator]="separator" [maxVisible]="maxVisible"></fuse-breadcrumb>`,
  }),
};

// ─── Dot separator ────────────────────────────────────────────────────────────

export const DotSeparator: Story = {
  args: { items: ITEMS_SHORT, separator: '·', maxVisible: 4 },
  render: (args) => ({
    props: args,
    template: `<fuse-breadcrumb [items]="items" [separator]="separator" [maxVisible]="maxVisible"></fuse-breadcrumb>`,
  }),
};
