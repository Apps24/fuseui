import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'fuse-label',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-label.component.html',
  styleUrl: './fuse-label.component.scss',
})
export class FuseLabelComponent {
  /** Associates the label with a form control by id. */
  readonly for = input('');

  /** Renders the required asterisk and applies the required modifier class. */
  readonly required = input(false);

  /** Applies the disabled style modifier. */
  readonly disabled = input(false);
}
