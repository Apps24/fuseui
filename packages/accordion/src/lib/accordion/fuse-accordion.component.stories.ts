import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FuseAccordionComponent } from './fuse-accordion.component';
import { FuseAccordionItemComponent } from './fuse-accordion-item.component';

const meta: Meta<FuseAccordionComponent> = {
  title: 'Fuse / Accordion',
  component: FuseAccordionComponent,
  tags: ['autodocs'],
  decorators: [applicationConfig({ providers: [provideAnimations()] })],
  argTypes: {
    multiple: { control: 'boolean', description: 'Allow multiple items open at once' },
  },
};

export default meta;
type Story = StoryObj<FuseAccordionComponent>;

// ─── Default (single) ─────────────────────────────────────────────────────────

export const Default: Story = {
  args: { multiple: false },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [FuseAccordionComponent, FuseAccordionItemComponent] },
    template: `
      <div style="width:480px">
        <fuse-accordion [multiple]="multiple">
          <fuse-accordion-item itemId="q1" title="What is Fuse UI?">
            Fuse UI is an Angular 18+ component library built on top of design tokens
            and fluid animation principles.
          </fuse-accordion-item>
          <fuse-accordion-item itemId="q2" title="Does it support Ionic?">
            Yes — all components include :host-context(.ios) and :host-context(.md) blocks
            and bridge tokens to Ionic's CSS variable system.
          </fuse-accordion-item>
          <fuse-accordion-item itemId="q3" title="Can I theme it?">
            Fuse UI ships four built-in themes (light, dark, ocean, rose) and supports
            consumer-defined themes via data-theme on :root.
          </fuse-accordion-item>
        </fuse-accordion>
      </div>
    `,
  }),
};

// ─── Multiple open ────────────────────────────────────────────────────────────

export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [FuseAccordionComponent, FuseAccordionItemComponent] },
    template: `
      <div style="width:480px">
        <fuse-accordion [multiple]="multiple">
          <fuse-accordion-item itemId="s1" title="Getting started">
            Install via pnpm: <code>pnpm add @fuse/core @fuse/button</code>
          </fuse-accordion-item>
          <fuse-accordion-item itemId="s2" title="Theming">
            Import the generated <code>variables.css</code> and set
            <code>data-theme</code> on your root element.
          </fuse-accordion-item>
          <fuse-accordion-item itemId="s3" title="Animations">
            Use <code>FuseAnimationService.addEnterState()</code> to apply
            spring-based enter animations to any element.
          </fuse-accordion-item>
        </fuse-accordion>
      </div>
    `,
  }),
};

// ─── With disabled item ───────────────────────────────────────────────────────

export const WithDisabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseAccordionComponent, FuseAccordionItemComponent] },
    template: `
      <div style="width:480px">
        <fuse-accordion>
          <fuse-accordion-item itemId="p1" title="Available feature">
            This feature is available in all plans.
          </fuse-accordion-item>
          <fuse-accordion-item itemId="p2" title="Pro feature (locked)" [disabled]="true">
            Upgrade to Pro to access this feature.
          </fuse-accordion-item>
          <fuse-accordion-item itemId="p3" title="Another available feature">
            Also available in all plans.
          </fuse-accordion-item>
        </fuse-accordion>
      </div>
    `,
  }),
};

// ─── Smooth animation ─────────────────────────────────────────────────────────

export const SmoothAnimation: Story = {
  render: () => ({
    moduleMetadata: { imports: [FuseAccordionComponent, FuseAccordionItemComponent] },
    template: `
      <div style="width:480px;display:flex;flex-direction:column;gap:24px">
        <p style="color:var(--fuse-color-text-secondary);font-size:0.875rem;margin:0">
          CSS grid expand trick — no max-height, smooth at any content size
        </p>
        <fuse-accordion>
          <fuse-accordion-item itemId="x1" title="Short content">
            Just a brief line.
          </fuse-accordion-item>
          <fuse-accordion-item itemId="x2" title="Long content">
            <p>Paragraph one with quite a bit of text to demonstrate that the animation
            works correctly regardless of content height.</p>
            <p>Paragraph two with even more text. The grid-template-rows trick means
            the animation duration is constant regardless of how tall the content is,
            unlike the max-height hack which accelerates when the content is short.</p>
            <p>Paragraph three for good measure.</p>
          </fuse-accordion-item>
          <fuse-accordion-item itemId="x3" title="Medium content">
            <ul style="margin:0;padding-left:1.25rem">
              <li>Item one</li>
              <li>Item two</li>
              <li>Item three</li>
            </ul>
          </fuse-accordion-item>
        </fuse-accordion>
      </div>
    `,
  }),
};
