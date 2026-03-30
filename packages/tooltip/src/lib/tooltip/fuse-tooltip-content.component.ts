import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'fuse-tooltip-content',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="fuse-tooltip" role="tooltip">{{ text() }}</div>`,
  styleUrl: './fuse-tooltip-content.component.scss',
})
export class FuseTooltipContentComponent {
  readonly text = signal('');
}
