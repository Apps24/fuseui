import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { FuseCheckboxComponent } from './fuse-checkbox.component';
import { FuseCheckboxGroupComponent } from '../checkbox-group/fuse-checkbox-group.component';
import { FuseRadioComponent } from '../radio/fuse-radio.component';
import { FuseRadioGroupComponent } from '../radio-group/fuse-radio-group.component';

const meta: Meta<FuseCheckboxComponent> = {
  title: 'Fuse / Checkbox',
  component: FuseCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FuseCheckboxComponent,
        FuseCheckboxGroupComponent,
        FuseRadioComponent,
        FuseRadioGroupComponent,
        ReactiveFormsModule,
        JsonPipe,
      ],
    }),
  ],
  args: {
    label: 'Accept terms and conditions',
    size: 'md',
    disabled: false,
    indeterminate: false,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<FuseCheckboxComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fuse-checkbox
        [label]="label"
        [size]="size"
        [disabled]="disabled"
        [indeterminate]="indeterminate"
      ></fuse-checkbox>
    `,
  }),
};

// ─── All sizes ───────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <fuse-checkbox size="sm" label="Small checkbox"></fuse-checkbox>
        <fuse-checkbox size="md" label="Medium checkbox"></fuse-checkbox>
        <fuse-checkbox size="lg" label="Large checkbox"></fuse-checkbox>
      </div>
    `,
  }),
};

// ─── Indeterminate ───────────────────────────────────────────────────────────

export const Indeterminate: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <fuse-checkbox label="Unchecked"></fuse-checkbox>
        <fuse-checkbox [indeterminate]="true" label="Indeterminate"></fuse-checkbox>
        <fuse-checkbox label="Checked (will be checked via writeValue)"></fuse-checkbox>
      </div>
    `,
  }),
};

// ─── Disabled ────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <fuse-checkbox [disabled]="true" label="Disabled unchecked"></fuse-checkbox>
      </div>
    `,
  }),
};

// ─── CheckboxGroup ───────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseCheckboxGroupComponent, FuseCheckboxComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <div style="display:flex; flex-direction:column; gap:24px;">
      <div>
        <p style="margin:0 0 8px; font-weight:600;">Vertical (default)</p>
        <fuse-checkbox-group [formControl]="fruitCtrl">
          <fuse-checkbox value="apple"  label="Apple"></fuse-checkbox>
          <fuse-checkbox value="banana" label="Banana"></fuse-checkbox>
          <fuse-checkbox value="cherry" label="Cherry"></fuse-checkbox>
        </fuse-checkbox-group>
      </div>

      <div>
        <p style="margin:0 0 8px; font-weight:600;">Horizontal</p>
        <fuse-checkbox-group [formControl]="colorCtrl" orientation="horizontal">
          <fuse-checkbox value="red"   label="Red"></fuse-checkbox>
          <fuse-checkbox value="green" label="Green"></fuse-checkbox>
          <fuse-checkbox value="blue"  label="Blue"></fuse-checkbox>
        </fuse-checkbox-group>
      </div>

      <pre style="font-size:12px;">Fruits: {{ fruitCtrl.value | json }}</pre>
      <pre style="font-size:12px;">Colors: {{ colorCtrl.value | json }}</pre>
    </div>
  `,
})
class CheckboxGroupStoryComponent {
  fruitCtrl = new FormControl<string[]>(['apple']);
  colorCtrl = new FormControl<string[]>([]);
}

export const CheckboxGroup: StoryObj = {
  render: () => ({ component: CheckboxGroupStoryComponent }),
};

// ─── RadioGroup ──────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseRadioGroupComponent, FuseRadioComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <div style="display:flex; flex-direction:column; gap:24px;">
      <div>
        <p style="margin:0 0 8px; font-weight:600;">Vertical (default)</p>
        <fuse-radio-group [formControl]="sizeCtrl">
          <fuse-radio value="sm" label="Small"></fuse-radio>
          <fuse-radio value="md" label="Medium"></fuse-radio>
          <fuse-radio value="lg" label="Large"></fuse-radio>
        </fuse-radio-group>
      </div>

      <div>
        <p style="margin:0 0 8px; font-weight:600;">Horizontal</p>
        <fuse-radio-group [formControl]="colorCtrl" orientation="horizontal">
          <fuse-radio value="red"   label="Red"></fuse-radio>
          <fuse-radio value="green" label="Green"></fuse-radio>
          <fuse-radio value="blue"  label="Blue"></fuse-radio>
        </fuse-radio-group>
      </div>

      <pre style="font-size:12px;">Size: {{ sizeCtrl.value | json }}</pre>
      <pre style="font-size:12px;">Color: {{ colorCtrl.value | json }}</pre>
    </div>
  `,
})
class RadioGroupStoryComponent {
  sizeCtrl = new FormControl('md');
  colorCtrl = new FormControl<string | null>(null);
}

export const RadioGroup: StoryObj = {
  render: () => ({ component: RadioGroupStoryComponent }),
};

// ─── RadioGroup — disabled ────────────────────────────────────────────────────

export const RadioGroupDisabled: StoryObj = {
  render: () => ({
    template: `
      <fuse-radio-group [disabled]="true">
        <fuse-radio value="a" label="Option A"></fuse-radio>
        <fuse-radio value="b" label="Option B"></fuse-radio>
        <fuse-radio value="c" label="Option C"></fuse-radio>
      </fuse-radio-group>
    `,
  }),
};

// ─── ReactiveForm (full form) ─────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FuseCheckboxGroupComponent, FuseCheckboxComponent, FuseRadioGroupComponent, FuseRadioComponent, ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" style="display:flex; flex-direction:column; gap:20px; max-width:360px;">
      <div>
        <p style="margin:0 0 8px; font-weight:600;">Notifications</p>
        <fuse-checkbox-group formControlName="notifications">
          <fuse-checkbox value="email"   label="Email"></fuse-checkbox>
          <fuse-checkbox value="sms"     label="SMS"></fuse-checkbox>
          <fuse-checkbox value="push"    label="Push notifications"></fuse-checkbox>
        </fuse-checkbox-group>
      </div>

      <div>
        <p style="margin:0 0 8px; font-weight:600;">Plan</p>
        <fuse-radio-group formControlName="plan">
          <fuse-radio value="free"    label="Free"></fuse-radio>
          <fuse-radio value="pro"     label="Pro"></fuse-radio>
          <fuse-radio value="enterprise" label="Enterprise"></fuse-radio>
        </fuse-radio-group>
      </div>

      <fuse-checkbox formControlName="terms" label="I agree to the terms"></fuse-checkbox>

      <pre style="font-size:12px;">{{ form.value | json }}</pre>
    </form>
  `,
})
class ReactiveFormStoryComponent {
  form = new FormGroup({
    notifications: new FormControl<string[]>(['email']),
    plan: new FormControl('free'),
    terms: new FormControl(false),
  });
}

export const ReactiveForm: StoryObj = {
  render: () => ({ component: ReactiveFormStoryComponent }),
};
