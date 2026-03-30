import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'fuse-button',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-color]': 'color()',
  },
  templateUrl: './fuse-button.component.html',
  styleUrl: './fuse-button.component.scss',
})
export class FuseButtonComponent {
  /** Visual style of the button. */
  variant = input<'solid' | 'outline' | 'ghost' | 'link'>('solid');

  /** Colour theme mapped to --fuse-color-* tokens. */
  color = input<'primary' | 'secondary' | 'success' | 'danger'>('primary');

  /** Size variant. */
  size = input<'sm' | 'md' | 'lg'>('md');

  /** Renders the button in a disabled state. */
  disabled = input(false);

  /** Shows a spinner and suppresses click events. */
  loading = input(false);

  /** Native button type attribute. */
  type = input<'button' | 'submit' | 'reset'>('button');

  /** Emits when the button is clicked (blocked when disabled or loading). */
  clicked = output<MouseEvent>();

  protected readonly hostClasses = computed(() =>
    [
      'fuse-btn',
      `fuse-btn--${this.variant()}`,
      `fuse-btn--${this.color()}`,
      `fuse-btn--${this.size()}`,
      this.disabled() ? 'fuse-btn--disabled' : '',
      this.loading() ? 'fuse-btn--loading' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
