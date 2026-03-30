# Fuse UI

Angular 18+ and Ionic 8+ component library — signal-based, multi-theme, animated, fully standalone.

## Features

- **Signal-based inputs and outputs** — `input()`, `output()`, `model()` throughout; zero `@Input`/`@Output` decorators
- **Multi-theme: light, dark, ocean, rose + custom** — `data-theme` on `:root`; all `--fuse-*` CSS custom properties update instantly
- **Fluid typography with CSS `clamp()`** — text scales automatically across breakpoints
- **HeroUI-inspired animations with reduced-motion support** — spring-feel enter/exit driven by `data-state` attributes; `prefers-reduced-motion` respected everywhere
- **Works with Angular 18, 19, 20, 21** — peer dependency `>=18.0.0`
- **Compatible with Ionic 8+** — `:host-context(.ios)` and `:host-context(.md)` on every component; `@ionic/angular` is optional

## Packages

| Package | Description |
|---|---|
| `@fuse/core` | Theme service, icon registry, design tokens |
| `@fuse/button` | Button with variants, loading state, icon slots |
| `@fuse/icon` | SVG icon component backed by registry |
| `@fuse/input` | Text input and textarea with label, error, prefix/suffix |
| `@fuse/label` | Form label with required asterisk |
| `@fuse/select` | Dropdown select with CDK overlay |
| `@fuse/checkbox` | Checkbox, checkbox group, radio, radio group |
| `@fuse/card` | Card with header, body, footer slots |
| `@fuse/badge` | Status badge — solid, flat, outline × 5 colours + dot mode |
| `@fuse/avatar` | Avatar with image and initials fallback, status dot |
| `@fuse/skeleton` | Skeleton loader — text, circle, rect variants |
| `@fuse/toast` | Toast notifications with service API |
| `@fuse/modal` | Modal/dialog service with CDK overlay and focus trap |
| `@fuse/alert` | Inline alert — info, success, warning, danger |
| `@fuse/spinner` | Loading spinner with overlay mode |
| `@fuse/tabs` | Tab bar with animated underline indicator |
| `@fuse/accordion` | Collapsible accordion with spring animation |
| `@fuse/chip` | Selectable/closable chip |
| `@fuse/tooltip` | Tooltip directive with CDK overlay |
| `@fuse/popover` | Popover with click/hover trigger and placement |
| `@fuse/dropdown` | Dropdown menu with keyboard navigation |
| `@fuse/breadcrumb` | Breadcrumb with truncation and expand |
| `@fuse/pagination` | Page navigator with ellipsis algorithm |
| `@fuse/slider` | Single and range slider with marks and tooltip |
| `@fuse/form-field` | Form field wrapper with label, helper, error animation |
| `@fuse/empty-state` | Empty state with icon, illustration slot, and action |
| `@fuse/table` | Data table with CDK Table, sort, and loading skeleton |

## Quick start

Install only what you need:

```bash
npm install @fuse/core @fuse/button @fuse/input
```

Import the standalone components directly — no module needed:

```typescript
import { FuseButtonComponent } from '@fuse/button';
import { FuseInputComponent }  from '@fuse/input';

@Component({
  standalone: true,
  imports: [FuseButtonComponent, FuseInputComponent],
  template: `...`,
})
export class MyComponent {}
```

## Usage examples

```html
<!-- Use @if/@for, NO *ngIf/*ngFor -->
@if (items().length) {
  @for (item of items(); track item.id) {
    <fuse-chip [label]="item.name"></fuse-chip>
  }
}

<!-- Solid button with output() event -->
<fuse-button variant="solid" (clicked)="doThing()">Click me</fuse-button>

<!-- Two-way binding with model() -->
<fuse-input [(value)]="myValue" label="Name"></fuse-input>

<!-- Form field wrapping a control -->
<fuse-form-field
  label="Email"
  [required]="true"
  [hasError]="emailInvalid()"
  errorMessage="Enter a valid email">
  <fuse-input fuseControl [(value)]="email" type="email"></fuse-input>
</fuse-form-field>

<!-- Range slider -->
<fuse-slider
  [range]="true"
  [(value)]="priceRange"
  [min]="0"
  [max]="500"
  [showTooltip]="'always'">
</fuse-slider>

<!-- Pagination -->
<fuse-pagination
  [total]="totalItems"
  [pageSize]="20"
  [(currentPage)]="page">
</fuse-pagination>
```

## Theme switching

```typescript
import { inject } from '@angular/core';
import { FuseThemeService } from '@fuse/core';

export class AppComponent {
  private readonly fuseThemeService = inject(FuseThemeService);

  // switches all components instantly
  fuseThemeService.setTheme('ocean'); // 'light' | 'dark' | 'ocean' | 'rose' | string
}
```

Theme is applied via `data-theme` on `:root` and persisted to `localStorage`. All `--fuse-*` CSS custom properties update instantly — no page reload.

Available built-in themes: `light` (default), `dark`, `ocean`, `rose`.

## Peer dependencies

```json
{
  "@angular/core":    ">=18.0.0",
  "@angular/common":  ">=18.0.0",
  "rxjs":             ">=7.4.0"
}
```

`@angular/cdk >=18.0.0` is required by: `@fuse/select`, `@fuse/modal`, `@fuse/tooltip`, `@fuse/dropdown`, `@fuse/table`.

`@angular/forms >=18.0.0` is required by: `@fuse/checkbox`.

`@ionic/angular` is **optional** — all components work in plain Angular apps.

## Reduced motion

Every animated component respects `prefers-reduced-motion: reduce` via `@media` queries and the `[data-reduce-motion="true"]` attribute on `:root` for programmatic control:

```typescript
document.documentElement.setAttribute('data-reduce-motion', 'true');
```

## License

MIT
