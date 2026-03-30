import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { FuseLabelComponent } from '@fuse/label';

@Component({
  selector: 'fuse-form-field',
  standalone: true,
  imports: [FuseLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-form-field.component.html',
  styleUrl: './fuse-form-field.component.scss',
  host: { class: 'fuse-form-field-host' },
})
export class FuseFormFieldComponent {
  readonly label        = input<string>('');
  readonly required     = input<boolean>(false);
  readonly helperText   = input<string>('');
  readonly errorMessage = input<string>('');
  readonly hasError     = input<boolean>(false);
}
