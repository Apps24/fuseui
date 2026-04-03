import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FuseIconRegistryService } from '@fuse_ui/core';

const SIZE_MAP: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

@Component({
  selector: 'fuse-icon',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fuse-icon.component.html',
  styleUrl: './fuse-icon.component.scss',
})
export class FuseIconComponent {
  /** Name of the icon registered in FuseIconRegistryService. Required. */
  readonly name = input.required<string>();

  /** Size variant, maps to pixel dimensions. */
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

  /** CSS colour value applied to the icon stroke/fill. Defaults to currentColor. */
  readonly color = input('currentColor');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly registry = inject(FuseIconRegistryService);

  protected readonly safeSvg = signal<SafeHtml>('');

  readonly sizeMap = SIZE_MAP;

  constructor() {
    effect(() => {
      const raw = this.registry.getIcon(this.name());
      this.safeSvg.set(raw ? this.sanitizer.bypassSecurityTrustHtml(raw) : '');
    });
  }
}
