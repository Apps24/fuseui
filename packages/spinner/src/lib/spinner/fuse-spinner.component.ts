import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type FuseSpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'fuse-spinner',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-spinner.component.html',
  styleUrl: './fuse-spinner.component.scss',
  host: {
    '[class]': 'hostClasses()',
    'role': 'status',
    'aria-label': 'Loading',
  },
})
export class FuseSpinnerComponent {
  readonly size = input<FuseSpinnerSize>('md');
  /** Override the spinner colour with any CSS colour value. */
  readonly color = input('');
  /** Wrap the spinner in an absolute-positioned overlay over its container. */
  readonly overlay = input(false);

  protected readonly hostClasses = computed(() =>
    [
      'fuse-spinner-host',
      `fuse-spinner-host--${this.size()}`,
      this.overlay() ? 'fuse-spinner-host--overlay' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );
}
