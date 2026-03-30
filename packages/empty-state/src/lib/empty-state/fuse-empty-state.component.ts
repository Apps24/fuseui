import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FuseIconComponent } from '@fuse/icon';
import { FuseButtonComponent } from '@fuse/button';

@Component({
  selector: 'fuse-empty-state',
  standalone: true,
  imports: [FuseIconComponent, FuseButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-empty-state.component.html',
  styleUrl: './fuse-empty-state.component.scss',
  host: { class: 'fuse-empty-state-host' },
})
export class FuseEmptyStateComponent {
  readonly icon          = input<string>('');
  readonly title         = input<string>('');
  readonly description   = input<string>('');
  readonly actionLabel   = input<string>('');
  readonly actionVariant = input<'solid' | 'outline'>('outline');
  readonly actionClick   = output<void>();
}
