import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FuseSliderComponent } from './fuse-slider.component';

const meta: Meta<FuseSliderComponent> = {
  title: 'Fuse / Slider',
  decorators: [moduleMetadata({ imports: [FuseSliderComponent] })],
  tags: ['autodocs'],
  argTypes: {
    min:         { control: { type: 'number' } },
    max:         { control: { type: 'number' } },
    step:        { control: { type: 'number', min: 0.1 } },
    range:       { control: 'boolean' },
    showTooltip: { control: 'select', options: ['always', 'hover', 'never'] },
    showMarks:   { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<FuseSliderComponent>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { min: 0, max: 100, step: 1, value: 40, showTooltip: 'hover' },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="padding:32px 48px;max-width:400px">
        <fuse-slider
          [min]="min"
          [max]="max"
          [step]="step"
          [(value)]="value"
          [showTooltip]="showTooltip">
        </fuse-slider>
        <p style="margin-top:8px;font-size:0.875rem;color:var(--fuse-color-text-secondary)">Value: {{ value }}</p>
      </div>
    `,
  }),
};

// ─── Always-visible tooltip ───────────────────────────────────────────────────

export const AlwaysTooltip: Story = {
  args: { min: 0, max: 100, step: 1, value: 60, showTooltip: 'always' },
  render: Default.render,
};

// ─── Range slider ─────────────────────────────────────────────────────────────

export const RangeSlider: Story = {
  render: () => ({
    props: { value: [20, 75] },
    template: `
      <div style="padding:32px 48px;max-width:400px">
        <fuse-slider
          [min]="0"
          [max]="100"
          [range]="true"
          [showTooltip]="'always'"
          [(value)]="value">
        </fuse-slider>
        <p style="margin-top:8px;font-size:0.875rem;color:var(--fuse-color-text-secondary)">
          Range: {{ value[0] }} – {{ value[1] }}
        </p>
      </div>
    `,
  }),
};

// ─── With marks ──────────────────────────────────────────────────────────────

export const WithMarks: Story = {
  render: () => ({
    props: {
      value: 50,
      marks: [
        { value: 0,   label: '0°C' },
        { value: 25,  label: '25°C' },
        { value: 50,  label: '50°C' },
        { value: 75,  label: '75°C' },
        { value: 100, label: '100°C' },
      ],
    },
    template: `
      <div style="padding:32px 48px 56px;max-width:500px">
        <fuse-slider
          [min]="0"
          [max]="100"
          [step]="25"
          [showMarks]="true"
          [marks]="marks"
          [showTooltip]="'hover'"
          [(value)]="value">
        </fuse-slider>
      </div>
    `,
  }),
};

// ─── Step=0.5 ────────────────────────────────────────────────────────────────

export const DecimalStep: Story = {
  args: { min: 0, max: 5, step: 0.5, value: 2.5, showTooltip: 'always' },
  render: Default.render,
};

// ─── Custom range ─────────────────────────────────────────────────────────────

export const CustomRange: Story = {
  args: { min: -50, max: 50, step: 5, value: 0, showTooltip: 'always' },
  render: Default.render,
};
