import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FuseIconComponent } from '@fuse_ui/icon';

@Component({
  selector: 'fuse-dropdown-item',
  standalone: true,
  imports: [FuseIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-dropdown-item.component.html',
  styleUrl: './fuse-dropdown-item.component.scss',
})
export class FuseDropdownItemComponent {
  // ─── Inputs ──────────────────────────────────────────────────────────────

  readonly label       = input.required<string>();
  readonly icon        = input<string>('');
  readonly disabled    = input<boolean>(false);
  readonly destructive = input<boolean>(false);

  // ─── Outputs ─────────────────────────────────────────────────────────────

  readonly itemClick = output<void>();
}
