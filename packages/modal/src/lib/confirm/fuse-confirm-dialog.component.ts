import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import type { FuseConfirmOptions } from '../modal/fuse-modal.config';
import type { FuseModalRef } from '../modal/fuse-modal-ref';
import {
  FUSE_MODAL_DATA,
  FUSE_MODAL_REF,
} from '../modal/fuse-modal.tokens';

@Component({
  selector: 'fuse-confirm-dialog',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-confirm-dialog.component.html',
  styleUrl: './fuse-confirm-dialog.component.scss',
})
export class FuseConfirmDialogComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly modalRef = inject<FuseModalRef<any>>(FUSE_MODAL_REF);
  protected readonly options = inject<FuseConfirmOptions>(FUSE_MODAL_DATA);

  protected confirm(): void {
    this.modalRef.close(true);
  }

  protected cancel(): void {
    this.modalRef.close(false);
  }
}
