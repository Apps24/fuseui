import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { FuseToastComponent } from './fuse-toast.component';
import { FuseToastService } from './fuse-toast.service';

// ─── Story meta ───────────────────────────────────────────────────────────────

const meta: Meta<FuseToastComponent> = {
  title: 'Fuse / Toast',
  component: FuseToastComponent,
  decorators: [
    applicationConfig({ providers: [FuseToastService] }),
    moduleMetadata({ imports: [FuseToastComponent] }),
  ],
  args: {
    message: 'Your changes have been saved.',
    type: 'info',
    action: null,
  },
  argTypes: {
    type: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
  },
};
export default meta;

type Story = StoryObj<FuseToastComponent>;

// ─── Static component previews ────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <fuse-toast [message]="message" [type]="type" style="max-width:420px; display:block;"></fuse-toast>
    `,
  }),
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:420px;">
        <fuse-toast type="info"    message="Your session expires in 5 minutes."></fuse-toast>
        <fuse-toast type="success" message="Profile updated successfully."></fuse-toast>
        <fuse-toast type="warning" message="Low disk space — consider clearing files."></fuse-toast>
        <fuse-toast type="error"   message="Failed to connect. Check your network."></fuse-toast>
      </div>
    `,
  }),
};

export const WithAction: Story = {
  render: () => ({
    props: { action: { label: 'Undo', callback: () => alert('Undo clicked') } },
    template: `
      <fuse-toast
        message="Message deleted."
        type="info"
        [action]="action"
        style="max-width:420px; display:block;"
      ></fuse-toast>
    `,
  }),
};

// ─── Live service demo ────────────────────────────────────────────────────────

@Component({
  standalone: true,
  template: `
    <div style="display:flex; flex-wrap:wrap; gap:10px; padding:16px;">
      <button (click)="showInfo()">Info</button>
      <button (click)="showSuccess()">Success</button>
      <button (click)="showWarning()">Warning</button>
      <button (click)="showError()">Error</button>
      <button (click)="showWithAction()">With Action</button>
      <button (click)="showBottomCenter()">Bottom Center</button>
      <button (click)="showPersistent()">Persistent (manual dismiss)</button>
    </div>
  `,
})
class ToastDemoComponent {
  private readonly toast = inject(FuseToastService);

  showInfo()    { this.toast.info('This is an informational message.'); }
  showSuccess() { this.toast.success('Your profile has been updated.'); }
  showWarning() { this.toast.warning('This action cannot be easily undone.'); }
  showError()   { this.toast.error('Failed to save. Please try again.'); }

  showWithAction(): void {
    this.toast.info('Message deleted.', {
      action: { label: 'Undo', callback: () => this.toast.success('Message restored!') },
    });
  }

  showBottomCenter(): void {
    this.toast.success('Sent from bottom-center!', { position: 'bottom-center' });
  }

  showPersistent(): void {
    const ref = this.toast.show('This toast stays until dismissed.', {
      type: 'warning',
      duration: 0,
      action: { label: 'Dismiss', callback: () => ref.dismiss() },
    });
  }
}

export const LiveDemo: StoryObj = {
  render: () => ({ component: ToastDemoComponent }),
};

// ─── All positions ────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  template: `
    <div style="display:flex; flex-wrap:wrap; gap:10px; padding:16px;">
      <button (click)="show('top-right')">Top Right (default)</button>
      <button (click)="show('top-left')">Top Left</button>
      <button (click)="show('top-center')">Top Center</button>
      <button (click)="show('bottom-right')">Bottom Right</button>
      <button (click)="show('bottom-left')">Bottom Left</button>
      <button (click)="show('bottom-center')">Bottom Center</button>
    </div>
  `,
})
class PositionsDemoComponent {
  private readonly toast = inject(FuseToastService);

  show(position: any): void {
    this.toast.info(`Showing from ${position}`, { position });
  }
}

export const AllPositions: StoryObj = {
  render: () => ({ component: PositionsDemoComponent }),
};
