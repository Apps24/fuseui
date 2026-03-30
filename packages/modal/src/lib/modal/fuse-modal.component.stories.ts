import { applicationConfig, type Meta, type StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FuseModalService } from './fuse-modal.service';
import { FUSE_MODAL_REF } from './fuse-modal.tokens';
import type { FuseModalRef } from './fuse-modal-ref';

// ── Example content component ─────────────────────────────────────────────────

@Component({
  selector: 'fuse-story-modal-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 style="margin: 0 0 12px">Modal Title</h2>
    <p style="margin: 0 0 24px; color: #6b7280;">
      This content is rendered dynamically inside the modal shell.
      You can put any standalone component here.
    </p>
    <div style="display: flex; gap: 8px; justify-content: flex-end;">
      <button (click)="close(false)" style="padding: 8px 16px; cursor: pointer;">
        Cancel
      </button>
      <button (click)="close(true)"
              style="padding: 8px 16px; background: #4f46e5; color: #fff; border: none;
                     border-radius: 6px; cursor: pointer;">
        Confirm
      </button>
    </div>
  `,
})
class StoryContentComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly modalRef = inject<FuseModalRef<any>>(FUSE_MODAL_REF);
  close(result: boolean) { this.modalRef.close(result); }
}

// ── Launcher ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'fuse-story-launcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 12px; padding: 24px;">
      <button *ngFor="let size of sizes"
              (click)="open(size)"
              style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px;
                     cursor: pointer; background: #fff;">
        Open {{ size }}
      </button>
      <button (click)="openNonDismissable()"
              style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px;
                     cursor: pointer; background: #fff;">
        Open (no dismiss)
      </button>
    </div>
    <p *ngIf="lastResult !== undefined"
       style="padding: 0 24px; color: #6b7280; font-size: 0.875rem;">
      Last result: <strong>{{ lastResult }}</strong>
    </p>
  `,
})
class StoryLauncherComponent {
  private readonly modal = inject(FuseModalService);
  readonly sizes = ['sm', 'md', 'lg', 'fullscreen'] as const;
  lastResult: unknown;

  open(size: typeof this.sizes[number]) {
    const ref = this.modal.open(StoryContentComponent, { size });
    ref.afterClosed().subscribe((r) => (this.lastResult = r));
  }

  openNonDismissable() {
    const ref = this.modal.open(StoryContentComponent, {
      closable: false,
      backdropDismiss: false,
    });
    ref.afterClosed().subscribe((r) => (this.lastResult = r));
  }
}

// ── Confirm launcher ──────────────────────────────────────────────────────────

@Component({
  selector: 'fuse-story-confirm-launcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 12px; padding: 24px;">
      <button (click)="open('danger')"
              style="padding: 8px 16px; background: #fee2e2; border: 1px solid #fca5a5;
                     border-radius: 6px; cursor: pointer;">
        Confirm (danger)
      </button>
      <button (click)="open('warning')"
              style="padding: 8px 16px; background: #fef3c7; border: 1px solid #fcd34d;
                     border-radius: 6px; cursor: pointer;">
        Confirm (warning)
      </button>
      <button (click)="open('info')"
              style="padding: 8px 16px; background: #dbeafe; border: 1px solid #93c5fd;
                     border-radius: 6px; cursor: pointer;">
        Confirm (info)
      </button>
    </div>
    <p *ngIf="lastResult !== undefined"
       style="padding: 0 24px; color: #6b7280; font-size: 0.875rem;">
      Resolved: <strong>{{ lastResult }}</strong>
    </p>
  `,
})
class StoryConfirmLauncherComponent {
  private readonly modal = inject(FuseModalService);
  lastResult: unknown;

  async open(type: 'danger' | 'warning' | 'info') {
    this.lastResult = await this.modal.confirm({
      title: 'Delete item?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep it',
      type,
    });
  }
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Fuse / Modal',
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
};

export default meta;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Sizes: StoryObj = {
  render: () => ({ component: StoryLauncherComponent }),
};

export const ConfirmDialog: StoryObj = {
  render: () => ({ component: StoryConfirmLauncherComponent }),
};
